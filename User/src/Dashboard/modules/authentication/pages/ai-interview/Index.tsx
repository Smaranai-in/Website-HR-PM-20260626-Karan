import { useState, useRef } from "react";
import Header from "../../../../components/ai-interview/Header";
import ApplicationForm from "../../../../components/ai-interview/ApplicationForm";
import type { ApplicationData } from "../../../../components/ai-interview/ApplicationForm";
import AIInterview from "../../../../components/ai-interview/AIInterview";
import CVParsing from "../../../../components/ai-interview/CVParsing";
import SkillsAvailability from "../../../../components/ai-interview/SkillsAvailability";
import InterviewCompleted from "../../../../components/ai-interview/InterviewCompleted";
import { ClipboardCheck, Video, BarChart3, Handshake } from "lucide-react";

type Step =
  | "home"
  | "apply"
  | "interview"
  | "cv-parsing"
  | "skills"
  | "completed";

const internships = [
  { id: 1, title: "UI/UX Designer Intern", duration: "2 Months", mode: "Remote" },
  { id: 2, title: "Front Developer Intern", duration: "2 Months", mode: "Remote" },
];

const Index = () => {
  const [step, setStep] = useState<Step>("home");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [applicantData, setApplicantData] =
    useState<ApplicationData | null>(null);
  const internshipsRef = useRef<HTMLDivElement>(null);

  const handleApply = (role: string) => {
    setSelectedRole(role);
    setStep("apply");
  };

  const handleFormSubmit = (data: ApplicationData) => {
    setApplicantData(data);
    setStep("interview");
  };

  const handleInterviewComplete = () => {
    setStep("cv-parsing");
  };

  const handleCVParsingContinue = () => {
    setStep("skills");
  };

  const handleSkillsContinue = () => {
    setStep("completed");
  };

  const handleBackToHome = () => {
    setStep("home");
    setSelectedRole("");
    setApplicantData(null);
  };

  const scrollToInternships = () => {
    internshipsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ------------------ STEP ROUTING ------------------ */

  if (step === "apply") {
    return (
      <>
        <Header />
        <ApplicationForm
          role={selectedRole}
          onBack={() => setStep("home")}
          onSubmit={handleFormSubmit}
        />
      </>
    );
  }

  if (step === "interview") {
    return (
      <>
        <Header />
        <AIInterview
          role={selectedRole}
          onBack={() => setStep("apply")}
          onComplete={handleInterviewComplete}
        />
      </>
    );
  }

  if (step === "cv-parsing") {
    return (
      <>
        <Header />
        <CVParsing
          applicantData={applicantData!}
          onBack={() => setStep("interview")}
          onContinue={handleCVParsingContinue}
        />
      </>
    );
  }

  if (step === "skills") {
    return (
      <>
        <Header />
        <SkillsAvailability
          onBack={() => setStep("cv-parsing")}
          onContinue={handleSkillsContinue}
        />
      </>
    );
  }

  if (step === "completed") {
    return (
      <>
        <Header />
        <InterviewCompleted onBackToHome={handleBackToHome} />
      </>
    );
  }

  /* ------------------ HOME PAGE ------------------ */

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d8cbe8] via-[#b8d6df] to-[#a7c2dd]">
      <Header />

      {/* HERO SECTION */}
      <div className="mx-6 mt-6 rounded-3xl shadow-xl bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#7c3aed] text-white px-10 py-16 text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          Build Your Career with SmaranAI
        </h1>

        <p className="text-lg opacity-90 mb-8">
          Apply for real-world internships powered by AI-driven evaluation.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleApply("General")}
            className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition duration-300"
          >
            Start AI Interview
          </button>

          <button
            onClick={scrollToInternships}
            className="bg-blue-200 text-blue-800 px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition duration-300"
          >
            View Open Internships
          </button>
        </div>

        <div className="flex justify-center gap-10 mt-10 text-sm opacity-90">
          <span>✔ AI Based Screening</span>
          <span>✔ Real-World Projects</span>
          <span>✔ Verified Certificate</span>
        </div>
      </div>

      {/* INTERNSHIPS SECTION */}
      <section ref={internshipsRef} className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Available Internship Roles
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {internships.map((internship, index) => (
            <div
              key={internship.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300"
            >
              <div
                className={`${index === 0 ? "bg-blue-200" : "bg-purple-200"
                  } rounded-lg px-4 py-3 font-semibold text-lg mb-6`}
              >
                {internship.title}
              </div>

              <div className="space-y-3 text-gray-700 mb-6">
                <p>📅 Duration : {internship.duration}</p>
                <p>💻 Mode : {internship.mode}</p>
              </div>

              <div className="flex justify-between items-center">
                <button className="text-gray-500 hover:underline">
                  View Details
                </button>

                <button
                  onClick={() => handleApply(internship.title)}
                  className={`${index === 0
                    ? "bg-blue-300 text-blue-900 hover:bg-blue-400"
                    : "bg-purple-300 text-purple-900 hover:bg-purple-400"
                    } px-5 py-2 rounded-lg shadow transition`}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-5xl mx-auto grid md:grid-cols-4 gap-8 text-center">

          {/* 1. Apply */}
          <div>
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
              <ClipboardCheck size={36} className="text-blue-900" />
            </div>
            <p className="mt-4 font-semibold">1. Apply</p>
          </div>

          {/* 2. AI Interview */}
          <div>
            <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center mx-auto">
              <Video size={36} className="text-purple-900" />
            </div>
            <p className="mt-4 font-semibold">2. AI Interview</p>
          </div>

          {/* 3. Evaluation */}
          <div>
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 size={36} className="text-blue-900" />
            </div>
            <p className="mt-4 font-semibold">3. Evaluation</p>
          </div>

          {/* 4. Offer */}
          <div>
            <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center mx-auto">
              <Handshake size={36} className="text-purple-900" />
            </div>
            <p className="mt-4 font-semibold">4. Offer</p>
          </div>

        </div>
      </section>

      {/* STATUS CHECK */}
      <section className="px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-6">
          Applicant Status Check
        </h2>

        <p className="text-center text-gray-600 mb-10">
          Already Applied ?
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <input
            type="email"
            placeholder="Email"
            className="w-full max-w-xl px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button className="bg-blue-300 text-blue-900 px-6 py-3 rounded-lg shadow-md hover:bg-blue-400 transition">
            Check Status
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;