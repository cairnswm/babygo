import React from "react";

type Condition = "New" | "Like New" | "Good" | "Fair" | "Poor" | string;

interface ConditionBadgeProps {
  condition?: Condition;
  className?: string;
}

const getConditionColor = (condition?: Condition) => {
  switch (condition) {
    case "New":
      return "bg-green-100 text-green-800";
    case "Like New":
      return "bg-teal-100 text-teal-800";
    case "Good":
      return "bg-blue-100 text-blue-800";
    case "Fair":
      return "bg-yellow-100 text-yellow-800";
    case "Poor":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ConditionBadge: React.FC<ConditionBadgeProps> = ({ condition, className = "" }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${getConditionColor(condition)} ${className}`}>
    {condition ?? "Unknown"}
  </span>
);

export default ConditionBadge;
