import { useState } from "react";
import { X, Plus } from "lucide-react";
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

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectedIntern {
  id: string;
  name: string;
}

export function AssignTaskDialog({ open, onOpenChange }: AssignTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [selectedInterns, setSelectedInterns] = useState<SelectedIntern[]>([]);
  const [internInput, setInternInput] = useState("");

  const allInterns = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Mike Johnson" },
    { id: "4", name: "Sarah Williams" },
    { id: "5", name: "Tom Brown" },
    { id: "6", name: "Emily Davis" },
  ];

  const availableInterns = allInterns.filter(
    (intern) => !selectedInterns.find((s) => s.id === intern.id)
  );

  const handleAddIntern = (id: string) => {
    const intern = allInterns.find((i) => i.id === id);
    if (intern) {
      setSelectedInterns((prev) => [...prev, intern]);
      setInternInput("");
    }
  };

  const handleRemoveIntern = (id: string) => {
    setSelectedInterns((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAssign = () => {
    // Assign task logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Task Title
            </label>
            <Input
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter task description..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-smaran-purple focus:ring-offset-background focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Priority
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Deadline
            </label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Assign To
            </label>
            <Select value={internInput} onValueChange={handleAddIntern}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select intern" />
              </SelectTrigger>
              <SelectContent>
                {availableInterns.map((intern) => (
                  <SelectItem key={intern.id} value={intern.id}>
                    {intern.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Interns List */}
            {selectedInterns.length > 0 && (
              <div className="mt-3">
                <div className="border border-border rounded-lg divide-y">
                  {selectedInterns.map((intern) => (
                    <div
                      key={intern.id}
                      className="flex items-center justify-between p-3"
                    >
                      <span className="text-sm text-foreground">{intern.name}</span>
                      <button
                        onClick={() => handleRemoveIntern(intern.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors">
              <Plus className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to add attachments
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            className="gradient-primary text-primary-foreground border-0"
          >
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
