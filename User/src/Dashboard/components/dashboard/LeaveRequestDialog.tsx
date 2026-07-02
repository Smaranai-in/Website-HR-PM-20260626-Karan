import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../../supabaseClient";

interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment_url?: string | null;
  status: string;
  remarks?: string | null;
  w_users?: {
    name?: string;
    email?: string;
  } | null;
}

interface LeaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
  onSuccess?: () => void;
}

export function LeaveRequestDialog({ open, onOpenChange, request, onSuccess }: LeaveRequestDialogProps) {
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleUpdateStatus = async (status: string) => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login again");
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: "update_leave_status",
          leave_id: request.id,
          status,
          remarks
        })
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update leave status");
      }
      
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      onSuccess?.();
      onOpenChange(false);
      setRemarks("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecideLater = () => {
    onOpenChange(false);
    setRemarks("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-primary">Leave request</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {request.w_users?.name || "Intern"} | {request.w_users?.email || "—"}
            </p>
          </DialogHeader>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="font-semibold text-foreground">Leave Type :</span>
              <span className="text-muted-foreground">{request.leave_type}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="font-semibold text-foreground">Duration :</span>
              <span className="text-muted-foreground">{request.start_date} → {request.end_date}</span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="font-semibold text-foreground">Reason :</span>
              <span className="text-muted-foreground">{request.reason}</span>
            </div>

            {request.attachment_url ? (
              <Button 
                variant="outline" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white border-none gap-2"
                onClick={() => window.open(request.attachment_url!, "_blank")}
              >
                <Download className="h-4 w-4" />
                View Attachment
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground italic">No attachment provided</p>
            )}

            <div className="space-y-2">
              <label className="text-foreground font-medium">
                Remarks <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Textarea
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 rounded-full px-6"
              onClick={() => handleUpdateStatus("Approved")}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              Approve Leave
            </Button>
            <Button
              variant="outline"
              className="border-red-400 bg-red-100 text-red-600 hover:bg-red-200 rounded-full px-6"
              onClick={() => handleUpdateStatus("Rejected")}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              Reject Leave
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 rounded-full px-6"
              onClick={handleDecideLater}
              disabled={isSubmitting}
            >
              Decide Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
