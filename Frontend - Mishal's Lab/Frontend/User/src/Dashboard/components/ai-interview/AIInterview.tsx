import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Upload, Send, Bot, User, FileText } from "lucide-react";
import { toast } from "sonner";

interface Message {
  type: "ai" | "user";
  content: string;
}

interface AIInterviewProps {
  role: string;
  onBack: () => void;
  onComplete: () => void;
}

const AIInterview = ({ role, onBack, onComplete }: AIInterviewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { type: "ai", content: "Welcome! Let’s begin your Interview." },
    { type: "ai", content: "Please upload your resume." },
  ]);
  const [input, setInput] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Pasting is disabled during the interview.");
    };
    const handleGlobalCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copying is disabled during the interview.");
    };
    const handleGlobalCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    const handleGlobalContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      toast.error("Dropping text is disabled during the interview.");
    };

    window.addEventListener("paste", handleGlobalPaste);
    window.addEventListener("copy", handleGlobalCopy);
    window.addEventListener("cut", handleGlobalCut);
    window.addEventListener("contextmenu", handleGlobalContextMenu);
    window.addEventListener("drop", handleGlobalDrop);

    // Disable text selection on the body during the interview
    const originalUserSelect = document.body.style.getPropertyValue("user-select");
    const originalWebkitUserSelect = document.body.style.getPropertyValue("-webkit-user-select");
    const originalMozUserSelect = document.body.style.getPropertyValue("-moz-user-select");
    const originalMsUserSelect = document.body.style.getPropertyValue("-ms-user-select");

    document.body.style.setProperty("user-select", "none");
    document.body.style.setProperty("-webkit-user-select", "none");
    document.body.style.setProperty("-moz-user-select", "none");
    document.body.style.setProperty("-ms-user-select", "none");

    return () => {
      window.removeEventListener("paste", handleGlobalPaste);
      window.removeEventListener("copy", handleGlobalCopy);
      window.removeEventListener("cut", handleGlobalCut);
      window.removeEventListener("contextmenu", handleGlobalContextMenu);
      window.removeEventListener("drop", handleGlobalDrop);

      document.body.style.setProperty("user-select", originalUserSelect);
      document.body.style.setProperty("-webkit-user-select", originalWebkitUserSelect);
      document.body.style.setProperty("-moz-user-select", originalMozUserSelect);
      document.body.style.setProperty("-ms-user-select", originalMsUserSelect);
    };
  }, []);

  const questions = [
    "What is your experience with figma?",
    "Describe a challenging project you worked on.",
    "How do you handle tight deadlines?",
  ];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeUploaded(true);
      setMessages((prev) => [
        ...prev,
        { type: "user", content: `Uploaded: ${file.name}` },
        { type: "ai", content: questions[0] },
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { type: "user", content: input },
    ];

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      newMessages.push({ type: "ai", content: questions[currentQuestion + 1] });
      setMessages(newMessages);
    } else {
      setMessages(newMessages);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d8cbe8] via-[#b8d6df] to-[#a7c2dd] flex flex-col">
      <div className="max-w-6xl mx-auto py-8 px-6 flex-1 flex flex-col">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">AI Screening</h1>
          <div className="text-right">
            <p className="text-sm font-medium">Step 1 of 3</p>
            <div className="flex gap-1 mt-1">
              <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Chat Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 overflow-y-auto mb-4 w-full">
          <div className="space-y-6">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${message.type === "user" ? "justify-end" : ""
                  }`}
              >
                {message.type === "ai" && (
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-blue-900" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${message.type === "ai"
                    ? "bg-blue-100 text-gray-800"
                    : "bg-purple-200 text-gray-900"
                    }`}
                >
                  <span className="font-semibold">
                    {message.type === "ai" ? "AI: " : "You: "}
                  </span>
                  {message.content}
                </div>

                {message.type === "user" && (
                  <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center">
                    <User size={18} className="text-purple-900" />
                  </div>
                )}
              </div>
            ))}

            {!resumeUploaded && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={handleUploadClick}
                  className="w-full bg-blue-400 text-white py-4 rounded-xl shadow-md hover:bg-blue-500 transition flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  Upload Resume
                </button>
              </>
            )}

            {resumeFile && (
              <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                <FileText size={18} className="text-blue-600" />
                <span className="text-sm">{resumeFile.name}</span>
              </div>
            )}

          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="write your answer here..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!resumeUploaded}
            onPaste={(e) => {
              e.preventDefault();
              toast.error("Pasting answers is disabled during the interview.");
            }}
            onCopy={(e) => {
              e.preventDefault();
              toast.error("Copying text is disabled during the interview.");
            }}
            onCut={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              toast.error("Dropping text is disabled during the interview.");
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button
            onClick={handleSend}
            disabled={!resumeUploaded}
            className="bg-blue-400 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-500 transition flex items-center gap-2"
          >
            <Send size={16} />
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIInterview;