import { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
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
  Upload, 
  Search, 
  Download,
  Eye,
  Link as LinkIcon,
  CheckCircle2,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface EligibleIntern {
  id: string;
  internId: string;
  internName: string;
  manager: string;
  duration: string;
  status: "Completed" | "Ongoing";
}

interface GeneratedCertificate {
  id: string;
  internId: string;
  certificateId: string;
  internName: string;
  dateIssued: string;
  qrLink: string;
  verified: boolean;
}

const eligibleInterns: EligibleIntern[] = [
  { id: "1", internId: "INT001DES", internName: "Priya Verma", manager: "Ravi Kumar", duration: "Jun-Oct 2025", status: "Completed" },
  { id: "2", internId: "INT001DES", internName: "Priya Verma", manager: "Ravi Kumar", duration: "Jun-Oct 2025", status: "Completed" },
  { id: "3", internId: "INT001DES", internName: "Priya Verma", manager: "Ravi Kumar", duration: "Jun-Oct 2025", status: "Completed" },
  { id: "4", internId: "INT001DES", internName: "Priya Verma", manager: "Ravi Kumar", duration: "Jun-Oct 2025", status: "Completed" },
];

const generatedCertificates: GeneratedCertificate[] = [
  { id: "1", internId: "INT001DES", certificateId: "CERT-INT2025-012", internName: "Priya Verma", dateIssued: "01 Nov 2025", qrLink: "View", verified: true },
  { id: "2", internId: "INT001DES", certificateId: "CERT-INT2025-012", internName: "Priya Verma", dateIssued: "01 Nov 2025", qrLink: "View", verified: true },
  { id: "3", internId: "INT001DES", certificateId: "CERT-INT2025-012", internName: "Priya Verma", dateIssued: "01 Nov 2025", qrLink: "View", verified: true },
  { id: "4", internId: "INT001DES", certificateId: "CERT-INT2025-012", internName: "Priya Verma", dateIssued: "01 Nov 2025", qrLink: "View", verified: true },
];

const SortableHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
    {children}
    <div className="flex flex-col">
      <ChevronUp className="h-3 w-3 -mb-1" />
      <ChevronDown className="h-3 w-3" />
    </div>
  </div>
);

export default function Certificates() {
  const [eligibleFilter, setEligibleFilter] = useState("all");
  const [certFilter, setCertFilter] = useState("all");
  const [searchEligible, setSearchEligible] = useState("");
  const [searchCert, setSearchCert] = useState("");

  return (
    <>
      {/* Eligible Interns Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Eligible Interns</h2>
        <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
      </div>

      {/* Eligible Interns Filters */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="flex bg-muted rounded-lg p-1">
          {["all", "completed", "ongoing"].map((f) => (
            <Button
              key={f}
              variant={eligibleFilter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setEligibleFilter(f)}
              className={eligibleFilter === f ? "bg-primary text-primary-foreground" : ""}
            >
              {f === "all" ? "All" : f === "completed" ? "Completed" : "Ongoing"}
            </Button>
          ))}
        </div>
        <Select defaultValue="manager">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="created">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Created" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9 w-48"
            value={searchEligible}
            onChange={(e) => setSearchEligible(e.target.value)}
          />
        </div>
      </div>

      {/* Eligible Interns Table */}
      <Card className="mb-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-medium">
                  <SortableHeader>Intern ID</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>Intern Name</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>Manager</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>Duration</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>Status</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eligibleInterns.map((intern) => (
                <TableRow key={intern.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground">{intern.internId}</TableCell>
                  <TableCell className="text-muted-foreground">{intern.internName}</TableCell>
                  <TableCell className="text-muted-foreground">{intern.manager}</TableCell>
                  <TableCell className="text-muted-foreground">{intern.duration}</TableCell>
                  <TableCell className="text-muted-foreground">{intern.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-10">
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Generated Certificates Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Generated Certificates</h2>
        <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
      </div>

      {/* Generated Certificates Filters */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="flex bg-muted rounded-lg p-1">
          {["all", "verified", "unverified"].map((f) => (
            <Button
              key={f}
              variant={certFilter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setCertFilter(f)}
              className={certFilter === f ? "bg-primary text-primary-foreground" : ""}
            >
              {f === "all" ? "All" : f === "verified" ? "Verified" : "Unverified"}
            </Button>
          ))}
        </div>
        <Select defaultValue="status">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="created">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Created" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9 w-48"
            value={searchCert}
            onChange={(e) => setSearchCert(e.target.value)}
          />
        </div>
      </div>

      {/* Generated Certificates Table */}
      <Card className="mb-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-medium">
                  <SortableHeader>Intern ID</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>Certificate ID</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>Intern Name</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>Date Issued</SortableHeader>
                </TableHead>
                <TableHead className="font-medium">
                  <SortableHeader>QR Link</SortableHeader>
                </TableHead>
                <TableHead className="font-medium text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedCertificates.map((cert) => (
                <TableRow key={cert.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground">{cert.internId}</TableCell>
                  <TableCell className="text-muted-foreground">{cert.certificateId}</TableCell>
                  <TableCell className="text-muted-foreground">{cert.internName}</TableCell>
                  <TableCell className="text-muted-foreground">{cert.dateIssued}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" className="text-primary gap-1 p-0">
                      <LinkIcon className="h-3 w-3" />
                      {cert.qrLink}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    {cert.verified && (
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Export
        </Button>
      </div>
    </>
  );
}
