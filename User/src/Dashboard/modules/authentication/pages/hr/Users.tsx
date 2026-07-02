import { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { 
  Calendar, 
  Upload, 
  Search, 
  Users, 
  UserCheck, 
  UserPlus, 
  CheckCircle,
  XCircle,
  User,
  MoreHorizontal,
  Eye,
  FileText,
  UserX,
  Video
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FireInternDialog } from "../../../../components/users/FireInternDialog";
import { UploadedDocumentsDialog } from "../../../../components/users/UploadedDocumentsDialog";
import { toast } from "sonner";

interface InternRecord {
  id: string;
  uniqueId: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  manager: string;
  duration: string;
  status: "Active" | "Onboarding" | "Completed" | "Fired" | "Inactive";
}

const internsData: InternRecord[] = [
  { id: "1", uniqueId: "INT001WEB", name: "Priya Verma", role: "Web Intern", avatar: "", email: "priyav003@gmail.com", manager: "Raj Kumar", duration: "1 Nov, 2025 - Ongoing", status: "Active" },
  { id: "2", uniqueId: "INT002DES", name: "Shantanu Sharma", role: "Figma Design Intern", avatar: "", email: "shanatanu92@gmail.com", manager: "Musfiq", duration: "1 Nov, 2025 - Ongoing", status: "Onboarding" },
  { id: "3", uniqueId: "INT002WEB", name: "Tejas Joshi", role: "Web Intern", avatar: "", email: "joshitejas9@gmail.com", manager: "Musfiq", duration: "1 Oct, 2025 - 1 Nov, 2025", status: "Completed" },
  { id: "4", uniqueId: "INT001AI", name: "Ravi Kumar", role: "AI Intern", avatar: "", email: "ravikumar@gmail.com", manager: "Aesha Khan", duration: "1 Nov, 2025 - Ongoing", status: "Active" },
  { id: "5", uniqueId: "INT003DES", name: "John Doe", role: "Design Intern", avatar: "", email: "johndoe22@gmail.com", manager: "Raj Kumar", duration: "1 Oct, 2025 - 1 Nov, 2025", status: "Fired" },
  { id: "6", uniqueId: "INT003WEB", name: "Rahul Yadav", role: "Web Intern", avatar: "", email: "yadavr234@gmail.com", manager: "Musfiq", duration: "1 Nov, 2025 - Ongoing", status: "Active" },
  { id: "7", uniqueId: "INT003DES", name: "Shantanu Sharma", role: "Figma Design Intern", avatar: "", email: "shanatanu92@gmail.com", manager: "Musfiq", duration: "1 Nov, 2025 - Ongoing", status: "Onboarding" },
  { id: "8", uniqueId: "INT004DES", name: "John Doe", role: "Design Intern", avatar: "", email: "johndoe22@gmail.com", manager: "Raj Kumar", duration: "1 Oct, 2025 - 1 Nov, 2025", status: "Fired" },
  { id: "9", uniqueId: "INT004WEB", name: "Rahul Yadav", role: "Web Intern", avatar: "", email: "yadavr234@gmail.com", manager: "Musfiq", duration: "1 Nov, 2025 - Ongoing", status: "Active" },
  { id: "10", uniqueId: "INT005WEB", name: "Rahul Yadav", role: "Web Intern", avatar: "", email: "yadavr234@gmail.com", manager: "Musfiq", duration: "1 Nov, 2025 - Ongoing", status: "Inactive" },
  { id: "11", uniqueId: "INT006WEB", name: "Rahul Yadav", role: "Web Intern", avatar: "", email: "yadavr234@gmail.com", manager: "Musfiq", duration: "1 Nov, 2025 - Ongoing", status: "Active" },
  { id: "12", uniqueId: "INT007WEB", name: "Tejas Joshi", role: "Web Intern", avatar: "", email: "joshitejas9@gmail.com", manager: "Aesha Khan", duration: "1 Oct, 2025 - 1 Nov, 2025", status: "Completed" },
];

const stats = [
  { icon: Users, label: "Total Hired Interns", value: "53", change: "+5% from yesterday", variant: "blue" as const },
  { icon: UserCheck, label: "Active Now", value: "42", change: "+5% from yesterday", variant: "cyan" as const },
  { icon: UserPlus, label: "Onboarding", value: "5", change: "+5% from yesterday", variant: "teal" as const },
  { icon: CheckCircle, label: "Completed", value: "15", change: "-1% from yesterday", variant: "gray" as const },
  { icon: XCircle, label: "Fired", value: "4", change: "+2% from yesterday", variant: "red" as const },
];

const StatCard = ({ icon: Icon, label, value, change, variant }: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  variant: "blue" | "cyan" | "teal" | "gray" | "red";
}) => {
  const variants = {
    blue: "bg-gradient-to-br from-blue-400 to-blue-500",
    cyan: "bg-gradient-to-br from-cyan-400 to-cyan-500",
    teal: "bg-gradient-to-br from-teal-400 to-teal-500",
    gray: "bg-gradient-to-br from-slate-300 to-slate-400",
    red: "bg-gradient-to-br from-red-400 to-red-500",
  };

  return (
    <div className={`${variants[variant]} rounded-xl p-4 text-white`}>
      <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
      <div className={`text-xs mt-1 ${change.includes('-') ? 'text-red-200' : 'text-green-200'}`}>{change}</div>
    </div>
  );
};

