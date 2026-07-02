import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface StartMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internName?: string;
}

export function StartMeetingDialog({
  open,
  onOpenChange,
  internName = "John Doe",
}: StartMeetingDialogProps) {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingType, setMeetingType] = useState("general");
  const [agenda, setAgenda] = useState("");

  const handleStart = () => {
    // Meeting start logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start Meeting with {internName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meeting Title */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Meeting Title
            </label>
            <Input
              placeholder="Enter meeting title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Meeting Type */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Meeting Type
            </label>
            <Select value={meetingType} onValueChange={setMeetingType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Discussion</SelectItem>
                <SelectItem value="feedback">Feedback Session</SelectItem>
                <SelectItem value="performance">Performance Review</SelectItem>
                <SelectItem value="project">Project Review</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agenda */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Agenda (Optional)
            </label>
            <textarea
              placeholder="Add agenda items..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-smaran-purple focus:ring-offset-background focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Quick Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> The meeting link will be sent to {internName} via
              email and in-app notification.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            className="gradient-primary text-primary-foreground border-0"
          >
            Start Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
