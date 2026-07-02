import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import smaranLogo from "../../assets/smaran-logo.png";

interface ApplicationFormProps {
  role: string;
  onBack: () => void;
  onSubmit: (data: ApplicationData) => void;
}

export interface ApplicationData {
  fullName: string;
  email: string;
  gender: string;
  domain: string;
  contactNo: string;
  qualification: string;
  address: string;
  linkedin: string;
}

const ApplicationForm = ({ role, onBack, onSubmit }: ApplicationFormProps) => {
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: "",
    email: "",
    gender: "",
    domain: "Web Development",
    contactNo: "",
    qualification: "",
    address: "",
    linkedin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof ApplicationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d8cbe8] via-[#b8d6df] to-[#a7c2dd]">
      <div className="max-w-2xl mx-auto py-10 px-4">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8">
          Apply For Internships
        </h1>

        {/* Logo Card */}
        <div className="rounded-2xl shadow-lg bg-gradient-to-r from-[#a5b4fc] via-[#93c5fd] to-[#c4b5fd] p-8 text-center mb-6">
          <img src={smaranLogo} alt="SmaranAI" className="h-16 w-16 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-gray-800">
            Smaran<span className="text-indigo-600">AI</span>
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            Get a Chance to Internship
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Info Box */}
          <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-700 space-y-2">
            <p>
              Please fill all the required fields carefully, information provided
              will be used in offer letter and Completion Certificate.
            </p>
            <p className="font-semibold text-red-500">
              Note: Please do not spam (apply multiple times for same domain),
              in this case your application will be considered invalid.
            </p>
            <div>
              <p>Perks you will receive are</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                <li>Offer Letter</li>
                <li>Internship Certificate</li>
                <li>Letter of recommendation based on Performance</li>
              </ul>
            </div>
            <p>Please share your basic details and interests of specialization.</p>
          </div>

          {/* Input Field Component */}
          {[
            { label: "Full Name", key: "fullName" },
            { label: "Email", key: "email", type: "email" },
            { label: "Contact no", key: "contactNo", type: "tel" },
            { label: "Highest Academic Qualification", key: "qualification" },
            { label: "Address", key: "address" },
            { label: "Linkedin / GitHub", key: "linkedin" },
          ].map((field) => (
            <div key={field.key} className="bg-white rounded-xl shadow p-4">
              <label className="flex justify-between text-sm font-medium mb-2">
                {field.label}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={field.type || "text"}
                value={formData[field.key as keyof ApplicationData]}
                onChange={(e) =>
                  updateField(field.key as keyof ApplicationData, e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          ))}

          {/* Gender */}
          <div className="bg-white rounded-xl shadow p-4">
            <label className="flex justify-between text-sm font-medium mb-3">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-8">
              {["Male", "Female"].map((g) => (
                <label key={g} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    onChange={(e) => updateField("gender", e.target.value)}
                    required
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Domain Select */}
          <div className="bg-white rounded-xl shadow p-4">
            <label className="flex justify-between text-sm font-medium mb-2">
              Preferred Internship Domain
              <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.domain}
              onChange={(e) => updateField("domain", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option>Web Development</option>
              <option>UI/UX Design</option>
              <option>Data Science</option>
              <option>Machine Learning</option>
              <option>Mobile Development</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-300 text-blue-900 py-4 text-lg font-semibold rounded-xl shadow-md hover:bg-blue-400 transition"
          >
            Continue to AI Interview →
          </button>

        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;