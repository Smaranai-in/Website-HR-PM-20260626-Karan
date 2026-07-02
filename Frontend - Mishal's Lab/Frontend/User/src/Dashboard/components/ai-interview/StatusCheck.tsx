import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const StatusCheck = () => {
  const [email, setEmail] = useState("");

  const handleCheckStatus = () => {
    console.log("Checking status for:", email);
  };

  return (
    <section className="py-12 px-4 md:px-8 gradient-hero">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Applicant Status Check</h2>
        <p className="text-muted-foreground mb-8">Lorem ipsum dolor sit amet, consectetur adipisci</p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground text-left">Already Applied ?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-card border-border rounded-lg"
            />
            <Button
              onClick={handleCheckStatus}
              className="gradient-teal text-secondary-foreground px-8 rounded-lg font-semibold"
            >
              Check Status
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatusCheck;
