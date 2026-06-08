import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";
import { decisionTreeData } from "@/data/decisionTreeData";
import {
  Pathway,
  ToolInfo,
  Choice,
  Step,
  CriterionResponse,
  HistoryEntry,
  EvaluationExport,
} from "@/types/evaluation";
import {
  buildCriterionResponse,
  buildHistoryEntry,
  buildEvaluationExport,
  downloadJSON,
} from "@/lib/scoring";
import PathwaySelector from "./PathwaySelector";
import ToolInfoForm from "./ToolInfoForm";
import StepCard from "./StepCard";
import ResultSummary from "./ResultSummary";

const DecisionTree: React.FC = () => {
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [toolInfo, setToolInfo] = useState<ToolInfo>({ name: "", url: "", editor: "" });
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [criteriaByDimension, setCriteriaByDimension] = useState<Record<string, CriterionResponse[]>>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [choiceByStep, setChoiceByStep] = useState<Record<string, Choice>>({});
  const [evaluation, setEvaluation] = useState<EvaluationExport | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getStep = (id: string): Step | undefined => {
    return decisionTreeData.find((s) => s.id === id);
  };

  const scrollToStep = (stepId: string) => {
    setTimeout(() => {
      const el = document.getElementById(`step-${stepId}`);
      if (el) {
        const offset = el.getBoundingClientRect().top;
        window.parent.postMessage({ type: 'iframeScrollTo', offset }, '*');
      }
    }, 100);
  };

  const resolveNextStep = (step: Step, choice: Choice): string => {
    const next = choice.nextStep;

    // Aiguillage conformité : remplacer l'étape 3 (auto-évaluation RGPD)
    // par le parcours adapté au contexte
    if (next === "3") {
      const isEN = pathway === "students" ||
        (pathway === "professional" && choiceByStep["0.1"] &&
         !choiceByStep["0.1"].text.includes("Autre contexte professionnel"));
      const isTest = choiceByStep["0.2"]?.text?.includes("teste");

      if (isEN) {
        if (isTest) {
          return pathway === "students" ? "3.eleves-test" : "3.test-en";
        }
        return "3.registre";
      }
    }

    // RGPD non conforme + élèves : éliminatoire direct
    if (next === "3.1" && pathway === "students") {
      return "reject";
    }

    // Parcours personnel : fin après les biais (pas de valeurs pro)
    if (pathway === "personal" && next === "11") {
      return "success";
    }

    // Parcours professionnel : fin après valeurs collaboratives (pas de branche pédagogique)
    if (pathway === "professional" && next === "13") {
      return "success";
    }

    return next;
  };

  const startPathway = (selected: Pathway) => {
    setPathway(selected);
    let firstStep: string;
    switch (selected) {
      case "professional":
        firstStep = "0.1";
        break;
      case "students":
        firstStep = "0.2";
        break;
      default:
        firstStep = "1";
    }
    setCurrentPath([firstStep]);
    setExpandedSteps(new Set([firstStep]));
    scrollToStep(firstStep);
  };

  const handleChoice = (step: Step, choice: Choice) => {
    const historyEntry = buildHistoryEntry(step, choice);
    setHistory((prev) => [...prev, historyEntry]);

    setChoiceByStep((prev) => ({ ...prev, [step.id]: choice }));

    const criterion = buildCriterionResponse(step, choice);
    if (criterion) {
      setCriteriaByDimension((prev) => {
        const dim = step.dimension;
        const existing = prev[dim] || [];
        const filtered = existing.filter((c) => c.id !== criterion.id);
        return { ...prev, [dim]: [...filtered, criterion] };
      });
    }

    const nextStep = resolveNextStep(step, choice);

    if (nextStep === "export") {
      const passed = currentPath.includes("success");
      const evalExport = buildEvaluationExport(
        toolInfo,
        pathway!,
        criteriaByDimension,
        history,
        passed
      );
      setEvaluation(evalExport);
      downloadJSON(evalExport);
      return;
    }

    if (nextStep === "0") {
      resetTree();
      return;
    }

    if (["success", "reject", "final-reject", "reconsider"].includes(nextStep)) {
      const stepData = getStep(nextStep);
      if (stepData) {
        const newPath = [...currentPath, nextStep];
        setCurrentPath(newPath);
        setExpandedSteps(new Set([nextStep]));

        if (["success", "reject", "final-reject"].includes(nextStep)) {
          const passed = nextStep === "success";
          const evalExport = buildEvaluationExport(
            toolInfo,
            pathway!,
            criteriaByDimension,
            [...history, historyEntry],
            passed
          );
          setEvaluation(evalExport);
        }

        scrollToStep(nextStep);
        return;
      }
    }

    const nextStepData = getStep(nextStep);
    if (!nextStepData) return;

    const newPath = [...currentPath, nextStep];
    setCurrentPath(newPath);
    setExpandedSteps(new Set([nextStep]));
    scrollToStep(nextStep);
  };

  const jumpToStep = (index: number) => {
    if (index >= currentPath.length - 1) return;
    const targetStepId = currentPath[index];
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    setExpandedSteps(new Set([targetStepId]));
    setEvaluation(null);

    const removedSteps = currentPath.slice(index + 1);
    setHistory((prev) =>
      prev.filter((h) => !removedSteps.includes(h.stepId))
    );

    const newChoices = { ...choiceByStep };
    removedSteps.forEach((id) => delete newChoices[id]);
    setChoiceByStep(newChoices);

    const newCriteria = { ...criteriaByDimension };
    Object.keys(newCriteria).forEach((dim) => {
      newCriteria[dim] = newCriteria[dim].filter(
        (c) => !removedSteps.includes(c.id)
      );
    });
    setCriteriaByDimension(newCriteria);

    scrollToStep(targetStepId);
  };

  const resetTree = () => {
    setPathway(null);
    setCurrentPath([]);
    setExpandedSteps(new Set());
    setCriteriaByDimension({});
    setHistory([]);
    setChoiceByStep({});
    setEvaluation(null);
    setToolInfo({ name: "", url: "", editor: "" });

    toast({
      title: "Évaluation réinitialisée",
      description: "Vous pouvez recommencer avec un nouvel outil",
    });
  };

  const isConclusion = (stepId: string) =>
    ["success", "reject", "final-reject"].includes(stepId);

  return (
        <div className="max-w-4xl mx-auto py-12 px-4 bg-white font-marianne" ref={treeRef}>
        <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#005E6E] leading-tight mb-4">
          Aide au choix d'une application
          <br />
          utilisant des IA génératives
        </h1>
        <div className="w-20 h-1 bg-[#005E6E] rounded-full mb-4" />
        <p className="text-sm text-gray-500 mb-6 max-w-lg">
          Évaluez méthodiquement un outil d'IA selon 4 dimensions : conformité,
          utilité, utilisabilité et acceptabilité.
        </p>
        {pathway && (
          <button
            onClick={resetTree}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EEF1FF] hover:bg-[#E2E7FF] text-[#005E6E] transition-colors shadow-sm"
          >
            <RotateCcw size={18} />
            <span className="text-sm font-medium">Recommencer</span>
          </button>
        )}
      </div>

      {!pathway ? (
        <PathwaySelector onSelect={startPathway} />
      ) : (
        <>
          <ToolInfoForm toolInfo={toolInfo} onChange={setToolInfo} />

          <div className="space-y-6">
            {currentPath.map((stepId, index) => {
              const step = getStep(stepId);
              if (!step) return null;

              const isLast = index === currentPath.length - 1;
              const isExpanded = expandedSteps.has(stepId);
              const selectedChoice = choiceByStep[stepId];
              const outcomeLevel = selectedChoice?.complianceLevel;

              return (
                <StepCard
                  key={`${stepId}-${index}`}
                  step={step}
                  isExpanded={isExpanded}
                  isLastStep={isLast}
                  isConclusion={isConclusion(stepId)}
                  outcomeLevel={outcomeLevel}
                  onChoice={(choice) => handleChoice(step, choice)}
                  onJumpBack={() => jumpToStep(index)}
                />
              );
            })}
          </div>

          {evaluation && <ResultSummary evaluation={evaluation} />}
        </>
      )}

      <footer className="mt-16 py-6 border-t border-[#E5E7EB] text-center">
        <p className="mb-2 text-sm text-[#6B7280]">
          Version 2 — augmentée et inspirée en partie par le modèle d'évaluation de{" "}
          <a
            href="https://edutice.hal.science/edutice-00000154"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#005E6E] hover:underline"
          >
            Tricot et al. (2003)
          </a>{" "}
          — Utilité, Utilisabilité, Acceptabilité.
        </p>
        <p className="mb-2 text-sm text-[#6B7280]">
          <a
            href="https://github.com/uneIAparjour/choix-outil-ia/tree/main"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#005E6E] hover:underline"
          >
            Version 1
          </a>
          {" "}disponible sur GitHub.
        </p>
        <p className="mb-2 text-sm text-[#6B7280]">
          Réalisé par{" "}
          <a
            href="https://www.uneiaparjour.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#005E6E] hover:underline"
          >
            uneIAparjour.fr
          </a>
          . Mis à disposition sous{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/deed.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#005E6E] hover:underline"
          >
            licence CC BY
          </a>
          .
        </p>
        <p className="text-sm text-[#6B7280]">
          <a
            href="https://github.com/uneIAparjour/choix-outil-ia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#005E6E] hover:underline"
          >
            Code source
          </a>
          {" "}— Dernière mise à jour : juin 2026
        </p>
      </footer>
    </div>
  );
};

export default DecisionTree;
