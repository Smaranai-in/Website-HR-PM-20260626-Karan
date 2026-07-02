import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Phone, Mail, Briefcase, Eye, Bot, UserMinus, Calendar, XCircle, FileText, Play, UserCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import { GenerateOfferLetter } from "./GenerateOfferLetter";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  aiScore: number;
  status: "applied" | "screened" | "contacted" | "interview" | "offer" | "hired";
  interviewDate?: string;
  project: string;
  lastUpdated: string;
  phone?: string;
  dob?: string;
  address?: string;
  experience?: string;
  availability?: string;
  mode?: string;
  skills?: string[];
  summary?: string;
  strengths?: string[];
  areasToImprove?: string[];
}

interface ApplicantCardProps {
  applicant: Applicant;
  onViewAIReview: (applicant: Applicant) => void;
}

export function ApplicantCard({ applicant, onViewAIReview }: ApplicantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOfferLetter, setShowOfferLetter] = useState(false);

  const getStatusBadge = () => {
    switch (applicant.status) {
      case "applied":
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-[10px]">Applied</Badge>;
      case "screened":
        return <Badge className="bg-success/20 text-success hover:bg-success/30 text-[10px]">Screened</Badge>;
      case "contacted":
        return <Badge className="bg-stat-icon-cyan/20 text-stat-icon-cyan hover:bg-stat-icon-cyan/30 text-[10px]">Contacted</Badge>;
      case "interview":
        if (applicant.interviewDate?.includes("Missed")) {
          return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 text-[10px]">Missed Interview</Badge>;
        }
        if (applicant.interviewDate?.includes("Done")) {
          return <Badge className="bg-success/20 text-success hover:bg-success/30 text-[10px]">Interview Done</Badge>;
        }
        return <Badge className="bg-warning/20 text-warning hover:bg-warning/30 text-[10px]">Interview at {applicant.interviewDate}</Badge>;
      case "offer":
        return <Badge className="bg-stat-icon-pink/20 text-stat-icon-pink hover:bg-stat-icon-pink/30 text-[10px]">Offer sent</Badge>;
      case "hired":
        return <Badge className="bg-success/20 text-success hover:bg-success/30 text-[10px]">Hired</Badge>;
      default:
        return null;
    }
  };

  const getDropdownItems = () => {
    switch (applicant.status) {
      case "applied":
        return null;
      case "screened":
        return (
          <>
            <DropdownMenuItem onClick={() => onViewAIReview(applicant)}>
              <Bot className="h-4 w-4 mr-2" />
              View AI Screening Review
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserCheck className="h-4 w-4 mr-2" />
              Mark as Contacted
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserMinus className="h-4 w-4 mr-2" />
              Move Back to Applicants
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </DropdownMenuItem>
          </>
        );
      case "contacted":
        return (
          <>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </DropdownMenuItem>
          </>
        );
      case "interview":
        return (
          <>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowOfferLetter(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Offer Letter
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </DropdownMenuItem>
          </>
        );
      case "offer":
      case "hired":
        return (
          <>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowOfferLetter(true)}>
              <FileText className="h-4 w-4 mr-2" />
              View Offer Letter
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Play className="h-4 w-4 mr-2" />
              Start Onboarding
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </DropdownMenuItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "p-3 shadow-card border-0 transition-all duration-200 hover:shadow-soft cursor-pointer animate-fade-in",
      isExpanded && "ring-1 ring-primary/20"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={applicant.avatar} />
            <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{applicant.name}</p>
            <p className="text-[10px] text-muted-foreground">AI Score: {applicant.aiScore}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {getDropdownItems()}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Badge */}
      <div className="mt-2">
        {getStatusBadge()}
      </div>

      {/* Expanded Info */}
      <div
        className="mt-3 space-y-1.5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span>{applicant.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Briefcase className="h-3 w-3" />
          <span>Project: {applicant.project}</span>
        </div>
        <p className="text-[9px] text-muted-foreground/70">
          Last updated: {applicant.lastUpdated}
        </p>
      </div>

      {/* Action Buttons */}
      {(applicant.status === "applied" || applicant.status === "contacted" || applicant.status === "interview") && (
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1 px-2">
            <Phone className="h-3 w-3 mr-1" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1 px-2">
            <Mail className="h-3 w-3 mr-1" />
            Mail
          </Button>
        </div>
      )}

      <GenerateOfferLetter
        applicant={applicant}
        open={showOfferLetter}
        onOpenChange={setShowOfferLetter}
      />
    </Card>
  );
}
