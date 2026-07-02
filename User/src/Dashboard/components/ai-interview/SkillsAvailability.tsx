import { useState } from "react";
import { ArrowLeft, Bot } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface SkillsAvailabilityProps {
  onBack: () => void;
  onContinue: () => void;
}

const SkillsAvailability = ({ onBack, onContinue }: SkillsAvailabilityProps) => {
  const [hoursSelection, setHoursSelection] = useState<string | null>(null);
  const [designSystemKnowledge, setDesignSystemKnowledge] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d8cbe8] via-[#b8d6df] to-[#a7c2dd]">
      <div className="max-w-3xl mx-auto py-10 px-4">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black">
            AI Screening – Skills & Availability
          </h1>

          <div className="text-right">
            <p className="text-sm text-gray-700">Step 3 of 3</p>
            <div className="w-24 h-1 bg-blue-400 rounded-full mt-1"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-8 border border-white/40">

          {/* Hours Question */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="bg-blue-200 text-black px-5 py-3 rounded-xl">
                <span className="font-semibold">AI: </span>
                How many hours can you commit weekly?
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {["[10-15]", "[15-25]", "[25-30]"].map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => setHoursSelection(option)}
                  className={`bg-[#e6dcf2] hover:bg-[#dac9ef] border-none text-black py-6 rounded-xl transition ${hoursSelection === option ? "ring-2 ring-blue-400" : ""
                    }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Design Systems Question */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="bg-blue-200 text-black px-5 py-3 rounded-xl">
                <span className="font-semibold">AI: </span>
                Are you familiar with design systems?
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["[Yes]", "[No]"].map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => setDesignSystemKnowledge(option)}
                  className={`bg-[#e6dcf2] hover:bg-[#dac9ef] border-none text-black py-6 rounded-xl transition ${designSystemKnowledge === option ? "ring-2 ring-blue-400" : ""
                    }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-300"></div>

          {/* Project Description */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="bg-blue-200 text-black px-5 py-3 rounded-xl">
                <span className="font-semibold">AI: </span>
                Describe a recent project you worked on.
              </div>
            </div>

            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="write your answer here..."
              className="bg-white border-gray-300 rounded-xl min-h-[130px] text-black focus-visible:ring-blue-400"
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          className="w-full mt-8 bg-blue-400 hover:bg-blue-500 text-white py-6 text-lg font-semibold rounded-xl shadow-md transition"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default SkillsAvailability;