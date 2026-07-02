import { ArrowLeft, CheckCircle2, Bot } from "lucide-react";
import type { ApplicationData } from "./ApplicationForm";

interface CVParsingProps {
  applicantData: ApplicationData;
  onBack: () => void;
  onContinue: () => void;
}

const CVParsing = ({ applicantData, onBack, onContinue }: CVParsingProps) => {
  const parsedData = {
    name: applicantData.fullName || "John Doe",
    dateOfBirth: "28 Apr, 2006",
    email: applicantData.email || "johndoe003@gmail.com",
    phone: applicantData.contactNo || "+91 12345-12447",
    address: applicantData.address || "Mumbai, India",
    skills: ["Figma", "Html", "CSS", "React Js", "CSS", "Javascript", "Node Js"],
    experience: {
      company: "Certify Technologies Pvt. Ltd",
      duration: "4 Months",
    },
    education: {
      university: "XYZ University, 2024",
      degree: "B.Tech in Computer Science & engineering",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d8cbe8] via-[#b8d6df] to-[#a7c2dd]">
      <div className="max-w-5xl mx-auto py-8 px-6">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            AI Screening – <span className="text-gray-500">CV Parsing</span>
          </h1>

          <div className="text-right">
            <p className="text-sm font-medium">Step 2 of 3</p>
            <div className="flex gap-1 mt-1">
              <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
              <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="bg-green-100 border border-green-300 rounded-xl p-4 flex items-center gap-3 mb-6 shadow-sm">
          <CheckCircle2 size={22} className="text-green-600" />
          <span className="text-green-700 font-medium">
            Resume Parsed Successfully
          </span>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">

          <h2 className="text-lg font-semibold text-center text-gray-600">
            Applied for UI/UX Internship
          </h2>

          {/* Basic Info */}
          <div className="space-y-4">
            <InfoRow label="Name :" value={parsedData.name} />
            <InfoRow label="Date of Birth :" value={parsedData.dateOfBirth} />
            <InfoRow label="Email :" value={parsedData.email} />
            <InfoRow label="Phone no :" value={parsedData.phone} />
            <InfoRow label="Address :" value={parsedData.address} />
          </div>

          {/* Skills */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-3">Skills :</p>
            <div className="flex flex-wrap gap-3">
              {parsedData.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-4 py-1 rounded-full text-sm font-medium ${index % 2 === 0
                    ? "bg-blue-200 text-blue-900"
                    : "bg-purple-200 text-purple-900"
                    }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <p className="text-sm text-gray-500">Prior Experience :</p>
            <p className="font-semibold">{parsedData.experience.company}</p>
            <p className="text-sm text-gray-600">{parsedData.experience.duration}</p>
          </div>

          {/* Education */}
          <div>
            <p className="text-sm text-gray-500">Education :</p>
            <p className="font-semibold">{parsedData.education.university}</p>
            <p className="text-sm text-gray-600">{parsedData.education.degree}</p>
          </div>

          {/* Edit Button */}
          <button className="w-full bg-purple-400 text-white py-4 rounded-xl shadow hover:bg-purple-500 transition font-semibold">
            [ Edit Details ]
          </button>
        </div>

        {/* AI Confirmation Bubble */}
        <div className="flex items-start gap-3 mt-6">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
            <Bot size={18} className="text-blue-900" />
          </div>
          <div className="bg-blue-100 px-4 py-3 rounded-2xl text-sm">
            <span className="font-semibold">AI: </span>
            Please confirm the extracted details.
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onContinue}
          className="w-full bg-blue-400 text-white py-5 text-lg rounded-xl shadow-md hover:bg-blue-500 transition mt-6 font-semibold"
        >
          Confirm & Continue →
        </button>

      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <span className="w-40 text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default CVParsing;