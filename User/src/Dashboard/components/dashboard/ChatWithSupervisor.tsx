import { Paperclip, ChevronDown, Send, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const ChatWithSupervisor = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-4">Chat With Supervisor</h3>
      
      <Textarea 
        placeholder="Write a message to Supervisor..."
        className="min-h-24 mb-4 resize-none"
      />
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Paperclip className="w-4 h-4" />
          Attach
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          Task Link
          <ChevronDown className="w-4 h-4" />
        </Button>
        <Button size="sm" className="ml-auto gap-2">
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>
      
      <button className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors flex items-center justify-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Open Conversation
      </button>
    </div>
  );
};

export default ChatWithSupervisor;
