import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "Dashboard/components/dashboard/DashboardHeader";
import StatusCard from "Dashboard/components/StatusCard";
import ProgressSection from "Dashboard/components/ProgressSection";
import TaskList from "Dashboard/components/TaskList";
import TrialBanner from "Dashboard/components/TrialBanner";
import ActionButtons from "Dashboard/components/ActionButtons";
import TrialTasksDialog from "Dashboard/components/TrialTasksDialog";
import ChatbotButton from "Dashboard/components/ChatbotButton";
import { Separator } from "Dashboard/components/ui/separator";

const tasks = [
  { id: 1, title: "Upload Govt ID (Aadhar/PAN)", status: "pending" as const, actionType: "upload" as const },
  { id: 2, title: "Upload Resume / Portfolio", status: "verified" as const, actionType: "view" as const },
  { id: 3, title: "Fill Personal Details", status: "action" as const, actionLabel: "Complete Form" },
  { id: 4, title: "Join Teams Workspace", status: "action" as const, actionLabel: "Connect" },
  { id: 5, title: "Accept NDA Policy", status: "action" as const, actionLabel: "Review & Accept" },
  { id: 6, title: "Complete Trial Tasks Checklist", status: "action" as const, actionLabel: "View Tasks" },
];

const Index = () => {
  const navigate = useNavigate();
  const [showTrialTasks, setShowTrialTasks] = useState(false);

  const handleSave = () => {
    console.log("Saving progress...");
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handleTaskClick = () => {
    setShowTrialTasks(true);
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <Header userName="John Doe" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card-dashboard space-y-6">
          <StatusCard 
            status="Unpaid Intern"
            daysLeft={12}
            internId="INT001WEB"
            manager="Musfiq(Supervisor)"
          />
          
          <Separator />
          
          <ProgressSection 
            title="Onboarding Progress"
            description="Lorem ipsum dolor sit amet, consectetur adipisci"
            progress={75}
          />
          
          <Separator />
          
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
          
          <TrialBanner 
            status="Trial Confirmation Status: Pending Review by HR"
            message="(You will become a confirmed Intern after HR Approves)"
          />
          
          <ActionButtons 
            onSave={handleSave}
            onContinue={handleContinue}
          />
        </div>
      </main>

      <TrialTasksDialog 
        open={showTrialTasks} 
        onOpenChange={setShowTrialTasks} 
      />
      
      <ChatbotButton />
    </div>
  );
};

export default Index;
