export type Pathway = "personal" | "professional" | "students";

export type ComplianceLevel = "compliant" | "partial" | "non-compliant";

export interface ToolInfo {
  name: string;
  url?: string;
  editor?: string;
}

export interface CriterionResponse {
  id: string;
  question: string;
  response: ComplianceLevel;
  responseText: string;
  isEliminating: boolean;
  warning?: string;
}

export interface DimensionResult {
  label: string;
  score: number;
  maxScore: number;
  criteria: CriterionResponse[];
}

export interface HistoryEntry {
  stepId: string;
  question: string;
  choiceText: string;
  timestamp: string;
}

export interface EvaluationSummary {
  totalScore: number;
  maxScore: number;
  passed: boolean;
  warnings: string[];
  eliminatingCriteria: string[];
}

export interface EvaluationExport {
  version: string;
  exportedAt: string;
  tool: ToolInfo;
  pathway: Pathway;
  dimensions: {
    compliance: DimensionResult;
    utility: DimensionResult;
    usability: DimensionResult;
    acceptability: DimensionResult;
  };
  summary: EvaluationSummary;
  history: HistoryEntry[];
}

export interface Choice {
  text: string;
  nextStep: string;
  complianceLevel?: ComplianceLevel;
  warning?: string;
  isEliminating?: boolean;
}

export interface Step {
  id: string;
  dimension: "compliance" | "utility" | "usability" | "acceptability";
  question: string;
  choices: Choice[];
  infoTooltip?: string;
  infoSources?: string[];
  isAction?: boolean;
  pathways: Pathway[];
}
