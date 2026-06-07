import React from "react";
import { Step, Choice, ComplianceLevel } from "@/types/evaluation";
import { ChevronDown, ChevronUp, Info, Trophy, Search, Check, AlertTriangle, X, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StepCardProps {
  step: Step;
  isExpanded: boolean;
  isLastStep: boolean;
  isConclusion: boolean;
  outcomeLevel?: ComplianceLevel;
  onChoice: (choice: Choice) => void;
  onJumpBack: () => void;
}

function getOutcomeIcon(level: ComplianceLevel) {
  switch (level) {
    case "compliant":
      return <Check className="w-5 h-5 text-green-500" />;
    case "partial":
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case "non-compliant":
      return <X className="w-5 h-5 text-red-500" />;
  }
}

function getDimensionBadge(dimension: string): { label: string; color: string } {
  switch (dimension) {
    case "compliance":
      return { label: "Conformité", color: "bg-blue-100 text-blue-700" };
    case "utility":
      return { label: "Utilité", color: "bg-emerald-100 text-emerald-700" };
    case "usability":
      return { label: "Utilisabilité", color: "bg-orange-100 text-orange-700" };
    case "acceptability":
      return { label: "Acceptabilité", color: "bg-purple-100 text-purple-700" };
    default:
      return { label: dimension, color: "bg-gray-100 text-gray-700" };
  }
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  isExpanded,
  isLastStep,
  isConclusion,
  outcomeLevel,
  onChoice,
  onJumpBack,
}) => {
  const badge = getDimensionBadge(step.dimension);
  const isSuccess = step.id === "success";
  const isReject = step.id === "reject" || step.id === "final-reject";

  return (
    <div
      id={`step-${step.id}`}
      className={`rounded-xl border transition-all duration-300 hover:shadow-md ${
        isLastStep
          ? "border-[#005E6E] bg-[#F8F8FA] shadow-lg shadow-[#005E6E]/5"
          : "border-[#E5E7EB] bg-[#F8F8FA]"
      } ${isSuccess ? "bg-green-50 border-green-300" : ""} ${
        isReject ? "bg-red-50 border-red-300" : ""
      }`}
      onClick={() => {
        if (!isLastStep) onJumpBack();
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3 flex-1">
            {!isLastStep && outcomeLevel && (
              <div className="mt-1 flex-shrink-0">
                {getOutcomeIcon(outcomeLevel)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {!isConclusion && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
                    {badge.label}
                  </span>
                )}
                {step.isAction && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    Action
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-[#2D3648] text-lg leading-snug">
                {isConclusion ? (
                  <span className="flex items-center gap-2">
                    {isSuccess && <Trophy className="text-green-500" size={24} />}
                    {isReject && <Search className="text-[#2D3648]" size={24} />}
                    {step.question}
                  </span>
                ) : (
                  step.question
                )}
              </h3>
            </div>
            {step.infoTooltip && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="mt-1 p-1 rounded-full hover:bg-[#005E6E]/20 text-[#005E6E] transition-colors flex-shrink-0">
                    <Info size={16} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="max-w-sm p-4 text-sm bg-white border border-gray-200 shadow-lg leading-relaxed"
                  side="top"
                  sideOffset={5}
                  align="center"
                >
                  <p className="whitespace-pre-line">{step.infoTooltip}</p>
                  {step.infoSources && step.infoSources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Sources :</p>
                      {step.infoSources.map((src, i) => (
                        <a
                          key={i}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#005E6E] hover:underline"
                        >
                          <ExternalLink size={10} />
                          {src}
                        </a>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
          {!isLastStep && (
            <button className="text-[#005E6E] p-1 hover:bg-[#005E6E]/20 rounded-full transition-colors flex-shrink-0">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>

        {(isExpanded || isLastStep) && isLastStep && (
          <div className="mt-6 animate-fade-in">
            <div className="flex flex-col gap-3">
              {step.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className="w-full px-6 py-3 rounded-lg text-left transition-all duration-200 font-medium text-center bg-[#005E6E] hover:bg-[#005E6E]/80 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChoice(choice);
                  }}
                >
                  {choice.text}
                  {choice.warning && (
                    <span className="block text-xs mt-1 opacity-75">
                      ⚠ {choice.warning}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCard;
