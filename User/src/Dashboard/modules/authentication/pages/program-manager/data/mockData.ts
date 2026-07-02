import type { SummaryIconType } from "../../../../../components/cards/SummaryCard";

/* ================= COMMON TYPES ================= */

export interface SummaryCard {
  title: string;
  value: string;
  subtitle?: string;
  bg: string;
  iconBg: string;
  icon: SummaryIconType;
}

export type SupervisorStatus = "Excellent" | "Good" | "Needs Review";

export interface Supervisor {
  name: string;
  email: string;
  avatar: string;
  interns: number;
  rating: number;
  status: SupervisorStatus;
  warning?: boolean;
}

export interface SupervisorSummaryCard {
  title: string;
  value: string;
  bg: string;
  iconBg: string;
  icon: string;
}

export interface LineChartPoint {
  day: string;
  value: number;
}

export type InternStatus = | "Active" | "Onboarding" | "Completed" | "Inactive" | "Fired" | "Resigned";

export interface Intern {
  id: string;
  name: string;
  role: string;
  email: string;
  manager: string;
  duration: string;
  status: InternStatus;
  avatar: string;
  rating?: number;
}

export type SeverityType = "High" | "Medium" | "Low";
export type StatusType = "Open" | "In Review";

export interface Escalation {
  id: string;
  type: string;
  supervisor: string;
  intern: string;
  severity: SeverityType;
  status: StatusType;
}

