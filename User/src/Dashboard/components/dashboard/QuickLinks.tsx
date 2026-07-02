import { ListTodo, FileText, Calendar, Download } from "lucide-react";

const links = [
  { icon: ListTodo, label: "View all tasks", color: "text-primary" },
  { icon: FileText, label: "Submit today's report", color: "text-primary" },
  { icon: Calendar, label: "Open attendance log", color: "text-primary" },
  { icon: Download, label: "Download Offer letter", color: "text-primary" },
];

const QuickLinks = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
      <p className="text-sm text-muted-foreground mb-4">Jump directly to your important actions</p>
      
      <div className="space-y-3">
        {links.map((link, index) => (
          <button 
            key={index}
            className="w-full flex items-center gap-3 text-sm hover:bg-muted p-2 rounded-lg transition-colors"
          >
            <link.icon className={`w-4 h-4 ${link.color}`} />
            <span className={link.color}>{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
