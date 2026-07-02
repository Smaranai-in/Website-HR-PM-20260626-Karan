import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Download, FileText, Award, GraduationCap } from "lucide-react";
import DocumentForm from "../../../../components/certificates/DocumentForm";
import OfferLetterTemplate from "../../../../components/certificates/documents/OfferLetterTemplate";
import CertificateTemplate from "../../../../components/certificates/documents/CertificateTemplate";
import AcademicCertificateTemplate from "../../../../components/certificates/documents/AcademicCertificateTemplate";
import { useGeneratePdf } from "../../../../hooks/useGeneratePdf";
import type { DocumentType, OfferLetterData, CertificateData, AcademicCertificateData } from "../../../../types/document";
import smaranaiLogo from "../../../../assets/smaran-logo.png";

const Index = () => {
  const [documentType, setDocumentType] = useState<DocumentType>("offer-letter");
  const [offerData, setOfferData] = useState<OfferLetterData>({
    internName: "",
    roleTitle: "",
    department: "",
    duration: "",
    mode: "",
    weeklyCommitment: "",
    dateOfJoining: "",
    issueDate: "",
  });
  const [certData, setCertData] = useState<CertificateData>({
    internName: "",
    roleTitle: "",
    startDate: "",
    endDate: "",
    totalWorkingHours: "",
    issueDate: "",
  });
  const [academicData, setAcademicData] = useState<AcademicCertificateData>({
    internName: "",
    roleTitle: "",
    startDate: "",
    endDate: "",
    totalWorkingHours: "",
    issueDate: "",
    collegeName: "",
    courseName: "",
    yearSemester: "",
    internshipId: "",
    mode: "",
  });

  const { generatePdf } = useGeneratePdf();

  const handleDataChange = (data: OfferLetterData | CertificateData | AcademicCertificateData) => {
    if (documentType === "offer-letter") {
      setOfferData(data as OfferLetterData);
    } else if (documentType === "certificate") {
      setCertData(data as CertificateData);
    } else {
      setAcademicData(data as AcademicCertificateData);
    }
  };

  const handleDownload = () => {
    const fileName = documentType === "offer-letter"
      ? `SmaranAI_Offer_Letter_${offerData.internName || "Intern"}`
      : documentType === "certificate"
        ? `SmaranAI_Certificate_${certData.internName || "Intern"}`
        : `SmaranAI_Academic_Certificate_${academicData.internName || "Intern"}`;

    generatePdf("document-preview", documentType, fileName.replace(/\s+/g, "_"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d8cbe8] via-[#b8d6df] to-[#a7c2dd]">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={smaranaiLogo} alt="SmaranAI" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Document Generator</h1>
              <p className="text-sm text-muted-foreground">Create professional internship documents</p>
            </div>
          </div>
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-smaranai-cyan via-smaranai-blue to-smaranai-purple text-white hover:opacity-90 transition-opacity"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="document-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Select Document Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="offer-letter" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Offer Letter</span>
                    </TabsTrigger>
                    <TabsTrigger value="certificate" className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span className="hidden sm:inline">Certificate</span>
                    </TabsTrigger>
                    <TabsTrigger value="academic-certificate" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">Academic</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="document-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Document Details</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentForm documentType={documentType} onDataChange={handleDataChange} />
              </CardContent>
            </Card>

            {/* Mobile download button */}
            <Button
              onClick={handleDownload}
              className="w-full lg:hidden bg-gradient-to-r from-smaranai-cyan via-smaranai-blue to-smaranai-purple text-white hover:opacity-90 transition-opacity"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Preview</h2>
            <div className="overflow-auto bg-muted rounded-lg p-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
              <div
                id="document-preview"
                className="document-shadow rounded-sm overflow-hidden"
                style={{
                  transform: documentType !== "offer-letter" ? "scale(0.52)" : "scale(0.75)",
                  transformOrigin: "top left",
                  width: documentType !== "offer-letter" ? "1123px" : "794px",
                  height: documentType !== "offer-letter" ? "794px" : "auto",
                }}
              >
                {documentType === "offer-letter" && <OfferLetterTemplate data={offerData} />}
                {documentType === "certificate" && <CertificateTemplate data={certData} />}
                {documentType === "academic-certificate" && <AcademicCertificateTemplate data={academicData} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
