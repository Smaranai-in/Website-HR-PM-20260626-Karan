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
import { Badge } from "../../ui/badge";
import { X } from "lucide-react";

interface ScheduleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internName?: string;
}

export function ScheduleMeetingDialog({
  open,
  onOpenChange,
  internName = "John Doe",
}: ScheduleMeetingDialogProps) {
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [duration, setDuration] = useState("");
  const [meetingType, setMeetingType] = useState("one-on-one");
  const [selectedInterns, setSelectedInterns] = useState<string[]>([internName]);
  const [internInput, setInternInput] = useState("");

  const allInterns = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
    "Tom Brown",
    "Emily Davis",
  ];

  const availableInterns = allInterns.filter(
    (intern) => !selectedInterns.includes(intern)
  );

  const handleAddIntern = (intern: string) => {
    setSelectedInterns((prev) => [...prev, intern]);
    setInternInput("");
  };

  const handleRemoveIntern = (intern: string) => {
    setSelectedInterns((prev) => prev.filter((i) => i !== intern));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meeting Date */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Meeting Date
            </label>
            <Input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Meeting Time */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Meeting Time
            </label>
            <Input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Duration (minutes)
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meeting Type */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Meeting Type
            </label>
            <div className="space-y-2">
              {[
                { value: "one-on-one", label: "One-on-One" },
                { value: "group", label: "Group Meeting" },
                { value: "feedback", label: "Performance Feedback" },
                { value: "project-review", label: "Project Review" },
              ].map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="meetingType"
                    value={type.value}
                    checked={meetingType === type.value}
                    onChange={(e) => setMeetingType(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-foreground">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interns Selection */}
          {meetingType === "group" && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Select Interns
              </label>
              <Select value={internInput} onValueChange={handleAddIntern}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add interns to meeting" />
                </SelectTrigger>
                <SelectContent>
                  {availableInterns.map((intern) => (
                    <SelectItem key={intern} value={intern}>
                      {intern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Interns */}
              {selectedInterns.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedInterns.map((intern) => (
                    <Badge
                      key={intern}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {intern}
                      <button
                        onClick={() => handleRemoveIntern(intern)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
            className="gradient-primary text-primary-foreground border-0"
          >
            Schedule Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
