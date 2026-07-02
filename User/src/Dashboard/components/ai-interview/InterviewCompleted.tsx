import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface InterviewCompletedProps {
  onBackToHome: () => void;
}

const InterviewCompleted = ({ onBackToHome }: InterviewCompletedProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d8cbe8] via-[#b8d6df] to-[#a7c2dd] flex items-center justify-center px-4">

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-white/40">

        {/* Emoji */}
        <div className="text-4xl mb-2">🎉</div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-black">
          Interview Completed!
        </h1>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Message */}
        <div className="space-y-2 text-gray-700 mb-6 text-base">
          <p>Thank you for applying to SmaranAI.</p>
          <p>Our team will review your application.</p>
          <p>You will be contacted if shortlisted.</p>
        </div>

        {/* Button */}
        <Button
          onClick={onBackToHome}
          className="w-full bg-[#8fb3d9] hover:bg-[#7aa4cf] text-blue-900 py-6 text-lg font-semibold rounded-xl shadow-md transition"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Button>

      </div>
    </div>
  );
};

export default InterviewCompleted;