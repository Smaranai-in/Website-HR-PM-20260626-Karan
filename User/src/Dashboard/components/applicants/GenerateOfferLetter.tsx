import { useState } from "react";
import type { Applicant } from "./ApplicantCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Mail, CalendarIcon, Upload, Eye, ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import smaranLogo from "../../assets/smaran-logo.png";

interface GenerateOfferLetterProps {
  applicant: Applicant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const managerNames: Record<string, string> = {
  ravi: "Ravi Kumar",
  priya: "Priya Sharma",
  amit: "Amit Patel",
  sneha: "Sneha Reddy",
};

export function GenerateOfferLetter({ applicant, open, onOpenChange }: GenerateOfferLetterProps) {
  const [startDate, setStartDate] = useState<Date>(new Date("2025-11-05"));
  const [duration, setDuration] = useState<string>("3");
  const [stipend, setStipend] = useState<string>("12000");
  const [manager, setManager] = useState<string>("ravi");
  const [template, setTemplate] = useState<string>("standard");
  const [showPreview, setShowPreview] = useState(false);

  if (!applicant) return null;

  const formattedDate = startDate ? format(startDate, "d MMMM, yyyy") : "5 November, 2025";
  const endDate = startDate
    ? format(new Date(startDate.getTime() + parseInt(duration) * 30 * 24 * 60 * 60 * 1000), "d MMMM, yyyy")
    : "5 February, 2026";

  const OfferLetterPreview = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-lg font-semibold text-foreground">Offer Letter Preview</h2>
      </div>

      <ScrollArea className="h-[500px] rounded-lg border border-border">
        <div className="bg-white p-8 min-h-full">
          {/* Letter Header */}
          <div className="flex items-center justify-between mb-8">
            <img src={smaranLogo} alt="SmaranAI" className="h-10" />
            <div className="text-right text-sm text-muted-foreground">
              <p>SmaranAI Technologies Pvt. Ltd.</p>
              <p>123 Tech Park, Bangalore</p>
              <p>Karnataka, India - 560001</p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Date */}
          <p className="text-sm text-muted-foreground mb-6">
            Date: {format(new Date(), "d MMMM, yyyy")}
          </p>

          {/* Recipient */}
          <div className="mb-6">
            <p className="font-medium text-foreground">{applicant.name}</p>
            <p className="text-sm text-muted-foreground">{applicant.email}</p>
          </div>

          {/* Subject */}
          <p className="font-semibold text-foreground mb-6">
            Subject: Internship Offer Letter - {applicant.project}
          </p>

          {/* Salutation */}
          <p className="mb-4">Dear {applicant.name.split(" ")[0]},</p>

          {/* Body */}
          <div className="space-y-4 text-sm leading-relaxed text-foreground">
            <p>
              We are pleased to offer you the position of <strong>{applicant.project}</strong> at
              SmaranAI Technologies Pvt. Ltd. After reviewing your application and considering your
              qualifications, we believe you will be a valuable addition to our team.
            </p>

            <p>Please find the details of your internship offer below:</p>

            <div className="bg-muted/30 rounded-lg p-4 my-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 text-muted-foreground w-40">Position:</td>
                    <td className="py-2 font-medium">{applicant.project}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 text-muted-foreground">Start Date:</td>
                    <td className="py-2 font-medium">{formattedDate}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 text-muted-foreground">Duration:</td>
                    <td className="py-2 font-medium">{duration} Month{parseInt(duration) > 1 ? "s" : ""}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 text-muted-foreground">End Date:</td>
                    <td className="py-2 font-medium">{endDate}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 text-muted-foreground">Stipend:</td>
                    <td className="py-2 font-medium">₹{parseInt(stipend).toLocaleString("en-IN")} per month</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">Reporting Manager:</td>
                    <td className="py-2 font-medium">{managerNames[manager]}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              During your internship, you will be working on exciting projects and will have the
              opportunity to learn and grow with our talented team. We expect you to adhere to our
              company policies and maintain professional conduct throughout your tenure.
            </p>

            <p>
              Please confirm your acceptance of this offer by signing and returning this letter
              within 7 days of receipt. If you have any questions, feel free to reach out to our
              HR department.
            </p>

            <p>We look forward to welcoming you to the SmaranAI team!</p>

            <div className="mt-8">
              <p>Best regards,</p>
              <p className="font-semibold mt-4">{managerNames[manager]}</p>
              <p className="text-muted-foreground">HR Manager</p>
              <p className="text-muted-foreground">SmaranAI Technologies Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" className="border-border">
          <Upload className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Send className="h-4 w-4 mr-2" />
          Send to Candidate
        </Button>
      </div>
    </div>
  );

  const OfferForm = () => (
    <div className="space-y-6 mt-4">
      {/* Candidate Details */}
      <div>
        <h3 className="text-base font-semibold text-primary mb-3">Candidates Details</h3>
        <div className="space-y-2">
          <div className="flex">
            <span className="text-muted-foreground w-20">Name :</span>
            <span className="font-medium text-foreground">{applicant.name}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-20">Role :</span>
            <span className="font-medium text-foreground">{applicant.project}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-20">Email :</span>
            <span className="font-medium text-foreground">{applicant.email}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Offer Specifics */}
      <div>
        <h3 className="text-base font-semibold text-primary mb-4">Offer Specifics</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-border",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "d MMM, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="2">2 Months</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stipend */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Stipend</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <Input
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="border-border pl-7 pr-16"
                placeholder="Amount"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                / month
              </span>
            </div>
          </div>

          {/* Reporting Manager */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Reporting Manager</Label>
            <Select value={manager} onValueChange={setManager}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ravi">Ravi Kumar</SelectItem>
                <SelectItem value="priya">Priya Sharma</SelectItem>
                <SelectItem value="amit">Amit Patel</SelectItem>
                <SelectItem value="sneha">Sneha Reddy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Template Selection */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Template Selection</Label>
        <Select value={template} onValueChange={setTemplate}>
          <SelectTrigger className="border-border">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Internship Offer</SelectItem>
            <SelectItem value="premium">Premium Internship Offer</SelectItem>
            <SelectItem value="fulltime">Full-Time Offer</SelectItem>
            <SelectItem value="contract">Contract Offer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" className="border-border">
          <Upload className="h-4 w-4 mr-2" />
          Export
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowPreview(true)}
          >
            Generate & Send
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(value) => {
      onOpenChange(value);
      if (!value) setShowPreview(false);
    }}>
      <DialogContent className={cn(
        "p-6 bg-card border-0 shadow-soft transition-all duration-300",
        showPreview ? "sm:max-w-[650px]" : "sm:max-w-[500px]"
      )}>
        {!showPreview && (
          <DialogHeader className="pb-0">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
              <Mail className="h-6 w-6 text-primary" />
              Generate Offer Letter
            </DialogTitle>
          </DialogHeader>
        )}

        {showPreview ? <OfferLetterPreview /> : <OfferForm />}
      </DialogContent>
    </Dialog>
  );
}
