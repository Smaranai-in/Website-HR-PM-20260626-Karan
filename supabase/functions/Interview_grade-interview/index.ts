/* global Deno */
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
 * Robustly sanitize and parse a JSON object from an LLM response.
 * Handles unescaped quotes, backslashes, newlines, code snippets,
 * and other special characters that break standard JSON.parse().
 */
function robustJsonParseObject(rawText: string): Record<string, unknown> {
  // Step 1: Strip markdown code fences
  let text = rawText.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();

  // Step 2: Try direct parse (fast path)
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // continue
  }

  // Step 3: Extract JSON object portion
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    text = objMatch[0];
  }

  // Step 4: Try parsing extracted object
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // continue to sanitization
  }

  // Step 5: Sanitize common issues and retry
  let sanitized = text;
  
  // Replace literal newlines inside strings (between quotes)
  // This regex-based approach handles the most common cases
  sanitized = sanitized.replace(/:\s*"([^"]*)"/gs, (match, content) => {
    const cleaned = content
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `: "${cleaned}"`;
  });

  try {
    const parsed = JSON.parse(sanitized);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // continue
  }

  // Step 6: Try to extract key fields manually using regex
  const scoreMatch = text.match(/"score"\s*:\s*(\d+(?:\.\d+)?)/);
  const feedbackMatch = text.match(/"feedback"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
  const suggestionsMatch = text.match(/"suggestions"\s*:\s*\[([\s\S]*?)\]/);

  if (scoreMatch) {
    const result: Record<string, unknown> = {
      score: parseFloat(scoreMatch[1]),
      feedback: feedbackMatch ? feedbackMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : 'Grading completed.',
      suggestions: [],
    };

    if (suggestionsMatch) {
      // Extract individual suggestion strings
      const suggestionsRaw = suggestionsMatch[1];
      const suggestionStrings = suggestionsRaw.match(/"((?:[^"\\]|\\.)*)"/g);
      if (suggestionStrings) {
        result.suggestions = suggestionStrings.map(s => 
          s.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"')
        );
      }
    }

    return result;
  }

  throw new Error('Could not parse grading result from Gemini response');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

  try {
    // Authenticate the user
    await getAuthUser(req);
    const { questions, answers, jobRole, tabSwitchCount, faceMissingDuration, faceVisibilityWarnings, cameraDisconnectedEvents, interviewId } = await req.json();

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set');

    // Fallback: If jobRole is not passed, default to a generic technical role
    const roleName = jobRole || 'Technical Candidate';

    const prompt = `You are an expert technical interviewer. Grade the candidate's answers for the position of ${roleName}.

Questions asked:
${questions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

Candidate's answers:
${answers.map((a: string, i: number) => `${i + 1}. ${a || '(No answer provided)'}`).join('\n')}

CRITICAL RULES FOR YOUR RESPONSE:
1. Return ONLY a valid JSON object with no additional text, markdown, or formatting.
2. The JSON must have these exact keys: "score", "feedback", "suggestions"
3. "score": A number from 0 to 100
4. "feedback": A plain text string summarizing strengths and weaknesses. Do NOT include any code, special characters, or formatting — just plain English.
5. "suggestions": An array of exactly 3 plain text strings with tips for improvement. No code, no special characters.
6. Keep all string values as simple plain text. Avoid quotes-within-quotes, backslashes, or any characters that could break JSON parsing.

Example format:
{"score": 72, "feedback": "The candidate demonstrated solid understanding of core concepts but struggled with advanced topics.", "suggestions": ["Practice system design problems to strengthen architectural thinking.", "Review concurrency and parallelism concepts in depth.", "Work on explaining technical decisions more clearly."]}`;

    // UPDATED TO gemini-2.5-flash with JSON response mode
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini grading response (first 500 chars):', rawText.substring(0, 500));
    
    const result = robustJsonParseObject(rawText);

    // Validate and coerce the result
    if (typeof result.score !== 'number' || isNaN(result.score as number)) {
      result.score = 0;
    }
    result.score = Math.max(0, Math.min(100, result.score as number));

    if (typeof result.feedback !== 'string') {
      result.feedback = 'Grading completed.';
    }

    if (!Array.isArray(result.suggestions)) {
      result.suggestions = ['Review the core concepts for this role.', 'Practice answering interview questions aloud.', 'Build projects to demonstrate practical skills.'];
    }

    // Inject proctoring data into response
    const actualTabSwitches = tabSwitchCount ?? 0;
    const actualFaceMissingDuration = faceMissingDuration ?? 0;
    const actualFaceWarnings = faceVisibilityWarnings ?? 0;

    result.tab_switch_count = actualTabSwitches;
    result.face_missing_duration = actualFaceMissingDuration;
    result.face_visibility_warnings = actualFaceWarnings;
    result.is_suspicious = (actualTabSwitches >= 3) || (actualFaceMissingDuration >= 30);

    // Update database record with grade results
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (supabaseUrl && supabaseServiceRoleKey && interviewId) {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
      await supabase
        .from('interviews')
        .update({
          score: result.score,
          feedback: result.feedback,
          is_suspicious: result.is_suspicious,
          tab_switch_count: result.tab_switch_count,
          face_missing_duration: actualFaceMissingDuration,
          face_visibility_warnings: actualFaceWarnings,
          camera_disconnected_events: cameraDisconnectedEvents ?? [],
        })
        .eq('id', interviewId);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in grade-interview:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});