import { Card, CardContent } from "../../../../components/ui/card";
import { Bot } from "lucide-react";

export default function AIConfig() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">AI Configuration</h2>
            <p className="text-muted-foreground">
              AI configuration settings will be available soon. Stay tuned for updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
