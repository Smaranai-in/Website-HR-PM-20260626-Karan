import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface InternInfo {
  id: string;
  name: string;
  role: string;
}

interface FireInternDialogProps {
  isOpen: boolean;
  onClose: () => void;
  intern: InternInfo | null;
  onConfirm: (reason: string) => void;
}

export function FireInternDialog({
  isOpen,
  onClose,
  intern,
  onConfirm,
}: FireInternDialogProps) {
  const [step, setStep] = useState<"confirm" | "reason">("confirm");
  const [reason, setReason] = useState("");

  const handleContinue = () => {
    setStep("reason");
  };

  const handleFireIntern = () => {
    if (reason.trim()) {
      onConfirm(reason);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep("confirm");
    setReason("");
    onClose();
  };

  if (!intern) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0 overflow-hidden">
        {step === "confirm" ? (
          <div className="p-6">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-primary">
                Fire Intern
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-foreground">
                You are about to terminate the internship of :{" "}
                <span className="font-bold">
                  {intern.name} ({intern.role})
                </span>
              </p>
              <p className="text-foreground">This action is permanent and will:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground ml-2">
                <li>Revoke System access immediately</li>
                <li>Notify the intern and supervisor</li>
                <li>Mark Status as fired</li>
                <li>Archive ongoing tasks</li>
              </ul>
              <p className="text-foreground font-medium">
                Are you sure you want to continue?
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-full px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinue}
                  className="rounded-full px-6 bg-red-100 text-red-600 hover:bg-red-200 border-0"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl">
                <span className="font-bold text-primary">Fire Intern</span>
                <span className="text-muted-foreground font-normal"> - Provide Reason</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-foreground">
                Please provide a reason for terminating this intern.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Reason for Firing (required):
                </label>
                <Textarea
                  placeholder="Write the reason for firing these intern"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[100px] resize-none rounded-xl"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("confirm")}
                  className="rounded-full px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFireIntern}
                  disabled={!reason.trim()}
                  className="rounded-full px-6 bg-red-100 text-red-600 hover:bg-red-200 border-0 disabled:opacity-50"
                >
                  Fire Intern
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
