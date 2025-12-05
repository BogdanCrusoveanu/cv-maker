import React from "react";
import { Plus } from "lucide-react";
import { Button } from "./Button";

interface SectionHeaderProps {
  title: string;
  color?: "blue" | "green" | "purple" | "orange" | "pink" | "teal" | "indigo";
  onAdd: () => void;
  addButtonLabel: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  color = "blue",
  onAdd,
  addButtonLabel,
}) => {
  const borderColors: Record<string, string> = {
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    orange: "border-orange-500",
    pink: "border-pink-500",
    teal: "border-teal-500",
    indigo: "border-indigo-500",
  };

  const borderClass = borderColors[color] || borderColors.blue;

  return (
    <div className="flex justify-between items-center mb-4">
      <h2
        className={`text-2xl font-bold text-gray-800 pb-1 border-b-2 ${borderClass}`}
      >
        {title}
      </h2>
      <Button onClick={onAdd} color={color} icon={Plus}>
        {addButtonLabel}
      </Button>
    </div>
  );
};
