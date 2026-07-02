import type { Applicant } from "./ApplicantCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown, Download, Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface AIScreeningReviewProps {
  applicant: Applicant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIScreeningReview({ applicant, open, onOpenChange }: AIScreeningReviewProps) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  if (!applicant) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-warning text-warning" />);
    }
    if (hasHalf) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-warning text-warning" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-muted" />);
    }
    return stars;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-2">
            Applicant Funnel&gt; Screened (AI Score &gt; 60)&gt; <span className="text-foreground font-medium">Applicant AI Screening Review</span>
          </div>
          <DialogTitle className="text-2xl font-semibold text-center">
            Applicants AI Screening Review
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipisci
          </p>
        </DialogHeader>

        {/* Applicant Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-stat-icon-purple/10 rounded-xl p-4 flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">{applicant.name || "John Doe"}</h3>
            <span className="text-muted-foreground">|</span>
            <span className="text-primary font-medium">Applied for {applicant.project}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">AI Score:</span>
            <div className="w-14 h-14 rounded-full border-4 border-success flex items-center justify-center bg-card">
              <span className="text-lg font-bold text-success">{applicant.aiScore || 75}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Applicant Details */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Applicant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Email :</span>
                  <span className="font-medium">{applicant.email || "johndoe003@gmail.com"}</span>

                  <span className="text-muted-foreground">Phone no :</span>
                  <span className="font-medium">{applicant.phone || "+91 12345-12447"}</span>

                  <span className="text-muted-foreground">Date of Birth :</span>
                  <span className="font-medium">{applicant.dob || "28 Apr, 2006"}</span>

                  <span className="text-muted-foreground">Address :</span>
                  <span className="font-medium">{applicant.address || "Mumbai, India"}</span>

                  <span className="text-muted-foreground">Experience :</span>
                  <span className="font-medium">{applicant.experience || "2 Years, Student"}</span>

                  <span className="text-muted-foreground">Education :</span>
                  <div>
                    <span className="font-medium">XYZ University, 2024</span>
                    <p className="text-xs text-muted-foreground">(B.Tech in Computer Science & engineering)</p>
                  </div>

                  <span className="text-muted-foreground">Availability :</span>
                  <span className="font-medium">{applicant.availability || "25-30 Hours per week"}</span>

                  <span className="text-muted-foreground">Mode :</span>
                  <span className="font-medium">{applicant.mode || "Remote"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Parsed Skills */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Parsed Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(applicant.skills || ["Figma", "Prototyping", "CSS", "Wireframe", "Javascript", "Node Js"]).map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-secondary border-0 text-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume Preview */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Resume Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-destructive/20 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-destructive" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">JohnDoe_resume.pdf</span>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Analysis */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-stat-icon-cyan mb-1">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {applicant.summary || "John has a strong Prototyping Skills with moderate UI and good daily availability."}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stat-icon-cyan mb-2">Strengths</h4>
                  <div className="space-y-2">
                    {(applicant.strengths || ["Figma", "Prototyping"]).map((strength) => (
                      <div key={strength} className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-stat-icon-purple rounded flex items-center justify-center">
                          <span className="text-[10px] text-white">F</span>
                        </div>
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stat-icon-cyan mb-1">Areas to Improve</h4>
                  <p className="text-sm text-muted-foreground">
                    {(applicant.areasToImprove || ["Design System"]).join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Screening Transcript */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Screening Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <Collapsible open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                      <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${isTranscriptOpen ? 'rotate-180' : ''}`} />
                      <span className="text-sm">Expand Transcript</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="p-3 bg-secondary rounded-lg text-sm text-muted-foreground">
                      <p>Q: Tell me about your experience with {applicant.project}.</p>
                      <p className="mt-2">A: I have 2 years of experience working on various projects including mobile apps and web applications...</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Overall Rating */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Overall Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Skilled :</span>
                  <div className="flex">{renderStars(4.5)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Communication :</span>
                  <div className="flex">{renderStars(4)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button variant="outline" className="flex-1 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
            Reject
          </Button>
          <Button variant="outline" className="flex-1 bg-stat-orange text-foreground border-0 hover:bg-stat-orange/80">
            Contacted
          </Button>
          <Button className="flex-1 bg-stat-cyan text-foreground hover:bg-stat-cyan/80">
            Schedule Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
