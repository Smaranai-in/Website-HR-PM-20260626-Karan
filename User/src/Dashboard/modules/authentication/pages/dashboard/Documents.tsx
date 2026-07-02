import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import { Button } from "../../../../components/ui/button";
import { FileText, Upload, Download, Lock, Eye, ChevronDown } from "lucide-react";
import ChatbotButton from "../../../../components/ChatbotButton";

const documents = [
  {
    name: "Internship Offer Letter",
    description: "Official Joining Offer Letter signed by HR",
    type: "PDF",
    availability: "Immediate",
    status: "Available",
    locked: false,
  },
  {
    name: "Monthly Performance Report (Oct)",
    description: "Evaluation summary for October 2025",
    type: "PDF",
    availability: "Auto-generated",
    status: "Available",
    locked: false,
  },
  {
    name: "Internship Confirmation Letter",
    description: "Proof of continuation for college",
    type: "PDF",
    availability: "After 30 Days",
    status: "Locked",
    locked: true,
  },
  {
    name: "Completion Certificate",
    description: "Final certification upon completion",
    type: "PDF",
    availability: "After End Date",
    status: "Locked",
    locked: true,
  },
];

const uploadedFiles = [
  { name: "College_NOC_Signed.pdf", date: "Uploaded on 5 Oct, 2025", type: "pdf" },
  { name: "Student_IDCard.png", date: "Uploaded on 5 Oct, 2025", type: "image" },
];

const Documents = () => {
  return (
    <div className="flex h-screen bg-purple-50">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Documents" />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Documents & Certificates</h1>
            <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
          </div>
          
          {/* Available Documents */}
          <div className="bg-card rounded-xl p-6 border border-border mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-primary">Available Documents</h2>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                All Documents
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="text-left p-4 rounded-l-lg">Document Name</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Availability</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4 rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="p-4">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{doc.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{doc.availability}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doc.locked 
                            ? "bg-gray-800 text-white" 
                            : "bg-green-500 text-white"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {doc.locked ? (
                          <Button variant="outline" size="sm" disabled className="gap-2 text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            Locked
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-2 text-primary border-primary">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Upload College Documents */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Upload College Documents</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Upload Section */}
              <div>
                <h3 className="font-semibold mb-4">Submit NOC / Approval Forms</h3>
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium mb-1">Click to upload or drag & drop</p>
                    <p className="text-sm text-muted-foreground">SVG, PNG, JPG or PDF (Max 10MB)</p>
                  </div>
                </div>
              </div>
              
              {/* Previously Uploaded */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-4">Previously Uploaded</h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          file.type === "pdf" ? "bg-red-100" : "bg-blue-100"
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            file.type === "pdf" ? "text-red-500" : "text-blue-500"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default Documents;
