import React from "react";
import { Progress } from "./ui/progress";

interface ProgressSectionProps {
  title: string;
  description: string;
  progress: number;
}

export default function ProgressSection({ title, description, progress }: ProgressSectionProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
