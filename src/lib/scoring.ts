import {
  Pathway,
  ComplianceLevel,
  ToolInfo,
  CriterionResponse,
  DimensionResult,
  HistoryEntry,
  EvaluationSummary,
  EvaluationExport,
  Step,
  Choice,
} from "@/types/evaluation";

const DIMENSION_LABELS: Record<string, string> = {
  compliance: "Conformité",
  utility: "Utilité",
  usability: "Utilisabilité",
  acceptability: "Acceptabilité",
};

function scoreFromLevel(level: ComplianceLevel): number {
  switch (level) {
    case "compliant":
      return 2;
    case "partial":
      return 1;
    case "non-compliant":
      return 0;
  }
}

export function computeDimension(
  criteria: CriterionResponse[],
  dimensionKey: string
): DimensionResult {
  const maxScore = criteria.length * 2;
  const score = criteria.reduce(
    (sum, c) => sum + scoreFromLevel(c.response),
    0
  );
  return {
    label: DIMENSION_LABELS[dimensionKey] || dimensionKey,
    score,
    maxScore,
    criteria,
  };
}

export function buildCriterionResponse(
  step: Step,
  choice: Choice
): CriterionResponse | null {
  if (!choice.complianceLevel) return null;
  if (step.isAction) return null;
  if (["0", "success", "reject", "reconsider", "final-reject"].includes(step.id))
    return null;

  return {
    id: step.id,
    question: step.question,
    response: choice.complianceLevel,
    responseText: choice.text,
    isEliminating: choice.isEliminating || false,
    warning: choice.warning,
  };
}

export function buildHistoryEntry(
  step: Step,
  choice: Choice
): HistoryEntry {
  return {
    stepId: step.id,
    question: step.question,
    choiceText: choice.text,
    timestamp: new Date().toISOString(),
  };
}

export function buildEvaluationExport(
  tool: ToolInfo,
  pathway: Pathway,
  criteriaByDimension: Record<string, CriterionResponse[]>,
  history: HistoryEntry[],
  passed: boolean
): EvaluationExport {
  const dimensions = {
    compliance: computeDimension(
      criteriaByDimension["compliance"] || [],
      "compliance"
    ),
    utility: computeDimension(
      criteriaByDimension["utility"] || [],
      "utility"
    ),
    usability: computeDimension(
      criteriaByDimension["usability"] || [],
      "usability"
    ),
    acceptability: computeDimension(
      criteriaByDimension["acceptability"] || [],
      "acceptability"
    ),
  };

  const allCriteria = Object.values(dimensions).flatMap((d) => d.criteria);
  const totalScore = Object.values(dimensions).reduce(
    (sum, d) => sum + d.score,
    0
  );
  const maxScore = Object.values(dimensions).reduce(
    (sum, d) => sum + d.maxScore,
    0
  );
  const warnings = allCriteria
    .filter((c) => c.warning)
    .map((c) => c.warning!);
  const eliminatingCriteria = allCriteria
    .filter((c) => c.isEliminating && c.response === "non-compliant")
    .map((c) => c.question);

  const summary: EvaluationSummary = {
    totalScore,
    maxScore,
    passed,
    warnings,
    eliminatingCriteria,
  };

  return {
    version: "2.0",
    exportedAt: new Date().toISOString(),
    tool,
    pathway,
    dimensions,
    summary,
    history,
  };
}

export function downloadJSON(evaluation: EvaluationExport): void {
  const filename = evaluation.tool.name
    ? `evaluation_${evaluation.tool.name.replace(/\s+/g, "_")}.json`
    : "evaluation_outil_ia.json";

  const blob = new Blob([JSON.stringify(evaluation, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadJSON(file: File): Promise<EvaluationExport> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.version || !data.dimensions || !data.summary) {
          reject(new Error("Format de fichier invalide"));
          return;
        }
        resolve(data as EvaluationExport);
      } catch {
        reject(new Error("Fichier JSON invalide"));
      }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsText(file);
  });
}
