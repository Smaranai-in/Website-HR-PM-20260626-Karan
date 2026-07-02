export interface OfferLetterData {
  internName: string;
  roleTitle: string;
  department: string;
  duration: string;
  mode: string;
  weeklyCommitment: string;
  dateOfJoining: string;
  issueDate: string;
}

export interface CertificateData {
  internName: string;
  roleTitle: string;
  startDate: string;
  endDate: string;
  totalWorkingHours: string;
  issueDate: string;
  supervisorSignature?: string;
  hrSignature?: string;
}

export interface AcademicCertificateData extends CertificateData {
  collegeName: string;
  courseName: string;
  yearSemester: string;
  internshipId: string;
  mode: string;
}

export type DocumentType = 'offer-letter' | 'certificate' | 'academic-certificate';
