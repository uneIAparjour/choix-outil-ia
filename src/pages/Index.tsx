
import React from "react";
import DecisionTree from "@/components/DecisionTree";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6FF] to-white">
      <TooltipProvider>
        <DecisionTree />
      </TooltipProvider>
    </div>
  );
};

export default Index;