export interface DailyReport {
  month: string;
  musfiq: number;
  ravi: number;
  rahul: number;
  kisan: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface SupervisorBenchmark {
  name: string;
  avatar: string;
  rating: number;
  completion: string;
  dropout: string;
  warning?: boolean;
}
export interface ReportsAISummary {
  generatedOn: string;
  insights: string[];
  recommendation: {
    text: string;
    metric: number;
    label: string;
  };
  health: string;
}

export interface AIQuickStat {
  value: string;
  title: string;
  subtitle: string;
  bg: string;
  icon: string;
  iconBg: string;
}

export interface AIGovernanceSummary {
  generatedOn: string;
  confidence: string;
  points: string[];
}

export interface AIAlert {
  type: string;
  title: string;
  highlight: string;
  date: string;
  time: string;
  id: string;
}

export interface AIModule {
  label: string;
  enabled: boolean;
}

export interface AIDecisionLog {
  title: string;
  reason: string;
  decision: string;
  by: string;
}

export interface SupervisorProfileIntern {
  name: string;
  role: string;
  status: string;
  rating: number;
  performance: string;
  avatar: string;
}

export interface SupervisorProfileData {
  description: string;
  information: {
    role: string;
    activeSince: string;
  };
  internsUnderSupervisor: SupervisorProfileIntern[];
  feedbackSummary: string[];
  performanceTrends: string[];
}

export interface LineChartItem {
  day: string;
  value: number;
}

export interface DailyReportItem {
  month: string;
  musfiq: number;
  ravi: number;
  rahul: number;
  kisan: number;
}

export interface SupervisorBenchmarkItem {
  name: string;
  avatar: string;
  rating: number;
  completion: string;   // because you're storing "80%" as string
  dropout: string;      // same here
  warning?: boolean;    // optional (only present in last object)
}

export type ReportFormat = "pdf" | "image" | "csv";

export interface ReportItem {
  name: string;
  category: string;
  period: string;
  format: ReportFormat;
  generated: string;
}

export interface QuickStatItem {
  value: string;
  title: string;
  subtitle: string;
  bg: string;
  icon: SummaryIconType;
  iconBg: string;
}

export interface ReportsAISummary {
  generatedOn: string;
  insights: string[];
  recommendation: {
    text: string;
    metric: number;
    label: string;
  };
  health: string;
}

export interface AIGovernanceSummary {
  generatedOn: string;
  confidence: string;
  points: string[];
}

export interface AIAlertItem {
  type: string;
  title: string;
  highlight: string;
  date: string;
  time: string;
  id: string;
}

export interface AIModuleItem {
  label: string;
  enabled: boolean;
}

export interface AIDecisionLogItem {
  title: string;
  reason: string;
  decision: string;
  by: string;
}

export interface SupervisorProfileData {
  description: string;
  information: {
    role: string;
    activeSince: string;
  };
  internsUnderSupervisor: {
    name: string;
    role: string;
    status: string;
    rating: number;
    performance: string;
    avatar: string;
  }[];
  feedbackSummary: string[];
  performanceTrends: string[];
}

// ================= DASHBOARD SUMMARY =================
export const summaryData: SummaryCard[] = [
  {
    title: "Total Supervisor Assigned",
    value: "12",
    subtitle: "+5% from yesterday",
    bg: "bg-blue-100",
    iconBg: "bg-blue-500",
    icon: "users",
  },
  {
    title: "Total Interns",
    value: "78",
    subtitle: "+5% from yesterday",
    bg: "bg-teal-100",
    iconBg: "bg-teal-500",
    icon: "interns",
  },
  {
    title: "Average Rating",
    value: "4.2",
    subtitle: "+5% from yesterday",
    bg: "bg-purple-100",
    iconBg: "bg-purple-500",
    icon: "rating",
  },
  {
    title: "Completed",
    value: "88%",
    subtitle: "+5% from yesterday",
    bg: "bg-green-100",
    iconBg: "bg-green-500",
    icon: "completed",
  },
  {
    title: "Escalations",
    value: "3",
    subtitle: "+5% from yesterday",
    bg: "bg-red-100",
    iconBg: "bg-red-500",
    icon: "alert",
  },
];

// ================= DASHBOARD SUPERVISOR TABLE =================
// ================= SUPERVISORS LIST =================
export const supervisors: Supervisor[] = [

  {
    name: "Priya Verma",
    email: "priyav003@gmail.com",
    interns: 1,
    rating: 4.6,
    status: "Excellent",
    avatar: "/avatars/priya.png",
  },
  {
    name: "Shantanu Sharma",
    email: "shanatanu92@gmail.com",
    interns: 2,
    rating: 4.1,
    status: "Good",
    avatar: "/avatars/priya.png",
  },
  {
    name: "Tejas Joshi",
    email: "joshitejas9@gmail.com",
    interns: 3,
    rating: 3.4,
    status: "Needs Review",
    avatar: "/avatars/priya.png",
  },
  {
    name: "Ravi Kumar",
    email: "ravikumar@gmail.com",
    interns: 4,
    rating: 4.9,
    status: "Excellent",
    avatar: "/avatars/tejas.png",
  },
  {
    name: "John Doe",
    email: "johndoe22@gmail.com",
    interns: 5,
    rating: 3.2,
    status: "Needs Review",
    avatar: "/avatars/tejas.png",
  },
  {
    name: "Rahul Yadav",
    email: "yadavr234@gmail.com",
    interns: 6,
    rating: 4.7,
    status: "Excellent",
    avatar: "/avatars/priya.png",
  },
  {
    name: "Shantanu Sharma",
    email: "shanatanu92@gmail.com",
    interns: 7,
    rating: 4.2,
    status: "Good",
    avatar: "/avatars/priya.png",
  },
  {
    name: "John Doe",
    email: "johndoe22@gmail.com",
    interns: 8,
    rating: 3.1,
    status: "Needs Review",
    avatar: "/avatars/priya.png",
  },
];


// ================= SUPERVISORS PAGE SUMMARY =================
export const supervisorsSummary: SummaryCard[] = [
  {
    title: "Total Supervisors",
    value: "12",
    bg: "bg-blue-100",
    iconBg: "bg-blue-500",
    icon: "users",
  },
  {
    title: "Active Supervisors",
    value: "7",
    bg: "bg-teal-100",
    iconBg: "bg-teal-500",
    icon: "interns",
  },
  {
    title: "High Rated",
    value: "5",
    bg: "bg-purple-100",
    iconBg: "bg-purple-500",
    icon: "rating",
  },
  {
    title: "Need Review",
    value: "3",
    bg: "bg-green-100",
    iconBg: "bg-green-500",
    icon: "completed",
  },
  {
    title: "Open Escalations",
    value: "4",
    bg: "bg-red-100",
    iconBg: "bg-red-500",
    icon: "alert",
  },
];

// ================= LINE CHART =================
export const lineChartData: LineChartItem[] = [
  { day: "Day 1", value: 21 },
  { day: "Day 2", value: 23 },
  { day: "Day 3", value: 11 },
  { day: "Day 4", value: 62 },
  { day: "Day 5", value: 38 },
  { day: "Day 6", value: 73 },
  { day: "Day 7", value: 76 },
];
// ================= INTERNS PAGE SUMMARY =================
export const internsSummary: SummaryCard[] = [
  {
    title: "Total Hired Interns",
    value: "53",
    subtitle: "+5% from yesterday",
    bg: "bg-blue-100",
    iconBg: "bg-blue-500",
    icon: "users",
  },
  {
    title: "Active Now",
    value: "42",
    subtitle: "+5% from yesterday",
    bg: "bg-teal-100",
    iconBg: "bg-teal-500",
    icon: "active",
  },
  {
    title: "Onboarding",
    value: "5",
    subtitle: "+5% from yesterday",
    bg: "bg-purple-100",
    iconBg: "bg-purple-500",
    icon: "onboarding",
  },
  {
    title: "Completed",
    value: "15",
    subtitle: "+5% from yesterday",
    bg: "bg-green-100",
    iconBg: "bg-green-500",
    icon: "completed",
  },
  {
    title: "At Risk",
    value: "4",
    subtitle: "-2% from yesterday",
    bg: "bg-red-100",
    iconBg: "bg-red-500",
    icon: "alert",
  },
];

// ================= INTERNS TABLE =================
export const interns: Intern[] = [
  {
    id: "INT001WEB",
    name: "Priya Verma",
    role: "Web Intern",
    email: "priyav003@gmail.com",
    manager: "Raj Kumar",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Active",
    avatar: "/avatars/priya.png",
  },
  {
    id: "INT002DES",
    name: "Shantanu Sharma",
    role: "Figma Design Intern",
    email: "shanatanu92@gmail.com",
    manager: "Musfiq",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Onboarding",
    avatar: "/avatars/musfiq.png",
  },
  {
    id: "INT011AMN",
    name: "Aman Verma",
    role: "UI Intern",
    email: "aman.verma@example.com",
    manager: "Priya Verma",
    duration: "1 Feb, 2026 - Ongoing",
    status: "Active",
    avatar: "/avatars/priya.png",
    rating: 4.5,
  },
  {
    id: "INT012SHN",
    name: "Shantanu Sharma",
    role: "Web Intern",
    email: "shantanu.sharma@example.com",
    manager: "Priya Verma",
    duration: "10 Jan, 2026 - Ongoing",
    status: "Completed",
    avatar: "/avatars/musfiq.png",
    rating: 4.0,
  },
  {
    id: "INT013TEJ",
    name: "Tejas Joshi",
    role: "MKT Intern",
    email: "tejas.joshi@example.com",
    manager: "Priya Verma",
    duration: "5 Jan, 2026 - Ongoing",
    status: "Resigned",
    avatar: "/avatars/tejas.png",
    rating: 3.2,
  },
  {
    id: "INT014NHD",
    name: "Neha Patel",
    role: "UI Intern",
    email: "neha.patel@example.com",
    manager: "Priya Verma",
    duration: "20 Feb, 2026 - Ongoing",
    status: "Active",
    avatar: "/avatars/musfiq.jpg",
    rating: 4.8,
  },
  {
    id: "INT002WEB",
    name: "Tejas Joshi",
    role: "Web Intern",
    email: "joshitejas9@gmail.com",
    manager: "Musfiq",
    duration: "1 Oct, 2025 - 1 Nov, 2025",
    status: "Completed",
    avatar: "/avatars/tejas.png",
  },
  {
    id: "INT003WEB",
    name: "Rahul Yadav",
    role: "Web Intern",
    email: "yadavr234@gmail.com",
    manager: "Musfiq",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Active",
    avatar: "/avatars/tejas.png",
  },
  {
    id: "INT004DES",
    name: "John Doe",
    role: "Design Intern",
    email: "johndoe22@gmail.com",
    manager: "Raj Kumar",
    duration: "1 Oct, 2025 - 1 Nov, 2025",
    status: "Fired",
    avatar: "/avatars/musfiq.png",
  },
  {
    id: "INT005WEB",
    name: "Rahul Yadav",
    role: "Web Intern",
    email: "yadavr234@gmail.com",
    manager: "Musfiq",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Inactive",
    avatar: "/avatars/priya.png",
  },
  {
    id: "INT001WEB",
    name: "Priya Verma",
    role: "Web Intern",
    email: "priyav003@gmail.com",
    manager: "Raj Kumar",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Active",
    avatar: "/avatars/priya.png",
  },
  {
    id: "INT002DES",
    name: "Shantanu Sharma",
    role: "Figma Design Intern",
    email: "shanatanu92@gmail.com",
    manager: "Musfiq",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Onboarding",
    avatar: "/avatars/musfiq.png",
  },
  {
    id: "INT002WEB",
    name: "Tejas Joshi",
    role: "Web Intern",
    email: "joshitejas9@gmail.com",
    manager: "Musfiq",
    duration: "1 Oct, 2025 - 1 Nov, 2025",
    status: "Completed",
    avatar: "/avatars/tejas.png",
  },
  {
    id: "INT003WEB",
    name: "Rahul Yadav",
    role: "Web Intern",
    email: "yadavr234@gmail.com",
    manager: "Musfiq",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Active",
    avatar: "/avatars/tejas.png",
  },
  {
    id: "INT004DES",
    name: "John Doe",
    role: "Design Intern",
    email: "johndoe22@gmail.com",
    manager: "Raj Kumar",
    duration: "1 Oct, 2025 - 1 Nov, 2025",
    status: "Fired",
    avatar: "/avatars/musfiq.png",
  },
  {
    id: "INT005WEB",
    name: "Rahul Yadav",
    role: "Web Intern",
    email: "yadavr234@gmail.com",
    manager: "Musfiq",
    duration: "1 Nov, 2025 - Ongoing",
    status: "Inactive",
    avatar: "/avatars/priya.png",
  },
  {
    id: "INT006PRI",
    name: "Aisha Khan",
    role: "Frontend Intern",
    email: "aisha.khan@example.com",
    manager: "Priya Verma",
    duration: "1 Feb, 2026 - Ongoing",
    status: "Active",
    avatar: "/avatars/priya.png",
    rating: 4.2,
  },
  {
    id: "INT007SHA",
    name: "Karan Mehta",
    role: "UX Intern",
    email: "karan.mehta@example.com",
    manager: "Shantanu Sharma",
    duration: "15 Jan, 2026 - Ongoing",
    status: "Onboarding",
    avatar: "/avatars/tejas.png",
  },
  {
    id: "INT008TEJ",
    name: "Nidhi Patel",
    role: "Data Intern",
    email: "nidhi.patel@example.com",
    manager: "Tejas Joshi",
    duration: "20 Jan, 2026 - Ongoing",
    status: "Active",
    avatar: "/avatars/priya.png",
  },
  {
    id: "INT009RAV",
    name: "Samir Gupta",
    role: "Marketing Intern",
    email: "samir.gupta@example.com",
    manager: "Ravi Kumar",
    duration: "5 Feb, 2026 - Ongoing",
    status: "Active",
    avatar: "/avatars/musfiq.png",
  },
  {
    id: "INT010JOH",
    name: "Lina Roy",
    role: "Design Intern",
    email: "lina.roy@example.com",
    manager: "John Doe",
    duration: "10 Feb, 2026 - Ongoing",
    status: "Active",
    avatar: "/avatars/musfiq.png",
  },
];

export const escalations: Escalation[] = [
  {
    id: "E-021",
    type: "Low Rating",
    supervisor: "Tejas",
    intern: "Rahul",
    severity: "High",
    status: "Open",
  },
  {
    id: "E-019",
    type: "Resignation",
    supervisor: "Musfiq",
    intern: "Riya",
    severity: "Medium",
    status: "In Review",
  },
  {
    id: "E-018",
    type: "Delay",
    supervisor: "Ravi",
    intern: "-",
    severity: "Low",
    status: "In Review",
  },
  {
    id: "E-021",
    type: "Low Rating",
    supervisor: "Tejas",
    intern: "Rahul",
    severity: "High",
    status: "Open",
  },
];

// ================= PERFORMANCE – SUMMARY =================
export const performanceSummary: SummaryCard[] = [
  {
    title: "Average Rating",
    value: "4.2",
    subtitle: "+5% from yesterday",
    bg: "bg-blue-100",
    iconBg: "bg-blue-500",
    icon: "rating",
  },
  {
    title: "Review Time",
    value: "2.8 Days",
    subtitle: "+5% from yesterday",
    bg: "bg-teal-100",
    iconBg: "bg-teal-500",
    icon: "active",
  },
  {
    title: "Dropout Rate",
    value: "12%",
    subtitle: "+5% from yesterday",
    bg: "bg-purple-100",
    iconBg: "bg-purple-500",
    icon: "alert",
  },
  {
    title: "Completion",
    value: "92%",
    subtitle: "-1% from yesterday",
    bg: "bg-green-100",
    iconBg: "bg-green-500",
    icon: "completed",
  },
  {
    title: "Escalations",
    value: "2",
    subtitle: "+2% from yesterday",
    bg: "bg-red-100",
    iconBg: "bg-red-500",
    icon: "alert",
  },
];

// ================= DAILY REPORTS LINE CHART =================
export const dailyReportsData: DailyReportItem[] = [
  { month: "JAN", musfiq: 20, ravi: 25, rahul: 18, kisan: 15 },
  { month: "FEB", musfiq: 22, ravi: 30, rahul: 20, kisan: 17 },
  { month: "MAR", musfiq: 28, ravi: 35, rahul: 15, kisan: 20 },
  { month: "APR", musfiq: 40, ravi: 50, rahul: 10, kisan: 25 },
  { month: "MAY", musfiq: 55, ravi: 60, rahul: 30, kisan: 35 },
  { month: "JUN", musfiq: 45, ravi: 65, rahul: 20, kisan: 22 },
  { month: "JUL", musfiq: 70, ravi: 68, rahul: 35, kisan: 40 },
  { month: "AUG", musfiq: 65, ravi: 80, rahul: 55, kisan: 45 },
  { month: "SEP", musfiq: 72, ravi: 75, rahul: 45, kisan: 42 },
  { month: "OCT", musfiq: 90, ravi: 70, rahul: 60, kisan: 55 },
  { month: "NOV", musfiq: 85, ravi: 75, rahul: 65, kisan: 70 },
  { month: "DEC", musfiq: 78, ravi: 80, rahul: 68, kisan: 72 },
];

// ================= INTERN OUTCOMES BAR CHART =================
export const internOutcomesData: { name: string; value: number }[] = [
  { name: "MUSFIQ", value: 22 },
  { name: "RAHUL", value: 52 },
  { name: "RAVI", value: 70 },
  { name: "KISAN", value: 35 },
  { name: "SANA", value: 18 },
  { name: "RIYA", value: 45 },
  { name: "PRIYA", value: 75 },
];

// ================= REVIEW EFFICIENCY =================
export const reviewEfficiencyData: { name: string; value: number }[] = [
  { name: "MUSFIQ", value: 8 },
  { name: "RAHUL", value: 5 },
  { name: "SANA", value: 2 },
  { name: "KISAN", value: 4 },
  { name: "JOHN", value: 2 },
  { name: "RAVI", value: 7 },
  { name: "TEJAS", value: 5 },
];

// ================= HEATMAP (STATIC) =================
export const heatmapCells = Array.from({ length: 49 });

// ================= SUPERVISOR BENCHMARK =================
export const supervisorBenchmark: SupervisorBenchmarkItem[] = [
  {
    name: "Priya Verma",
    avatar: "/avatars/priya.png",
    rating: 4.6,
    completion: "80%",
    dropout: "5%",
  },
  {
    name: "Shantanu Sharma",
    avatar: "/avatars/priya.png",
    rating: 4.1,
    completion: "90%",
    dropout: "17%",
  },
  {
    name: "Tejas Joshi",
    avatar: "/avatars/priya.png",
    rating: 3.4,
    completion: "85%",
    dropout: "8%",
  },
  {
    name: "Priya Verma",
    avatar: "/avatars/priya.png",
    rating: 4.6,
    completion: "75%",
    dropout: "30%",
    warning: true,
  },
];


// ================= REPORTS PAGE =================

// Report Categories
export const reportCategories: string[] = [
  "Supervisor Performance",
  "Intern Outcomes",
  "Escalations & Risks",
  "AI Insights",
  "Attendance & Timesheets",
];

// Reports Table Data
export const reportsData: ReportItem[] = [
  {
    name: "Supervisor_perf_aug",
    category: "Performance",
    period: "Aug 2025",
    format: "pdf",
    generated: "Today",
  },
  {
    name: "Intern_On_Completion",
    category: "Outcomes",
    period: "Sep 2025",
    format: "image",
    generated: "1 day ago",
  },
  {
    name: "Intern_Escalations",
    category: "Risk",
    period: "Oct 2025",
    format: "csv",
    generated: "3 days ago",
  },
  {
    name: "Supervisor_perf_aug",
    category: "Performance",
    period: "Aug 2025",
    format: "pdf",
    generated: "Today",
  },
];

// SmaranBot AI Summary (Reports Page)
export const reportsAISummary: ReportsAISummary = {
  generatedOn: "5 Nov, 2025",
  insights: [
    "2 supervisors show declining intern ratings",
    "3 interns resigned this week (within normal range)",
    "Avg task approval time improved by 12%",
  ],
  recommendation: {
    text: "Schedule review with Supervisor Tejas Joshi",
    metric: 530,
    label: "Lorem Ipsum",
  },
  health: "Stable",
};


// ================= AI CONFIG PAGE =================

/* ================= QUICK STATS ================= */

export const aiQuickStats: QuickStatItem[] = [
  {
    value: "65%",
    title: "Performance Gap",
    subtitle: "UI interns 12% vs last month",
    bg: "bg-[#F3E8FF]",
    icon: "rating",
    iconBg: "bg-[#A855F7]",
  },
  {
    value: "Good",
    title: "Attendance Trend",
    subtitle: "Late check-ins ↓ by 18%",
    bg: "bg-[#E0F2FE]",
    icon: "users",
    iconBg: "bg-[#3B82F6]",
  },
  {
    value: "Better",
    title: "Certificate Trend",
    subtitle: "9 interns ready this week",
    bg: "bg-[#D1FAE5]",
    icon: "completed",
    iconBg: "bg-[#10B981]",
  },
  {
    value: "20%",
    title: "Supervisor Load",
    subtitle: "Musfiq overloaded",
    bg: "bg-[#E0E7FF]",
    icon: "interns",
    iconBg: "bg-[#6366F1]",
  },
  {
    value: "12",
    title: "Bottleneck",
    subtitle: "Review delays in week 2",
    bg: "bg-[#FFE7CC]",
    icon: "alert",
    iconBg: "bg-[#F97316]",
  },
  {
    value: "20%",
    title: "Risk Alert",
    subtitle: "6 interns at risk this week",
    bg: "bg-[#FEE2E2]",
    icon: "alert",
    iconBg: "bg-[#EF4444]",
  },
];

/* ================= WEEKLY GOVERNANCE SUMMARY ================= */

export const aiGovernanceSummary: AIGovernanceSummary = {
  generatedOn: "5 Nov, 2025",
  confidence: "High",
  points: [
    "3 interns flagged for disengagement",
    "1 supervisor exceeded optimal intern load",
    "Task completion rate improved by 6%",
    "Attendance consistency dropped in Week 2",
    "No compliance violations detected",
  ],
};

/* ================= ALERTS & NOTIFICATIONS ================= */

export const aiAlerts: AIAlertItem[] = [
  {
    type: "escalation",
    title: "Escalations Detected",
    highlight: "Supervisor Overloaded",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    type: "performance",
    title: "Performance Dip in",
    highlight: "Design Interns",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    type: "message",
    title: "Message from",
    highlight: "Ravi Kumar (AI Intern)",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    type: "resignation",
    title: "2 interns resigned under",
    highlight: "Ravi Kumar",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    type: "attendance",
    title: "Attendance Anomaly",
    highlight: "3 Interns",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
];

/* ================= AI MODULE TOGGLES ================= */

export const aiModules: AIModuleItem[] = [
  { label: "AI Task Summaries", enabled: true },
  { label: "AI Performance Analysis", enabled: true },
  { label: "AI Interview Evaluation", enabled: true },
  { label: "AI Risk Prediction", enabled: false },
  { label: "AI Attendance Anomaly Detection", enabled: true },
  { label: "AI Certificate Readiness Check", enabled: true },
];

/* ================= AI DECISION / RECOMMENDATION LOG ================= */

export const aiDecisionLog: AIDecisionLogItem[] = [
  {
    title: "Suggested flagging Intern INT003",
    reason: "3 missed deadlines + attendance drop (-22%)",
    decision: "Accepted",
    by: "Program Manager",
  },
];


/* ================= SUPERVISOR PROFILE PAGE DATA ================= */

export const supervisorProfileData: SupervisorProfileData = {
  description: "Lorem ipsum dolor sit amet, consectetur adipisci",

  information: {
    role: "Senior Supervisor",
    activeSince: "Jan 2024",
  },

  internsUnderSupervisor: [
    {
      name: "Priya Verma",
      role: "UI Intern",
      status: "Active",
      rating: 4.6,
      performance: "Excellent",
      avatar: "/avatars/priya.png",
    },
    {
      name: "Shantanu Sharma",
      role: "Web Intern",
      status: "Completed",
      rating: 4.1,
      performance: "Good",
      avatar: "/avatars/priya.png",
    },
    {
      name: "Tejas Joshi",
      role: "MKT Intern",
      status: "Resigned",
      rating: 3.4,
      performance: "Poor",
      avatar: "/avatars/priya.png",
    },
    {
      name: "Priya Verma",
      role: "UI Intern",
      status: "Active",
      rating: 4.6,
      performance: "Excellent",
      avatar: "/avatars/priya.png",
    },
  ],

  feedbackSummary: [
    "👍 Supportive mentoring (6 mentions)",
    "🕒 Timely feedback (4 mentions)",
    "⚠️ Task clarity issues (2 mentions)",
  ],

  performanceTrends: [
    "Rating Trend (Last 6 Months)",
    "Intern Dropout vs Completion",
    "Avg Task Review Time",
  ],
};
