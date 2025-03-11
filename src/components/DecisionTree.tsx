
import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Info, Trophy, Search, RotateCcw, Check, X } from "lucide-react";
import { decisionTreeData } from "@/data/decisionTreeData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface StepOutcome {
  stepId: string;
  choiceText: string;
  isPositive: boolean;
}

const DecisionTree: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(["1"]);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(["1"]));
  const [showConfetti, setShowConfetti] = useState(false);
  const [stepOutcomes, setStepOutcomes] = useState<StepOutcome[]>([]);
  const treeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getCurrentStep = (): Step | undefined => {
    const currentStepId = currentPath[currentPath.length - 1];
    return decisionTreeData.find((step) => step.id === currentStepId);
  };

  const isPositiveChoice = (stepId: string, choiceText: string): boolean => {
    // Default rules
    if (choiceText.startsWith("Oui") || choiceText.startsWith("Je ne sais pas") || choiceText.startsWith("J'ai suivi cette étape")) {
      // Special case exceptions
      if (stepId === "3.2" && choiceText === "Je ne sais toujours pas") {
        return false;
      } else if (stepId === "8" && choiceText === "Je ne sais pas") {
        return false;
      } else if (stepId === "8.1" && choiceText === "Je ne sais toujours pas") {
        return false;
      } else if (stepId === "12" && choiceText === "Non") {
        return false;
      } else {
        return true;
      }
    } else if (stepId === "1" && choiceText === "Je commence l'analyse de l'application") {
      return true;
    } else if (stepId === "18" && choiceText === "J'ai cherché et j'ai trouvé un autre outil d'IA générative qui me semble intéressant") {
      return true;
    } else if (stepId === "18" && choiceText === "J'ai cherché et n'ai pas trouvé d'autre outil d'IA générative qui me semble intéressant") {
      return false;
    } else if (stepId === "4" && (choiceText === "Non, vérification effectuée avant le 02/08/2025")) {
      return true;
    } else if (stepId === "6.1" && choiceText === "J'ai trouvé / reçu des informations claires") {
      return true;
    } else if (stepId === "8" && choiceText === "Non") {
      return true;
    } else if (stepId === "8.1" && choiceText === "L'application n'utilise pas de main-d'œuvre peu payée voire exploitée pour l'entraînement ou le fonctionnement de l'IA") {
      return true;
    } else if (stepId === "12" && choiceText === "Je l'utiliserai seule / seul") {
      return true;
    } else if (stepId === "17" && choiceText.startsWith("Bravo ! Vous avez trouvé l'outil qui vous convient")) {
      return true;
    } else if (stepId === "16" && choiceText === "Oui (Mes valeurs personnelles, mes valeurs professionnelles et mon cadre d'utilisation me permettent de laisser de côté un critère de choix)") {
      return true;
    } else if (stepId === "16" && choiceText === "Non (Mes valeurs personnelles, mes valeurs professionnelles et mon cadre d'utilisation ne me permettent pas de laisser de côté un ou plusieurs critères de choix)") {
      return false;
    } else {
      return false;
    }
  };

  const handleChoice = (nextStep: string, choiceText: string) => {
    const currentStep = getCurrentStep();
    
    if (currentStep) {
      // Record outcome for this step
      setStepOutcomes(prev => [
        ...prev,
        {
          stepId: currentStep.id,
          choiceText,
          isPositive: isPositiveChoice(currentStep.id, choiceText)
        }
      ]);
    }

    // Check if we need to generate a summary sheet
    const shouldShowSummary = 
      (currentStep?.id === "18" && choiceText === "J'ai cherché et j'ai trouvé un autre outil d'IA générative qui me semble intéressant") ||
      currentStep?.id === "16";

    if (shouldShowSummary) {
      setShowConfetti(true);
      
      if (treeRef.current) {
        createConfetti(treeRef.current);
      }
      
      setTimeout(() => setShowConfetti(false), 3000);
    }

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
    
    // Adjust step outcomes as well
    setStepOutcomes(prev => prev.slice(0, index));
    
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
    const colors = ["#005E6E", "#30F8FA", "#F2FCE2", "#D6BCFA"];
    
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
    setStepOutcomes([]);
    
    toast({
      title: "Arbre de décision réinitialisé",
      description: "Vous pouvez recommencer votre parcours",
    });
    
    setTimeout(() => scrollToLatestStep(), 100);
  };

  const getStepOutcome = (stepId: string): boolean | undefined => {
    const outcome = stepOutcomes.find(o => o.stepId === stepId);
    return outcome ? outcome.isPositive : undefined;
  };

  const renderPathSummary = () => {
    const lastStepId = currentPath[currentPath.length - 1];
    const hasReachedConclusion = ["17", "19"].includes(lastStepId);
    const shouldShowInterimSummary = stepOutcomes.some(
      outcome => 
        (outcome.stepId === "18" && outcome.choiceText === "J'ai cherché et j'ai trouvé un autre outil d'IA générative qui me semble intéressant") ||
        outcome.stepId === "16"
    );

    if (!hasReachedConclusion && !shouldShowInterimSummary) {
      return null;
    }

    const allSteps = decisionTreeData.filter(step => !step.isAction);
    const visitedStepsMap = new Map(stepOutcomes.map(o => [o.stepId, o.isPositive]));

    return (
      <div className="mt-12 p-6 bg-[#F8F8FA] rounded-xl border border-[#E5E7EB] animate-fade-in">
        <h3 className="text-lg font-semibold text-[#005E6E] mb-4">
          {shouldShowInterimSummary && !hasReachedConclusion 
            ? "Feuille bilan de votre parcours" 
            : "Résumé de votre parcours"}
        </h3>
        <div className="space-y-3">
          {allSteps.map(step => {
            const isVisited = visitedStepsMap.has(step.id);
            const isPositive = visitedStepsMap.get(step.id);
            const isLastStep = step.id === lastStepId;
            const showStep = isVisited || ["17", "19"].includes(step.id) ? isLastStep : true;

            if (!showStep) return null;

            return (
              <div key={step.id} className="flex items-start gap-3">
                {isVisited ? (
                  isPositive ? (
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  )
                ) : (
                  <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                )}
                <p className="text-sm text-gray-700">{step.question}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen bg-white font-marianne" ref={treeRef}>
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#005E6E] leading-tight mb-6">
          Aide au choix d'une application<br/>utilisant l'IA générative
        </h1>
        <div className="w-20 h-1 bg-[#005E6E] rounded-full mb-6"></div>
        <button
          onClick={resetTree}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EEF1FF] hover:bg-[#E2E7FF] text-[#005E6E] transition-colors shadow-sm"
          title="Réinitialiser le parcours"
        >
          <RotateCcw size={18} />
          <span className="text-sm font-medium">Recommencer</span>
        </button>
      </div>

      <TooltipProvider>
        <div className="space-y-6">
          {currentPath.map((stepId, index) => {
            const step = decisionTreeData.find((s) => s.id === stepId);
            if (!step) return null;

            const isExpanded = expandedSteps.has(stepId);
            const isLastStep = index === currentPath.length - 1;
            const isConclusion = stepId === "17" || stepId === "19";
            const stepOutcome = getStepOutcome(stepId);

            return (
              <div
                key={stepId}
                id={`step-${stepId}`}
                className={`rounded-xl border ${
                  isLastStep 
                    ? "border-[#005E6E] bg-[#F8F8FA] shadow-lg shadow-[#005E6E]/5" 
                    : "border-[#E5E7EB] bg-[#F8F8FA]"
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
                    <div className="flex items-start gap-2">
                      {!isLastStep && stepOutcome !== undefined && (
                        <div className="mt-1 flex-shrink-0">
                          {stepOutcome ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
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
                      {step.infoTooltip && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="mt-1 p-1 rounded-full hover:bg-[#005E6E]/20 text-[#005E6E] transition-colors">
                              <Info size={16} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent 
                            className="max-w-sm p-4 text-sm bg-white/95 border border-gray-200 shadow-lg leading-relaxed opacity-95" 
                            side="top" 
                            sideOffset={5}
                            align="center"
                          >
                            <div dangerouslySetInnerHTML={{ 
                              __html: step.infoTooltip.replace(/\n/g, '<br>') 
                            }} />
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    {!isLastStep && (
                      <button className="text-[#005E6E] p-1 hover:bg-[#005E6E]/20 rounded-full transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    )}
                  </div>
                  
                  {(isExpanded || isLastStep) && (
                    <div className="mt-6 animate-fade-in">
                      {isLastStep && (
                        <div className="flex flex-col gap-3 mt-4">
                          {step.choices.map((choice, idx) => (
                            <button
                              key={idx}
                              className="w-full px-6 py-3 rounded-lg text-left transition-all duration-200 bg-[#005E6E] hover:bg-[#005E6E]/80 text-white font-medium text-center"
                              onClick={() => handleChoice(choice.nextStep, choice.text)}
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
          {renderPathSummary()}
        </div>
      </TooltipProvider>

      <footer className="mt-16 py-6 border-t border-[#E5E7EB] text-center">
        <p className="mb-4 text-sm text-[#6B7280]">
          <em>WIP par <a href="mailto:uneIAparjour@gmail.com" className="text-[#005E6E] hover:underline">BF</a></em>
        </p>
        
        <div className="text-sm text-[#6B7280]">
          <p className="font-medium mb-2">Liens utiles</p>
          <ul className="space-y-1">
            <li>
              <a href="https://www.reseau-canope.fr/ia-en-classe" target="_blank" rel="noopener noreferrer" className="text-[#005E6E] hover:underline">
                Formations et ressources sur les IA génératives
              </a>
            </li>
            <li>
              <a href="https://www.uneiaparjour.fr/" target="_blank" rel="noopener noreferrer" className="text-[#005E6E] hover:underline">
                Découvrir des outils d'IA génératives
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default DecisionTree;
