import { FileText, TrendingUp, BarChart3, UserCheck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    { icon: FileText, label: "1. Apply", color: "text-secondary" },
    { icon: TrendingUp, label: "2. AI Interview", color: "text-secondary" },
    { icon: BarChart3, label: "3. Evaluation", color: "text-secondary" },
    { icon: UserCheck, label: "4. Offer", color: "text-secondary" },
  ];

  return (
    <section className="py-12 px-4 md:px-8">
      <h2 className="text-2xl font-bold text-center text-foreground mb-10">How It Works</h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <span className="font-semibold text-foreground">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
