import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface TrialTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrialTasksDialog({ open, onOpenChange }: TrialTasksDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trial Tasks Checklist</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">
            Please complete the following tasks to finish your trial period...
          </p>
          {/* Add more details here if needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
