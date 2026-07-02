import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pencil, Trash2, Eye, Search, Plus, FileText, ClipboardList } from "lucide-react";

interface Template {
  id: string;
  name: string;
  tasksCount: number;
  createdBy: string;
  lastModified: string;
}

const mockTemplates: Template[] = [
  { id: "T001DEV", name: "Developer Checklist", tasksCount: 10, createdBy: "HR Riya Sharma", lastModified: "30 Oct 2025" },
  { id: "T001DEV", name: "Developer Checklist", tasksCount: 10, createdBy: "HR Riya Sharma", lastModified: "30 Oct 2025" },
  { id: "T001GEN", name: "Default Onboarding", tasksCount: 8, createdBy: "HR Admin", lastModified: "25 Oct 2025" },
  { id: "T001GEN", name: "Default Onboarding", tasksCount: 8, createdBy: "HR Admin", lastModified: "25 Oct 2025" },
];

export function OnboardingTemplates() {
  const [templateName, setTemplateName] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Templates</h2>
        <p className="text-muted-foreground mt-1">Lorem ipsum dolor sit amet, consectetur adipisci</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-center gap-3">
        <Tabs defaultValue="all" className="w-auto">
          <TabsList className="bg-secondary">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              onClick={() => setFilter("all")}
            >
              All
            </TabsTrigger>
            <TabsTrigger value="dev" onClick={() => setFilter("dev")}>DEV</TabsTrigger>
            <TabsTrigger value="gen" onClick={() => setFilter("gen")}>GEN</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Template Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="dev">Developer Checklist</SelectItem>
            <SelectItem value="default">Default Onboarding</SelectItem>
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
          <Input 
            placeholder="Search..." 
            className="w-32 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Templates Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-medium text-primary">Template ID</TableHead>
                <TableHead className="font-medium text-primary">Template Name</TableHead>
                <TableHead className="font-medium text-primary">Tasks Count</TableHead>
                <TableHead className="font-medium text-primary">Created By</TableHead>
                <TableHead className="font-medium text-primary">Last Modified</TableHead>
                <TableHead className="font-medium text-primary text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTemplates.map((template, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground font-mono">{template.id}</TableCell>
                  <TableCell className="text-foreground">{template.name}</TableCell>
                  <TableCell className="text-muted-foreground">{template.tasksCount}</TableCell>
                  <TableCell className="text-muted-foreground">{template.createdBy}</TableCell>
                  <TableCell className="text-muted-foreground">{template.lastModified}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Template Button */}
      <div className="flex justify-center">
        <Button className="bg-primary text-primary-foreground gap-2 rounded-full px-6">
          Add Template <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Create Template Form */}
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Create Template</h3>
              <p className="text-sm text-muted-foreground">Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Enter Template Name</label>
            <Input
              placeholder="Template name..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Add Tasks</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter task..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="border-border pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Mark As Mandatory
              </Button>
            </div>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Save Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
