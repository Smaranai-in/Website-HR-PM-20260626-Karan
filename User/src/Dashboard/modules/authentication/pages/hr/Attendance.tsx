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
  Calendar, 
  Upload, 
  Search, 
  Users, 
  UserCheck, 
  Coffee, 
  Clock, 
  UserX,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  avatar: string;
  date: string;
  checkIn: string;
  checkOut: string;
  breakDuration: string;
  breakCount: number;
  netHours: string;
  status: "Active" | "On Leave" | "On Break";
}

const attendanceData: AttendanceRecord[] = [
  {
    id: "1",
    name: "Priya Verma",
    role: "Web Intern",
    avatar: "",
    date: "5 Nov, 2025",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    breakDuration: "1h 15m",
    breakCount: 3,
    netHours: "8h",
    status: "Active",
  },
  {
    id: "2",
    name: "Shantanu Sharma",
    role: "Figma Design Intern",
    avatar: "",
    date: "5 Nov, 2025",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    breakDuration: "1h 15m",
    breakCount: 3,
    netHours: "8h",
    status: "On Leave",
  },
  {
    id: "3",
    name: "Tejas Joshi",
    role: "Web Intern",
    avatar: "",
    date: "5 Nov, 2025",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    breakDuration: "1h 15m",
    breakCount: 3,
    netHours: "8h",
    status: "On Break",
  },
  {
    id: "4",
    name: "Ravi Kumar",
    role: "AI Intern",
    avatar: "",
    date: "5 Nov, 2025",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    breakDuration: "1h 15m",
    breakCount: 3,
    netHours: "8h",
    status: "Active",
  },
  {
    id: "5",
    name: "John Doe",
    role: "Design Intern",
    avatar: "",
    date: "5 Nov, 2025",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    breakDuration: "1h 15m",
    breakCount: 3,
    netHours: "8h",
    status: "On Leave",
  },
  {
    id: "6",
    name: "John Doe",
    role: "Web Intern",
    avatar: "",
    date: "5 Nov, 2025",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    breakDuration: "1h 15m",
    breakCount: 3,
    netHours: "8h",
    status: "Active",
  },
];

const stats = [
  { icon: Users, label: "Present Today", value: "53", change: "+5% from yesterday", variant: "blue" as const },
  { icon: UserCheck, label: "Active Now", value: "42", change: "(Stable)", variant: "cyan" as const },
  { icon: Coffee, label: "On Break", value: "5", change: "+5% from yesterday", variant: "teal" as const },
  { icon: Clock, label: "Late Arrival", value: "2", change: "-1% from yesterday", variant: "orange" as const },
  { icon: UserX, label: "On Leave", value: "4", change: "+2% from yesterday", variant: "pink" as const },
];

const StatCard = ({ icon: Icon, label, value, change, variant }: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  variant: "blue" | "cyan" | "teal" | "orange" | "pink";
}) => {
  const variants = {
    blue: "bg-gradient-to-br from-blue-400 to-blue-500",
    cyan: "bg-gradient-to-br from-cyan-400 to-cyan-500",
    teal: "bg-gradient-to-br from-teal-400 to-teal-500",
    orange: "bg-gradient-to-br from-orange-300 to-orange-400",
    pink: "bg-gradient-to-br from-pink-400 to-pink-500",
  };

  return (
    <div className={`${variants[variant]} rounded-xl p-4 text-white`}>
      <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
      <div className="text-xs mt-1 opacity-80">{change}</div>
    </div>
  );
};

const getStatusBadge = (status: AttendanceRecord["status"]) => {
  const styles = {
    Active: "bg-green-100 text-green-700 border-green-200",
    "On Leave": "bg-amber-100 text-amber-700 border-amber-200",
    "On Break": "bg-red-100 text-red-700 border-red-200",
  };
  
  return (
    <Badge variant="outline" className={`${styles[status]} gap-1`}>
      <span className={`w-2 h-2 rounded-full ${
        status === "Active" ? "bg-green-500" : 
        status === "On Leave" ? "bg-amber-500" : "bg-red-500"
      }`} />
      {status}
    </Badge>
  );
};

export default function Attendance() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = attendanceData.filter((record) => {
    const matchesFilter = filter === "all" || 
      (filter === "active" && record.status === "Active") ||
      (filter === "break" && record.status === "On Break") ||
      (filter === "leave" && record.status === "On Leave");
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
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

      {/* Daily Attendance Log */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Daily Attendance Log</h2>
        <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="flex bg-muted rounded-lg p-1">
          {["all", "active", "break", "leave"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-primary text-primary-foreground" : ""}
            >
              {f === "all" ? "All" : f === "active" ? "Active" : f === "break" ? "On break" : "On Leave"}
            </Button>
          ))}
        </div>
        <Select defaultValue="profile">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profile">Profile</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="date">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
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
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-medium">Intern Profile</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Check-In</TableHead>
                <TableHead className="font-medium">Check-Out</TableHead>
                <TableHead className="font-medium">Break Duration</TableHead>
                <TableHead className="font-medium">Net Hours</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/30">
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
                  <TableCell className="text-muted-foreground">{record.date}</TableCell>
                  <TableCell className="text-muted-foreground">{record.checkIn}</TableCell>
                  <TableCell className="text-muted-foreground">{record.checkOut}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.breakDuration}
                    <span className="text-xs block">({record.breakCount} Breaks)</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.netHours}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/hr/attendance/${record.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
