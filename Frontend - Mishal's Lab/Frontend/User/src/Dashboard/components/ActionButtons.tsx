import React from "react";
import { Button } from "./ui/button";

interface ActionButtonsProps {
  onSave: () => void;
  onContinue: () => void;
}

export default function ActionButtons({ onSave, onContinue }: ActionButtonsProps) {
  return (
    <div className="flex gap-4 pt-4">
      <Button variant="outline" className="flex-1" onClick={onSave}>
        Save Progress
      </Button>
      <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
