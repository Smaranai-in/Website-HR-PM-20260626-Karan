import { useState } from "react";
import { X, Paperclip, ChevronDown} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import chatbotIcon from "../assets/chatbot-icon.png";

const suggestedActions = [
  "Summarize my pending tasks",
  "Check my attendance & hours",
  "Help me finish onboarding",
  "create today's report for me",
];

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50 overflow-hidden"
        >
          <img src={chatbotIcon} alt="Chatbot" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-300 to-purple-400 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={chatbotIcon} alt="SmaranBot" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-lg text-purple-800">SmaranBot</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-purple-800" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 h-80 overflow-y-auto">
            {/* Bot Message */}
            <div className="flex justify-start mb-4">
              <div className="bg-purple-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                <p className="text-sm">How can I help you today?</p>
              </div>
            </div>

            {/* Suggested Actions */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold mb-3">Suggested Actions:</h4>
              <ul className="space-y-2">
                {suggestedActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <button className="text-sm text-left hover:text-primary transition-colors">
                      {action}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <Input
              placeholder="Type your questions here..."
              className="mb-3 rounded-full border-purple-200 focus:border-purple-400"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Paperclip className="w-4 h-4" />
                Attach
              </Button>
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                Task Link
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button size="sm" className="ml-auto rounded-full bg-blue-100 text-primary hover:bg-blue-200">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
