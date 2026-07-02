import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Download, FileText, Image, X } from "lucide-react";

interface Document {
  name: string;
  type: "pdf" | "image";
  uploadedOn: string;
}

interface UploadedDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internName: string;
  documents: Document[];
}

const mockDocuments: Document[] = [
  { name: "College_NOC_Signed.pdf", type: "pdf", uploadedOn: "5 Oct, 2025" },
  { name: "Student_IDCard.png", type: "image", uploadedOn: "5 Oct, 2025" },
];

export function UploadedDocumentsDialog({ 
  open, 
  onOpenChange, 
  internName,
  documents = mockDocuments 
}: UploadedDocumentsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-foreground">
            Uploaded-{internName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl ${
                doc.type === "pdf" 
                  ? "bg-blue-100 dark:bg-blue-900/30" 
                  : "bg-violet-100 dark:bg-violet-900/30"
              }`}
            >
              <div className="flex items-center gap-3">
                {doc.type === "pdf" ? (
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Image className="h-6 w-6 text-blue-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">Uploaded on {doc.uploadedOn}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Download className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
