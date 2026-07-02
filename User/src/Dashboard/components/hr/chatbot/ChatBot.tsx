import { useState } from "react";
import { X, Paperclip, Send, Bot } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedActions = [
  "Recommend top candidates",
  "Summarize interview results",
  "Notify supervisor for onboarding",
  "Generate offer/confirmation letters",
];

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[380px] bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-violet-600 bg-clip-text text-transparent">
            SmaranBot
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat Content */}
      <div className="p-4 min-h-[350px] flex flex-col gap-4">
        {/* Bot Message */}
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl rounded-tl-sm p-4 max-w-[90%]">
          <p className="text-foreground text-sm">
            Hello Musfiq, how can I assist you with hiring and intern operations?
          </p>
        </div>

        {/* Suggested Actions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
          <h4 className="font-semibold text-foreground mb-3">Suggested Actions:</h4>
          <ul className="space-y-2">
            {suggestedActions.map((action, index) => (
              <li key={index} className="flex items-center gap-2 text-foreground text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="relative mb-3">
          <Input
            placeholder="Type your questions here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pr-4 rounded-full border-violet-300 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-2 rounded-full">
            <Paperclip className="h-4 w-4" />
            Attach
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 px-6"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ChatBotButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50 flex items-center justify-center group"
      style={{
        borderRadius: "50% 50% 50% 10%",
      }}
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center" style={{ borderRadius: "50% 50% 50% 8%" }}>
        <Bot className="h-8 w-8 text-cyan-500" />
      </div>
    </button>
  );
}