const getStatusBadge = (status: InternRecord["status"]) => {
  const styles = {
    Active: "bg-green-100 text-green-700 border-green-200",
    Onboarding: "bg-amber-100 text-amber-700 border-amber-200",
    Completed: "bg-slate-100 text-slate-700 border-slate-200",
    Fired: "bg-red-100 text-red-700 border-red-200",
    Inactive: "bg-orange-100 text-orange-700 border-orange-200",
  };
  
  const dotColors = {
    Active: "bg-green-500",
    Onboarding: "bg-amber-500",
    Completed: "bg-slate-500",
    Fired: "bg-red-500",
    Inactive: "bg-orange-500",
  };
  
  return (
    <Badge variant="outline" className={`${styles[status]} gap-1`}>
      <span className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
      {status}
    </Badge>
  );
};

export default function UsersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [fireDialogOpen, setFireDialogOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [selectedInternForDocs, setSelectedInternForDocs] = useState<string>("");

  const handleFireIntern = (intern: typeof selectedIntern) => {
    setSelectedIntern(intern);
    setFireDialogOpen(true);
  };

  const handleConfirmFire = (reason: string) => {
    toast.success(`${selectedIntern?.name} has been fired. Reason: ${reason}`);
    setFireDialogOpen(false);
    setSelectedIntern(null);
  };

  const handleViewDocuments = (internName: string) => {
    setSelectedInternForDocs(internName);
    setDocumentsDialogOpen(true);
  };
  const filteredData = internsData.filter((record) => {
    const matchesFilter = filter === "all" || 
      record.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* Summary Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Summary</h2>
              <p className="text-sm text-muted-foreground">Today's summary</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Today: 5 Nov, 2025
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hired Intern Log */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Hired Intern Log</h2>
        <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
      </div>

      {/* Action Buttons & Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            {["all", "active", "onboarding", "inactive", "completed", "fired"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f ? "bg-primary text-primary-foreground" : ""}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Video className="h-4 w-4" />
            Start Meeting
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Select defaultValue="role">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="web">Web Intern</SelectItem>
            <SelectItem value="design">Design Intern</SelectItem>
            <SelectItem value="ai">AI Intern</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="manager">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="raj">Raj Kumar</SelectItem>
            <SelectItem value="musfiq">Musfiq</SelectItem>
            <SelectItem value="aesha">Aesha Khan</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9 w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Date Range
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-medium text-primary">UniqueID</TableHead>
                <TableHead className="font-medium text-primary">Intern Profile</TableHead>
                <TableHead className="font-medium text-primary">Email</TableHead>
                <TableHead className="font-medium text-primary">Manager (supervisor)</TableHead>
                <TableHead className="font-medium text-primary">Internship Duration</TableHead>
                <TableHead className="font-medium text-primary">Status</TableHead>
                <TableHead className="font-medium text-primary">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground font-mono">{record.uniqueId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={record.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{record.name}</div>
                        <div className="text-xs text-muted-foreground">{record.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.email}</TableCell>
                  <TableCell className="text-muted-foreground">{record.manager}</TableCell>
                  <TableCell className="text-muted-foreground">{record.duration}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/hr/attendance/${record.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDocuments(record.name)}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleFireIntern({
                            id: record.id,
                            name: record.name,
                            role: record.role,
                          })}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Fire Intern
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button variant="ghost" size="sm">Prev 10</Button>
        <Button variant="ghost" size="sm">1</Button>
        <span className="text-muted-foreground">...</span>
        <Button variant="ghost" size="sm">11</Button>
        <Button variant="default" size="sm" className="bg-primary">12</Button>
        <Button variant="ghost" size="sm">13</Button>
        <Button variant="ghost" size="sm">14</Button>
        <Button variant="ghost" size="sm">15</Button>
        <Button variant="ghost" size="sm">16</Button>
        <Button variant="ghost" size="sm">17</Button>
        <Button variant="ghost" size="sm">18</Button>
        <Button variant="ghost" size="sm">19</Button>
        <Button variant="ghost" size="sm">20</Button>
        <span className="text-muted-foreground">...</span>
        <Button variant="ghost" size="sm">78</Button>
        <Button variant="ghost" size="sm">Next 10</Button>
      </div>

      {/* Fire Intern Dialog */}
      <FireInternDialog
        isOpen={fireDialogOpen}
        onClose={() => setFireDialogOpen(false)}
        intern={selectedIntern}
        onConfirm={handleConfirmFire}
      />

      {/* Uploaded Documents Dialog */}
      <UploadedDocumentsDialog
        open={documentsDialogOpen}
        onOpenChange={setDocumentsDialogOpen}
        internName={selectedInternForDocs}
        documents={[]}
      />
    </>
  );
}
