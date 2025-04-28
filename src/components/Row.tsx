import React from "react";

interface RowProps {
  children: React.ReactNode;
  className?: string;
}

function Row({ children, className = "" }: RowProps) {
  return <div className={`flex flex-wrap w-full ${className}`}>{children}</div>;
}

export default Row;
