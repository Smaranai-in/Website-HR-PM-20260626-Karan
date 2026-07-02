import { ArrowRight } from "lucide-react";

const LeaveStatus = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-3">Leave Status</h3>
      
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <p className="text-sm">
          <span className="font-medium text-foreground">Next Leave:</span>{" "}
          <span className="text-muted-foreground">05-07 Nov (Sick Leave)</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-foreground">Status :</span>{" "}
          <span className="text-pending">Pending Approval</span>
        </p>
        <button className="text-sm text-primary mt-2 flex items-center gap-1 hover:underline">
          View Leave Details <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default LeaveStatus;
