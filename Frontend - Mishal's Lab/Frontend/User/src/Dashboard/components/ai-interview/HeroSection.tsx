import { Check } from "lucide-react";
import { Button } from "../ui/button";

interface HeroSectionProps {
  onStartInterview: () => void;
  onViewInternships: () => void;
}

const HeroSection = ({ onStartInterview, onViewInternships }: HeroSectionProps) => {
  const features = [
    "AI Based Screening",
    "Real-World Projects",
    "Verified Certificate",
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="gradient-hero rounded-3xl mx-4 md:mx-8 my-6 py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Build Your Career with{" "}
            <span className="text-gradient">SmaranAI</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8">
            Apply for real-world internships powered by AI-driven evaluation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={onStartInterview}
              className="gradient-primary text-primary-foreground px-8 py-6 text-base font-semibold rounded-lg shadow-card hover:shadow-card-hover transition-all"
            >
              Start AI Interview
            </Button>
            <Button
              variant="outline"
              onClick={onViewInternships}
              className="border-primary text-primary bg-transparent hover:bg-primary/5 px-8 py-6 text-base font-semibold rounded-lg"
            >
              View Open Internships
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-muted-foreground">
                <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-secondary" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
