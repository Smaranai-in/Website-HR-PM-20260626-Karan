import { Progress } from "../ui/progress";

const TodaysSummary = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-2">Today's summary</h3>
      <p className="text-sm text-muted-foreground mb-4">
        You've completed <span className="font-semibold text-foreground">2 / 3</span> high-priority tasks. 
        Submit your report before <span className="font-semibold text-foreground">6:00 PM</span>.
      </p>
      
      <div className="flex items-center gap-4">
        <Progress value={75} className="flex-1 h-3" />
        <span className="text-sm font-medium text-foreground">Progress : 75%</span>
      </div>
    </div>
  );
};

export default TodaysSummary;
