import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import SignatureUpload from "./SignatureUpload";
import type { DocumentType, OfferLetterData, CertificateData, AcademicCertificateData } from "../../types/document";

interface DocumentFormProps {
  documentType: DocumentType;
  onDataChange: (data: OfferLetterData | CertificateData | AcademicCertificateData) => void;
}

const DocumentForm = ({ documentType, onDataChange }: DocumentFormProps) => {
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
    supervisorSignature: undefined,
    hrSignature: undefined,
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
    supervisorSignature: undefined,
    hrSignature: undefined,
  });

  // Trigger initial data sync on mount and when document type changes
  useEffect(() => {
    if (documentType === "offer-letter") {
      onDataChange(offerData);
    } else if (documentType === "certificate") {
      onDataChange(certData);
    } else {
      onDataChange(academicData);
    }
  }, [documentType]);

  const handleOfferChange = (field: keyof OfferLetterData, value: string) => {
    const newData = { ...offerData, [field]: value };
    setOfferData(newData);
    onDataChange(newData);
  };

  const handleCertChange = (field: keyof CertificateData, value: string | undefined) => {
    const newData = { ...certData, [field]: value };
    setCertData(newData);
    onDataChange(newData);
  };

  const handleAcademicChange = (field: keyof AcademicCertificateData, value: string | undefined) => {
    const newData = { ...academicData, [field]: value };
    setAcademicData(newData);
    onDataChange(newData);
  };

  if (documentType === "offer-letter") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="internName">Intern Name</Label>
            <Input
              id="internName"
              placeholder="Enter intern name"
              value={offerData.internName}
              onChange={(e) => handleOfferChange("internName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleTitle">Role Title</Label>
            <Input
              id="roleTitle"
              placeholder="e.g., Frontend Developer"
              value={offerData.roleTitle}
              onChange={(e) => handleOfferChange("roleTitle", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="e.g., Technology"
              value={offerData.department}
              onChange={(e) => handleOfferChange("department", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="e.g., 3 Months"
              value={offerData.duration}
              onChange={(e) => handleOfferChange("duration", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mode">Mode</Label>
            <Select onValueChange={(value) => handleOfferChange("mode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-Site">On-Site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weeklyCommitment">Weekly Commitment</Label>
            <Select onValueChange={(value) => handleOfferChange("weeklyCommitment", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select commitment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Half Day: 15-20 hours">Half Day: 15-20 hours</SelectItem>
                <SelectItem value="Full Day: 25-30 hours">Full Day: 25-30 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfJoining">Date of Joining</Label>
            <Input
              id="dateOfJoining"
              placeholder="e.g., 01 February 2025"
              value={offerData.dateOfJoining}
              onChange={(e) => handleOfferChange("dateOfJoining", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              placeholder="e.g., 25 January 2025"
              value={offerData.issueDate}
              onChange={(e) => handleOfferChange("issueDate", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (documentType === "certificate") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="internName">Intern Name</Label>
            <Input
              id="internName"
              placeholder="Enter intern name"
              value={certData.internName}
              onChange={(e) => handleCertChange("internName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleTitle">Role Title</Label>
            <Input
              id="roleTitle"
              placeholder="e.g., Frontend Developer"
              value={certData.roleTitle}
              onChange={(e) => handleCertChange("roleTitle", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              placeholder="e.g., 01 January 2025"
              value={certData.startDate}
              onChange={(e) => handleCertChange("startDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              placeholder="e.g., 31 March 2025"
              value={certData.endDate}
              onChange={(e) => handleCertChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalWorkingHours">Total Working Hours</Label>
            <Input
              id="totalWorkingHours"
              placeholder="e.g., 240"
              value={certData.totalWorkingHours}
              onChange={(e) => handleCertChange("totalWorkingHours", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              placeholder="e.g., 01 April 2025"
              value={certData.issueDate}
              onChange={(e) => handleCertChange("issueDate", e.target.value)}
            />
          </div>
        </div>

        {/* Signature uploads */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-medium mb-4">Signatures (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <SignatureUpload
              label="Supervisor Signature"
              value={certData.supervisorSignature}
              onChange={(value) => handleCertChange("supervisorSignature", value)}
            />
            <SignatureUpload
              label="HR Signature"
              value={certData.hrSignature}
              onChange={(value) => handleCertChange("hrSignature", value)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Academic Certificate
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="internName">Intern Name</Label>
          <Input
            id="internName"
            placeholder="Enter intern name"
            value={academicData.internName}
            onChange={(e) => handleAcademicChange("internName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roleTitle">Role Title</Label>
          <Input
            id="roleTitle"
            placeholder="e.g., Frontend Developer"
            value={academicData.roleTitle}
            onChange={(e) => handleAcademicChange("roleTitle", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="collegeName">College Name</Label>
          <Input
            id="collegeName"
            placeholder="Enter college name"
            value={academicData.collegeName}
            onChange={(e) => handleAcademicChange("collegeName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseName">Course Name</Label>
          <Input
            id="courseName"
            placeholder="e.g., B.Tech Computer Science"
            value={academicData.courseName}
            onChange={(e) => handleAcademicChange("courseName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yearSemester">Year/Semester</Label>
          <Input
            id="yearSemester"
            placeholder="e.g., 3rd Year / 6th Semester"
            value={academicData.yearSemester}
            onChange={(e) => handleAcademicChange("yearSemester", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="internshipId">Internship ID</Label>
          <Input
            id="internshipId"
            placeholder="e.g., SAI-2025-001"
            value={academicData.internshipId}
            onChange={(e) => handleAcademicChange("internshipId", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            placeholder="e.g., 01 January 2025"
            value={academicData.startDate}
            onChange={(e) => handleAcademicChange("startDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            placeholder="e.g., 31 March 2025"
            value={academicData.endDate}
            onChange={(e) => handleAcademicChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalWorkingHours">Total Working Hours</Label>
          <Input
            id="totalWorkingHours"
            placeholder="e.g., 240"
            value={academicData.totalWorkingHours}
            onChange={(e) => handleAcademicChange("totalWorkingHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mode">Mode</Label>
          <Select onValueChange={(value) => handleAcademicChange("mode", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="On-Site">On-Site</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            placeholder="e.g., 01 April 2025"
            value={academicData.issueDate}
            onChange={(e) => handleAcademicChange("issueDate", e.target.value)}
          />
        </div>
      </div>

      {/* Signature uploads */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-medium mb-4">Signatures (Optional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <SignatureUpload
            label="Supervisor Signature"
            value={academicData.supervisorSignature}
            onChange={(value) => handleAcademicChange("supervisorSignature", value)}
          />
          <SignatureUpload
            label="HR Signature"
            value={academicData.hrSignature}
            onChange={(value) => handleAcademicChange("hrSignature", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;
