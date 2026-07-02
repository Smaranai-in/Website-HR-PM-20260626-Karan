import { useState } from "react";
import { X, Paperclip, Send } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import chatbotIcon from "../../../assets/chatbot-icon.png";

const suggestedActions = [
  "Show team performance summary",
  "Pending approvals & feedback",
  "Spot low productivity interns",
  "Assign quick tasks",
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 overflow-hidden"
      >
        <img src={chatbotIcon} alt="Chat" className="h-full w-full object-cover" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] rounded-2xl bg-card shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="gradient-chatbot px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
                <img src={chatbotIcon} alt="Bot" className="h-8 w-8" />
              </div>
              <span className="text-white font-semibold text-lg">SmaranBot</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 h-[350px] overflow-y-auto">
            {/* Bot Message */}
            <div className="bg-smaran-light-purple/20 rounded-xl p-3 mb-4 max-w-[85%]">
              <p className="text-sm text-foreground">
                Hello Musfiq, how can I assist in managing your interns?
              </p>
            </div>

            {/* Suggested Actions */}
            <div className="bg-smaran-blue/10 rounded-xl p-4 border border-smaran-blue/20">
              <h4 className="font-semibold text-foreground mb-3">Suggested Actions:</h4>
              <ul className="space-y-2">
                {suggestedActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-smaran-blue mt-1">•</span>
                    <button className="text-sm text-foreground hover:text-smaran-blue transition-colors text-left">
                      {action}
                    </button>
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
                className="pr-4 rounded-full border-smaran-purple/30 focus:border-smaran-purple"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Paperclip className="h-4 w-4" />
                Attach
              </Button>
              <Button 
                size="sm" 
                className="rounded-full px-6 gradient-primary text-primary-foreground border-0"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
