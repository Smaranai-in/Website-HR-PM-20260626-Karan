import { Card, CardContent } from "./ui/card";

type StatusCardProps = {
  status: string;
  daysLeft: number;
  internId: string;
  manager: string;
};

export default function StatusCard({ status, daysLeft, internId, manager }: StatusCardProps) {
  return (
    <Card className="border border-border/60 bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="text-xl font-semibold text-foreground">{status}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Intern ID: <span className="font-medium text-foreground">{internId}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Manager: <span className="font-medium text-foreground">{manager}</span>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-center sm:min-w-[160px]">
            <div className="text-sm text-muted-foreground">Days left</div>
            <div className="text-3xl font-bold text-foreground">{daysLeft}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

