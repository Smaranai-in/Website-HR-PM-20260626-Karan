import { Calendar, Monitor } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface InternshipCardProps {
  title: string;
  duration: string;
  mode: string;
  onApply: () => void;
  onViewDetails: () => void;
}

const InternshipCard = ({ title, duration, mode, onApply, onViewDetails }: InternshipCardProps) => {
  return (
    <Card className="glass-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      <CardHeader className="bg-accent/50 rounded-t-lg border-l-4 border-primary">
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-5 w-5 text-secondary" />
            <span className="text-sm">Duration : {duration}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Monitor className="h-5 w-5 text-primary" />
            <span className="text-sm">Mode : {mode}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onViewDetails}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Details
          </button>
          <Button
            onClick={onApply}
            className="bg-primary/20 text-primary hover:bg-primary/30 px-6 rounded-full font-medium"
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternshipCard;
