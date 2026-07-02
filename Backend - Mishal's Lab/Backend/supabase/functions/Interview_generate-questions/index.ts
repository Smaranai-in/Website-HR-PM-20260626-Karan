import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const getAuthUser = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Missing Authorization Header");

  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) throw new Error("Invalid Auth Token");
  return user;
};

/**
 * Robustly sanitize and parse a JSON string from an LLM response.
 * Handles unescaped quotes, backslashes, newlines, control characters,
 * and code snippets that break standard JSON.parse().
 */
function robustJsonParse(rawText: string): unknown {
  // Step 1: Strip markdown code fences
  let text = rawText.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();

  // Step 2: Try direct parse first (fast path)
  try {
    return JSON.parse(text);
  } catch {
    // continue to sanitization
  }

  // Step 3: Extract the JSON array portion
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    text = arrayMatch[0];
  }

  // Step 4: Try parsing the extracted array
  try {
    return JSON.parse(text);
  } catch {
    // continue to deep sanitization
  }

  // Step 5: Deep sanitization — rebuild the JSON string by string
  // Strategy: manually extract strings from the array using a state machine
  try {
    const questions: string[] = [];
    let i = text.indexOf('[');
    if (i === -1) throw new Error('No array found');
    i++; // skip '['

    while (i < text.length) {
      // Skip whitespace and commas
      while (i < text.length && (text[i] === ' ' || text[i] === '\n' || text[i] === '\r' || text[i] === '\t' || text[i] === ',')) {
        i++;
      }

      if (i >= text.length || text[i] === ']') break;

      if (text[i] === '"') {
        // Parse a JSON string manually, handling escaped and unescaped chars
        i++; // skip opening quote
        let str = '';
        let escaped = false;

        while (i < text.length) {
          const ch = text[i];

          if (escaped) {
            // Handle standard JSON escape sequences
            switch (ch) {
              case '"': str += '"'; break;
              case '\\': str += '\\'; break;
              case '/': str += '/'; break;
              case 'n': str += '\n'; break;
              case 'r': str += '\r'; break;
              case 't': str += '\t'; break;
              case 'b': str += '\b'; break;
              case 'f': str += '\f'; break;
              case 'u': {
                // Unicode escape \uXXXX
                const hex = text.substring(i + 1, i + 5);
                if (/^[0-9a-fA-F]{4}$/.test(hex)) {
                  str += String.fromCharCode(parseInt(hex, 16));
                  i += 4;
                } else {
                  str += '\\u';
                }
                break;
              }
              default:
                // Unknown escape — keep both characters
                str += '\\' + ch;
                break;
            }
            escaped = false;
            i++;
            continue;
          }

          if (ch === '\\') {
            escaped = true;
            i++;
            continue;
          }

          if (ch === '"') {
            // Check if this is really the end of the string
            // Look ahead: after optional whitespace, should be , or ]
            let lookAhead = i + 1;
            while (lookAhead < text.length && (text[lookAhead] === ' ' || text[lookAhead] === '\n' || text[lookAhead] === '\r' || text[lookAhead] === '\t')) {
              lookAhead++;
            }
            if (lookAhead >= text.length || text[lookAhead] === ',' || text[lookAhead] === ']') {
              i++; // skip closing quote
              break;
            } else {
              // This quote is inside the string (unescaped) — treat as literal
              str += '"';
              i++;
              continue;
            }
          }

          // Replace raw newlines with spaces (they shouldn't be in JSON strings)
          if (ch === '\n' || ch === '\r') {
            str += ' ';
            i++;
            continue;
          }

          str += ch;
          i++;
        }

        if (str.trim().length > 0) {
          questions.push(str.trim());
        }
      } else {
        // Skip unexpected characters
        i++;
      }
    }

    if (questions.length > 0) {
      return questions;
    }
  } catch {
    // continue to line-based fallback
  }

  // Step 6: Last resort — extract question-like lines from the raw text
  const lines = rawText.split('\n')
    .map(l => l.replace(/^[\d\.\-\*\s]+/, '').replace(/^["']|["']$/g, '').trim())
    .filter(l => l.length > 15 && l.endsWith('?'));

  if (lines.length >= 3) {
    return lines.slice(0, 5);
  }

  throw new Error('Could not parse questions from Gemini response');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

  try {
    // Authenticate the user
    await getAuthUser(req);

    const body = await req.json();
    const { jobRole, skillRating } = body;

    // Better validation with detailed error messages
    if (!jobRole || jobRole.trim() === '') {
      throw new Error('Job role is required and cannot be empty');
    }
    
    if (skillRating === undefined || skillRating === null) {
      throw new Error('Skill rating is required');
    }

    // Convert skillRating to number if it's a string
    const rating = typeof skillRating === 'string' ? parseInt(skillRating, 10) : Number(skillRating);
    
    if (isNaN(rating) || rating < 1 || rating > 10) {
      throw new Error('Skill rating must be a number between 1 and 10');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not set in Supabase. Please set it in Supabase Dashboard > Edge Functions > Settings > Secrets');
    }

    // Determine difficulty tier for clearer prompting
    let difficultyTier: string;
    if (rating <= 3) {
      difficultyTier = 'beginner-level (fundamental concepts, definitions, simple scenarios)';
    } else if (rating <= 6) {
      difficultyTier = 'intermediate-level (practical application, problem-solving, design considerations)';
    } else if (rating <= 8) {
      difficultyTier = 'advanced-level (system design, optimization, architecture trade-offs, complex debugging)';
    } else {
      difficultyTier = 'expert-level (deep internals, distributed systems, performance tuning, cutting-edge concepts)';
    }

    const prompt = `You are an expert technical interviewer. Generate exactly 5 unique ${difficultyTier} interview questions for a "${jobRole}" position.

CRITICAL RULES FOR YOUR RESPONSE:
1. Return ONLY a JSON array of exactly 5 strings. No other text, no markdown, no explanation.
2. Each question must be a plain text string — do NOT include any code snippets, code blocks, or programming syntax inside the questions.
3. Instead of embedding code, describe the concept or scenario in plain English. For example, instead of writing code like "=== vs ==", write "the difference between strict equality and loose equality".
4. Do NOT use backticks, angle brackets, or any special formatting inside the question strings.
5. Make sure each question is genuinely different and tests a distinct skill area.

Example of correct format:
["What is the difference between strict equality and loose equality in JavaScript?", "Explain how the event loop works and why it matters for asynchronous programming.", "How would you design a caching layer for a high-traffic web application?", "Describe the trade-offs between SQL and NoSQL databases for a social media platform.", "What strategies would you use to debug a memory leak in a production Node.js application?"]`;

    // Use gemini-2.5-flash model with JSON response mode
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API HTTP error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid Gemini response structure:', JSON.stringify(data));
      throw new Error('Invalid response structure from Gemini API');
    }

    const rawText = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini response (first 500 chars):', rawText.substring(0, 500));

    let questions: string[];
    try {
      const parsed = robustJsonParse(rawText);
      if (Array.isArray(parsed)) {
        questions = parsed.map((q: unknown) => String(q).trim()).filter((q: string) => q.length > 0);
      } else {
        throw new Error('Parsed result is not an array');
      }
    } catch (parseErr) {
      console.error('All JSON parsing strategies failed:', parseErr);
      console.error('Raw text was:', rawText);
      // Ultimate fallback — but this should rarely be reached now
      questions = [
        `Explain the key technical skills required for a ${jobRole} role.`,
        `Describe a challenging project scenario for a ${jobRole} and how you would approach it.`,
        `What are the most important technical concepts a ${jobRole} should understand?`,
        `How do you stay updated with the latest technologies relevant to ${jobRole}?`,
        `Explain a technical decision you would make as a ${jobRole} and why.`,
      ];
    }

    // Ensure we always return exactly 5 questions
    if (questions.length < 5) {
      const fillers = [
        `What common challenges do ${jobRole} professionals face, and how would you address them?`,
        `Describe your approach to debugging a complex issue in a ${jobRole} context.`,
        `How would you prioritize tasks when working under tight deadlines as a ${jobRole}?`,
        `What tools and methodologies do you consider essential for a ${jobRole}?`,
        `How do you ensure code quality and maintainability in your work as a ${jobRole}?`,
      ];
      while (questions.length < 5) {
        questions.push(fillers[questions.length % fillers.length]);
      }
    } else if (questions.length > 5) {
      questions = questions.slice(0, 5);
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-questions:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});