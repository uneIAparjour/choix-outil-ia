import React from "react";
import { Link } from "react-router-dom";
import DecisionTree from "@/components/DecisionTree";
import { ArrowLeftRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <DecisionTree />
      <div className="flex justify-center py-6">
        <Link
          to="/comparer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#005E6E] text-white text-sm font-medium shadow-md hover:bg-[#005E6E]/80 transition-all"
        >
          <ArrowLeftRight size={16} />
          Comparer deux outils
        </Link>
      </div>
    </div>
  );
};

export default Index;
