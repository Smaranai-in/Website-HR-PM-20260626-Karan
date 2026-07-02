import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

export function WeeklyAISummary() {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Weekly AI Summary</CardTitle>
        <p className="text-sm text-muted-foreground">Generated on 5 Nov, 2025</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Highlighted Summary */}
        <div className="bg-stat-orange rounded-lg p-4">
          <p className="text-sm italic text-foreground/90">
            This week, 6 new interns joined, 91% tasks were completed on time, and overall engagement increased by 12%. No attendance issues detected.
          </p>
        </div>

        {/* Weekly Calendar */}
        <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              This week, 6 new interns joined, 91% tasks were completed on time, and overall engagement increased by 12%. No attendance issues detected.
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded text-[10px] flex items-center justify-center font-medium ${
                    i < 5 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 bg-stat-cyan rounded-lg p-3">
          <div className="flex-1">
            <p className="text-sm">
              This week, 6 new interns joined, 91% tasks were completed on time, and overall engagement increased
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">530</p>
            <p className="text-xs text-muted-foreground">Lorem Ipsum</p>
          </div>
        </div>

        {/* Regenerate Button */}
        <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/5">
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate Summary
        </Button>
      </CardContent>
    </Card>
  );
}
