import { useState } from "react";
import { ApplicantKanban } from "../../../../components/applicants/ApplicantKanban";
import { AIScreeningReview } from "../../../../components/applicants/AIScreeningReview";
import { OnboardingTemplates } from "../../../../components/applicants/OnboardingTemplates";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { FileText, Users, Percent, Bot, Send, UserCheck, Upload, Search } from "lucide-react";

const HRStatCard = ({
  icon: Icon,
  label,
  value,
  change,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  variant: "blue" | "cyan" | "teal" | "orange" | "pink" | "green";
}) => {
  const variants = {
    blue: "bg-gradient-to-br from-blue-400 to-blue-500",
    cyan: "bg-gradient-to-br from-cyan-400 to-cyan-500",
    teal: "bg-gradient-to-br from-teal-400 to-teal-500",
    orange: "bg-gradient-to-br from-orange-400 to-orange-500",
    pink: "bg-gradient-to-br from-pink-400 to-pink-500",
    green: "bg-gradient-to-br from-green-400 to-green-500",
  };

  return (
    <div className={`${variants[variant]} rounded-xl p-4 text-white`}>
      <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
        <Icon className="h-4 w-4" />
      </div>

      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>

      <div
        className={`text-xs mt-1 ${change.includes("-") ? "text-red-200" : "text-green-200"
          }`}
      >
        {change}
      </div>
    </div>
  );
};


export interface Applicant {
  id: string;
  name: string;
  email: string;
  aiScore: number;
  project: string;
  lastUpdated: string;
  status: "applied" | "screened" | "contacted" | "interview" | "offer" | "hired";
  avatar?: string;
  phone?: string;
  dob?: string;
  address?: string;
  experience?: string;
  education?: string;
  availability?: string;
  mode?: string;
  skills?: string[];
  strengths?: string[];
  areasToImprove?: string[];
  summary?: string;
  interviewDate?: string;
}

const mockApplicants: Applicant[] = [
  { id: "1", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "applied", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", phone: "+91 12345-12447", dob: "28 Apr, 2006", address: "Mumbai, India", experience: "2 Years, Student", education: "XYZ University, 2024 (B.Tech in Computer Science & engineering)", availability: "25-30 Hours per week", mode: "Remote", skills: ["Figma", "Prototyping", "CSS", "Wireframe", "Javascript", "Node Js"], strengths: ["Figma", "Prototyping"], areasToImprove: ["Design System"], summary: "John has a strong Prototyping Skills with moderate UI and good daily availability." },
  { id: "2", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "applied", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "3", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "applied", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "4", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "applied", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "5", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "applied", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "6", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "screened", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "7", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "screened", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "8", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "screened", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "9", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "contacted", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "10", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "contacted", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "11", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "contacted", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "12", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "interview", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", interviewDate: "04:00 PM, Thu" },
  { id: "13", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "interview", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", interviewDate: "Interview Done" },
  { id: "14", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "interview", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", interviewDate: "Missed Interview" },
  { id: "15", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "offer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "16", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "offer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "17", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "hired", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "18", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "hired", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "19", name: "John Doe", email: "johndoe@gmail.com", aiScore: 75, project: "Landing page", lastUpdated: "06/11/2025 01:30 PM", status: "hired", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
];

export default function Applicants() {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"funnel" | "onboarding">("funnel");

  const handleViewAIReview = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsReviewOpen(true);
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "funnel" | "onboarding")}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="funnel" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Applicant Funnel
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Onboarding Process
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "onboarding" ? (
        <OnboardingTemplates />
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            {/* Funnel Metrics Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-primary">Funnel Metrics</h2>
                <p className="text-sm text-muted-foreground">Today's summary</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
              <HRStatCard
                icon={FileText}
                value="53"
                label="Total Applicants"
                change="+8% from yesterday"
                variant="blue"
              />
              <HRStatCard
                icon={Users}
                value="26"
                label="Screened >60"
                change="0.5% from yesterday"
                variant="cyan"
              />
              <HRStatCard
                icon={Percent}
                value="42%"
                label="Conversion:"
                change="0.5% from yesterday"
                variant="orange"
              />
              <HRStatCard
                icon={Bot}
                value="67"
                label="Avg AI Score"
                change="0.5% from yesterday"
                variant="teal"
              />
              <HRStatCard
                icon={Send}
                value="24"
                label="Offers Sent"
                change="0.5% from yesterday"
                variant="pink"
              />
              <HRStatCard
                icon={UserCheck}
                value="22"
                label="Hired"
                change="0.5% from yesterday"
                variant="green"
              />
            </div>
          </div>

          {/* Applicants Table Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Applicants Table</h2>
            <p className="text-muted-foreground mt-1">Lorem ipsum dolor sit amet, consectetur adipisci</p>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-secondary">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
                <TabsTrigger value="hired">Hired</TabsTrigger>
                <TabsTrigger value="screened">Screened</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screened">Screened</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="landing">Landing Page</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Created" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="w-32 pl-9" />
            </div>
          </div>

          {/* Kanban Board */}
          <ApplicantKanban applicants={mockApplicants} onViewAIReview={handleViewAIReview} />
        </>
      )}

      {/* AI Screening Review Dialog */}
      <AIScreeningReview
        applicant={selectedApplicant}
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
      />
    </>
  );
}
