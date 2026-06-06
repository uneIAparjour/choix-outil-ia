import { EvaluationExport, ComplianceLevel } from "@/types/evaluation";

export interface CriterionComparison {
  id: string;
  question: string;
  toolA: {
    response: ComplianceLevel;
    responseText: string;
    warning?: string;
  };
  toolB: {
    response: ComplianceLevel;
    responseText: string;
    warning?: string;
  };
  isDifferent: boolean;
}

export interface DimensionComparison {
  label: string;
  scoreA: number;
  scoreB: number;
  maxScore: number;
  criteria: CriterionComparison[];
}

export interface ComparisonResult {
  toolA: string;
  toolB: string;
  pathwayA: string;
  pathwayB: string;
  exportedAtA: string;
  exportedAtB: string;
  dimensions: {
    compliance: DimensionComparison;
    utility: DimensionComparison;
    usability: DimensionComparison;
    acceptability: DimensionComparison;
  };
  totalScoreA: number;
  totalScoreB: number;
  maxScore: number;
  passedA: boolean;
  passedB: boolean;
  strengthsA: string[];
  strengthsB: string[];
  warningsA: string[];
  warningsB: string[];
}

const PATHWAY_LABELS: Record<string, string> = {
  personal: "Usage personnel",
  professional: "Usage professionnel",
  students: "Usage avec élèves",
};

function compareDimension(
  key: string,
  evalA: EvaluationExport,
  evalB: EvaluationExport
): DimensionComparison {
  const dimA = evalA.dimensions[key as keyof typeof evalA.dimensions];
  const dimB = evalB.dimensions[key as keyof typeof evalB.dimensions];

  const allIds = new Set([
    ...dimA.criteria.map((c) => c.id),
    ...dimB.criteria.map((c) => c.id),
  ]);

  const criteria: CriterionComparison[] = [];

  allIds.forEach((id) => {
    const criterionA = dimA.criteria.find((c) => c.id === id);
    const criterionB = dimB.criteria.find((c) => c.id === id);

    const defaultResponse = {
      response: "non-compliant" as ComplianceLevel,
      responseText: "Non évalué",
    };

    criteria.push({
      id,
      question: criterionA?.question || criterionB?.question || id,
      toolA: criterionA
        ? {
            response: criterionA.response,
            responseText: criterionA.responseText,
            warning: criterionA.warning,
          }
        : defaultResponse,
      toolB: criterionB
        ? {
            response: criterionB.response,
            responseText: criterionB.responseText,
            warning: criterionB.warning,
          }
        : defaultResponse,
      isDifferent: criterionA?.response !== criterionB?.response,
    });
  });

  const maxScore = Math.max(dimA.maxScore, dimB.maxScore);

  return {
    label: dimA.label || dimB.label,
    scoreA: dimA.score,
    scoreB: dimB.score,
    maxScore,
    criteria,
  };
}

function findStrengths(
  eval_: EvaluationExport,
  other: EvaluationExport
): string[] {
  const strengths: string[] = [];
  const dims = ["compliance", "utility", "usability", "acceptability"] as const;

  dims.forEach((key) => {
    const dim = eval_.dimensions[key];
    const otherDim = other.dimensions[key];
    if (dim.score > otherDim.score) {
      strengths.push(`${dim.label} (${dim.score}/${dim.maxScore} vs ${otherDim.score}/${otherDim.maxScore})`);
    }
  });

  return strengths;
}

export function compareEvaluations(
  evalA: EvaluationExport,
  evalB: EvaluationExport
): ComparisonResult {
  const dims = ["compliance", "utility", "usability", "acceptability"] as const;

  const dimensions = {} as ComparisonResult["dimensions"];
  dims.forEach((key) => {
    dimensions[key] = compareDimension(key, evalA, evalB);
  });

  return {
    toolA: evalA.tool.name || "Outil A",
    toolB: evalB.tool.name || "Outil B",
    pathwayA: PATHWAY_LABELS[evalA.pathway] || evalA.pathway,
    pathwayB: PATHWAY_LABELS[evalB.pathway] || evalB.pathway,
    exportedAtA: evalA.exportedAt,
    exportedAtB: evalB.exportedAt,
    dimensions,
    totalScoreA: evalA.summary.totalScore,
    totalScoreB: evalB.summary.totalScore,
    maxScore: evalA.summary.maxScore,
    passedA: evalA.summary.passed,
    passedB: evalB.summary.passed,
    strengthsA: findStrengths(evalA, evalB),
    strengthsB: findStrengths(evalB, evalA),
    warningsA: evalA.summary.warnings,
    warningsB: evalB.summary.warnings,
  };
}

export function getComplianceIcon(level: ComplianceLevel): string {
  switch (level) {
    case "compliant":
      return "✅";
    case "partial":
      return "⚠️";
    case "non-compliant":
      return "❌";
  }
}

export function getComplianceLabel(level: ComplianceLevel): string {
  switch (level) {
    case "compliant":
      return "Conforme";
    case "partial":
      return "Partiel";
    case "non-compliant":
      return "Non conforme";
  }
}
