import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Info, Trophy, Search, RotateCcw } from "lucide-react";
import { decisionTreeData } from "@/data/decisionTreeData";

interface Step {
  id: string;
  question: string;
  choices: {
    text: string;
    nextStep: string;
  }[];
  infoTooltip?: string;
  isAction?: boolean;
}

const DecisionTree: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(["1"]);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(["1"]));
  const [showConfetti, setShowConfetti] = useState(false);
  const treeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getCurrentStep = (): Step | undefined => {
    const currentStepId = currentPath[currentPath.length - 1];
    return decisionTreeData.find((step) => step.id === currentStepId);
  };

  const handleChoice = (nextStep: string) => {
    if (nextStep.startsWith("Retour")) {
      const stepMatch = nextStep.match(/Étape (\d+\.?\d*)/);
      if (stepMatch && stepMatch[1]) {
        const targetStep = stepMatch[1];
        
        const foundStep = decisionTreeData.find(
          (step) => step.id === targetStep
        );
        
        if (foundStep) {
          setExpandedSteps(new Set([foundStep.id]));
          setCurrentPath([foundStep.id]);
          setTimeout(() => scrollToLatestStep(), 100);
          return;
        }
      }
    }

    const nextStepData = decisionTreeData.find((step) => step.id === nextStep);
    if (nextStepData && (nextStep === "17" || nextStep === "19")) {
      if (nextStep === "17") {
        setShowConfetti(true);
        
        if (treeRef.current) {
          createConfetti(treeRef.current);
        }
        
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      const newExpandedSteps = new Set<string>();
      newExpandedSteps.add(nextStep);
      setExpandedSteps(newExpandedSteps);
      
      setCurrentPath([...currentPath, nextStep]);
      
      setTimeout(() => scrollToLatestStep(), 100);
      return;
    }

    if (nextStep === "1" && (currentPath.includes("17") || currentPath.includes("19"))) {
      resetTree();
      return;
    }

    setCurrentPath([...currentPath, nextStep]);
    
    const newExpandedSteps = new Set<string>();
    newExpandedSteps.add(nextStep);
    setExpandedSteps(newExpandedSteps);
    
    setTimeout(() => scrollToLatestStep(), 100);
  };

  const jumpToStep = (index: number) => {
    if (index >= currentPath.length - 1) return;
    
    const targetStepId = currentPath[index];
    
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    
    const newExpandedSteps = new Set<string>();
    newExpandedSteps.add(targetStepId);
    setExpandedSteps(newExpandedSteps);
    
    setTimeout(() => {
      const targetStep = document.getElementById(`step-${targetStepId}`);
      if (targetStep) {
        targetStep.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const scrollToLatestStep = () => {
    const latestStep = document.getElementById(`step-${currentPath[currentPath.length - 1]}`);
    if (latestStep) {
      latestStep.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const createConfetti = (container: HTMLDivElement) => {
    const colors = ["#9b87f5", "#1EAEDB", "#F2FCE2", "#D6BCFA"];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 2000);
    }
  };

  const resetTree = () => {
    setCurrentPath(["1"]);
    setExpandedSteps(new Set(["1"]));
    setShowConfetti(false);
    
    toast({
      title: "Arbre de décision réinitialisé",
      description: "Vous pouvez recommencer votre parcours",
    });
    
    setTimeout(() => scrollToLatestStep(), 100);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen bg-gradient-to-br from-[#F4F6FF] to-white font-plus-jakarta" ref={treeRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D3648] leading-tight">
            Aide au choix d'une application utilisant l'IA générative
          </h1>
          <button
            onClick={resetTree}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEF1FF] hover:bg-[#E2E7FF] text-[#6172F3] transition-colors"
            title="Réinitialiser le parcours"
          >
            <RotateCcw size={18} />
            <span className="text-sm font-medium">Recommencer</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {currentPath.map((stepId, index) => {
          const step = decisionTreeData.find((s) => s.id === stepId);
          if (!step) return null;

          const isExpanded = expandedSteps.has(stepId);
          const isLastStep = index === currentPath.length - 1;
          const isConclusion = stepId === "17" || stepId === "19";

          return (
            <div
              key={stepId}
              id={`step-${stepId}`}
              className={`rounded-xl border ${
                isLastStep 
                  ? "border-[#6172F3] bg-white shadow-lg shadow-[#6172F3]/5" 
                  : "border-[#E5E7EB] bg-white/50"
              } ${
                isConclusion && stepId === "17" ? "bg-[#F0FDF4] border-[#4ADE80]" : ""
              } transition-all duration-300 hover:shadow-md`}
              onClick={() => {
                if (!isLastStep) {
                  jumpToStep(index);
                }
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-semibold text-[#2D3648] text-lg">
                    {isConclusion ? (
                      <span className="flex items-center gap-2">
                        {stepId === "17" && <Trophy className="text-[#4ADE80]" size={24} />}
                        {stepId === "19" && <Search className="text-[#2D3648]" size={24} />}
                        {step.question}
                      </span>
                    ) : (
                      <>{step.question}</>
                    )}
                  </h3>
                  {!isLastStep && (
                    <button className="text-[#6172F3] p-1 hover:bg-[#EEF1FF] rounded-full transition-colors">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  )}
                </div>
                
                {(isExpanded || isLastStep) && (
                  <div className="mt-6 animate-fade-in">
                    {step.infoTooltip && (
                      <div className="mb-6 p-4 bg-[#EEF1FF] rounded-lg flex items-start gap-3">
                        <Info size={20} className="text-[#6172F3] flex-shrink-0 mt-1" />
                        <div 
                          className="text-[#2D3648] text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: step.infoTooltip.replace(/\n/g, '<br>') 
                          }} 
                        />
                      </div>
                    )}
                    
                    {isLastStep && (
                      <div className="flex flex-col gap-3 mt-4">
                        {step.choices.map((choice, idx) => (
                          <button
                            key={idx}
                            className="w-full px-6 py-3 rounded-lg text-left transition-all duration-200 bg-[#F4F6FF] hover:bg-[#6172F3] text-[#2D3648] hover:text-white font-medium"
                            onClick={() => handleChoice(choice.nextStep)}
                          >
                            {choice.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DecisionTree;
