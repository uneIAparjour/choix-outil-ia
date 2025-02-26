
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Info, Trophy, Search, X } from "lucide-react";
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

  // Get the current step details
  const getCurrentStep = (): Step | undefined => {
    const currentStepId = currentPath[currentPath.length - 1];
    return decisionTreeData.find((step) => step.id === currentStepId);
  };

  const handleChoice = (nextStep: string) => {
    // Check if we're going back to a previous step (like "Retour à Étape X")
    if (nextStep.startsWith("Retour")) {
      const stepMatch = nextStep.match(/Étape (\d+\.?\d*)/);
      if (stepMatch && stepMatch[1]) {
        const targetStep = stepMatch[1];
        
        // Find the appropriate step ID for "Étape X"
        const foundStep = decisionTreeData.find(
          (step) => step.id === targetStep
        );
        
        if (foundStep) {
          // Collapse all expanded steps
          setExpandedSteps(new Set([foundStep.id]));
          
          // Update the current path
          setCurrentPath([foundStep.id]);
          
          // Scroll to the current step
          setTimeout(() => scrollToLatestStep(), 100);
          return;
        }
      }
    }

    // Check if we're going to a conclusion step
    const nextStepData = decisionTreeData.find((step) => step.id === nextStep);
    if (nextStepData && (nextStep === "17" || nextStep === "19")) {
      if (nextStep === "17") {
        setShowConfetti(true);
        
        // Generate confetti particles
        if (treeRef.current) {
          createConfetti(treeRef.current);
        }
        
        // Hide confetti after a few seconds
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // Collapse previous steps
      const newExpandedSteps = new Set<string>();
      newExpandedSteps.add(nextStep);
      setExpandedSteps(newExpandedSteps);
      
      // Update path
      setCurrentPath([...currentPath, nextStep]);
      
      // Scroll to the conclusion
      setTimeout(() => scrollToLatestStep(), 100);
      return;
    }

    // If the user chose to restart at step 1, clear everything and start fresh
    if (nextStep === "1" && currentPath.includes("17") || currentPath.includes("19")) {
      resetTree();
      return;
    }

    // For standard transitions
    setCurrentPath([...currentPath, nextStep]);
    
    // Keep only the latest step expanded
    const newExpandedSteps = new Set<string>();
    newExpandedSteps.add(nextStep);
    setExpandedSteps(newExpandedSteps);
    
    // Scroll to the new step
    setTimeout(() => scrollToLatestStep(), 100);
  };

  // Handle click on a previous step to jump to it
  const jumpToStep = (index: number) => {
    if (index >= currentPath.length - 1) return; // Don't do anything if clicking on the current step
    
    // Get the step ID we want to jump to
    const targetStepId = currentPath[index];
    
    // Update the current path to truncate at the target step
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    
    // Only expand the target step
    const newExpandedSteps = new Set<string>();
    newExpandedSteps.add(targetStepId);
    setExpandedSteps(newExpandedSteps);
    
    // Scroll to the step
    setTimeout(() => {
      const targetStep = document.getElementById(`step-${targetStepId}`);
      if (targetStep) {
        targetStep.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const toggleExpand = (stepId: string) => {
    const newExpandedSteps = new Set(expandedSteps);
    
    if (newExpandedSteps.has(stepId)) {
      newExpandedSteps.delete(stepId);
    } else {
      newExpandedSteps.add(stepId);
    }
    
    setExpandedSteps(newExpandedSteps);
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
      
      // Remove confetti after animation
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

  // Render the sequential steps
  return (
    <div className="max-w-3xl mx-auto py-8 px-4" ref={treeRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-flatdark">
          Aide au choix d'une application utilisant l'IA générative
        </h1>
        <button
          onClick={resetTree}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-md bg-flatdark text-flatwhite hover:bg-opacity-90 transition-all"
        >
          <X size={18} /> Réinitialiser
        </button>
      </div>

      <div className="space-y-4">
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
              className={`decision-brick ${isLastStep ? "active" : "collapsed"} ${
                isConclusion && stepId === "17" ? "success" : ""
              }`}
              onClick={() => {
                if (!isLastStep) {
                  // If clicking on a previous step, jump to it
                  jumpToStep(index);
                }
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  {isConclusion ? (
                    <span className="flex items-center gap-2">
                      {stepId === "17" && <Trophy className="text-flatsuccess" size={24} />}
                      {stepId === "19" && <Search className="text-flatdark" size={24} />}
                      Conclusion
                    </span>
                  ) : (
                    <>Étape {stepId}</>
                  )}
                </h3>
                {!isLastStep && (
                  <button className="text-flatprimary">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>
              
              {(isExpanded || isLastStep) && (
                <div className="mt-4 animate-fade-in">
                  <p className="text-flatdark mb-4 font-medium">{step.question}</p>
                  
                  {step.infoTooltip && (
                    <div className="info-bubble">
                      <div className="flex items-start gap-2">
                        <Info size={20} className="text-flatsecondary mt-1 flex-shrink-0" />
                        <div dangerouslySetInnerHTML={{ __html: step.infoTooltip.replace(/\n/g, '<br>') }} />
                      </div>
                    </div>
                  )}
                  
                  {isLastStep && !step.isAction && (
                    <div className="flex flex-col gap-2 mt-4">
                      {step.choices.map((choice, idx) => (
                        <button
                          key={idx}
                          className="choice-button"
                          onClick={() => handleChoice(choice.nextStep)}
                        >
                          {choice.text}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {isLastStep && step.isAction && (
                    <div className="mt-4 px-4 py-3 bg-flatlight rounded-md">
                      <p className="text-flatdark font-medium">{step.question}</p>
                      <div className="flex flex-col gap-2 mt-4">
                        {step.choices.map((choice, idx) => (
                          <button
                            key={idx}
                            className="choice-button"
                            onClick={() => handleChoice(choice.nextStep)}
                          >
                            {choice.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DecisionTree;
