import React, { useState, useRef } from "react";
import { EvaluationExport } from "@/types/evaluation";
import { loadJSON } from "@/lib/scoring";
import {
  compareEvaluations,
  getComplianceIcon,
  getComplianceLabel,
  ComparisonResult,
  DimensionComparison,
} from "@/lib/comparison";
import { Link } from "react-router-dom";
import {
  Upload,
  ArrowLeftRight,
  ArrowLeft,
  Shield,
  Target,
  MousePointer,
  CheckCircle,
  AlertTriangle,
  Trophy,
  X,
} from "lucide-react";

const DIMENSION_CONFIG: Record<
  string,
  { icon: React.FC<{ size?: number; className?: string }>; label: string; color: string }
> = {
  compliance: { icon: Shield, label: "Conformité", color: "text-blue-700" },
  utility: { icon: Target, label: "Utilité", color: "text-emerald-700" },
  usability: { icon: MousePointer, label: "Utilisabilité", color: "text-orange-700" },
  acceptability: { icon: CheckCircle, label: "Acceptabilité", color: "text-purple-700" },
};

function DimensionRow({ dimKey, dim }: { dimKey: string; dim: DimensionComparison }) {
  const [expanded, setExpanded] = useState(false);
  const config = DIMENSION_CONFIG[dimKey];
  if (!config) return null;
  const Icon = config.icon;
  const pctA = dim.maxScoreA > 0 ? dim.scoreA / dim.maxScoreA : 0;
  const pctB = dim.maxScoreB > 0 ? dim.scoreB / dim.maxScoreB : 0;
  const winnerA = pctA > pctB;
  const winnerB = pctB > pctA;

  return (
    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <Icon size={18} className={config.color} />
        <span className={`font-semibold text-sm ${config.color} flex-1`}>{config.label}</span>
        <div className="flex items-center gap-6">
          <span className={`text-sm font-bold ${winnerA ? "text-green-600" : "text-gray-600"}`}>
            {dim.scoreA}/{dim.maxScoreA}
            {winnerA && " ★"}
          </span>
          <span className="text-gray-300">vs</span>
          <span className={`text-sm font-bold ${winnerB ? "text-green-600" : "text-gray-600"}`}>
            {dim.scoreB}/{dim.maxScoreB}
            {winnerB && " ★"}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#E5E7EB] bg-gray-50 p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase">
                <th className="text-left pb-2 font-medium">Critère</th>
                <th className="text-center pb-2 font-medium w-28">Outil A</th>
                <th className="text-center pb-2 font-medium w-28">Outil B</th>
              </tr>
            </thead>
            <tbody>
              {dim.criteria.map((c) => (
                <tr
                  key={c.id}
                  className={`border-t border-gray-200 ${c.isDifferent ? "bg-amber-50" : ""}`}
                >
                  <td className="py-2 pr-4 text-gray-700">{c.question}</td>
                  <td className="py-2 text-center">
                    <span title={c.toolA.responseText}>
                      {getComplianceIcon(c.toolA.response)} {getComplianceLabel(c.toolA.response)}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <span title={c.toolB.responseText}>
                      {getComplianceIcon(c.toolB.response)} {getComplianceLabel(c.toolB.response)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const ComparisonView: React.FC = () => {
  const [evalA, setEvalA] = useState<EvaluationExport | null>(null);
  const [evalB, setEvalB] = useState<EvaluationExport | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRefA = useRef<HTMLInputElement>(null);
  const fileRefB = useRef<HTMLInputElement>(null);

  const handleFile = async (
    file: File,
    setter: React.Dispatch<React.SetStateAction<EvaluationExport | null>>,
    slot: "A" | "B"
  ) => {
    setError(null);
    try {
      const data = await loadJSON(file);
      setter(data);
      if (slot === "A" && evalB) {
        setComparison(compareEvaluations(data, evalB));
      } else if (slot === "B" && evalA) {
        setComparison(compareEvaluations(evalA, data));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    }
  };

  const reset = () => {
    setEvalA(null);
    setEvalB(null);
    setComparison(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#005E6E] hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Retour à l'évaluation
        </Link>
        <h1 className="text-3xl font-bold text-[#005E6E] mb-2">
          Comparer deux outils
        </h1>
        <p className="text-gray-500">
          Importez les fichiers JSON de deux évaluations pour les comparer
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Zone d'import */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Outil A */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            evalA ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-[#005E6E]"
          }`}
        >
          {evalA ? (
            <div>
              <Trophy className="mx-auto text-green-500 mb-2" size={32} />
              <p className="font-semibold text-gray-800">{evalA.tool.name || "Outil A"}</p>
              <p className="text-sm text-gray-500 mt-1">
                Score : {evalA.summary.totalScore}/{evalA.summary.maxScore}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {evalA.summary.passed ? "✅ Validé" : "❌ Non validé"}
              </p>
              <button
                onClick={() => {
                  setEvalA(null);
                  setComparison(null);
                }}
                className="mt-3 text-xs text-red-500 hover:underline"
              >
                Retirer
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <Upload className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="font-medium text-gray-600">Outil A</p>
              <p className="text-sm text-gray-400 mt-1">Cliquez pour importer un JSON</p>
              <input
                ref={fileRefA}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file, setEvalA, "A");
                }}
              />
            </label>
          )}
        </div>

        {/* Outil B */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            evalB ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-[#005E6E]"
          }`}
        >
          {evalB ? (
            <div>
              <Trophy className="mx-auto text-green-500 mb-2" size={32} />
              <p className="font-semibold text-gray-800">{evalB.tool.name || "Outil B"}</p>
              <p className="text-sm text-gray-500 mt-1">
                Score : {evalB.summary.totalScore}/{evalB.summary.maxScore}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {evalB.summary.passed ? "✅ Validé" : "❌ Non validé"}
              </p>
              <button
                onClick={() => {
                  setEvalB(null);
                  setComparison(null);
                }}
                className="mt-3 text-xs text-red-500 hover:underline"
              >
                Retirer
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <Upload className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="font-medium text-gray-600">Outil B</p>
              <p className="text-sm text-gray-400 mt-1">Cliquez pour importer un JSON</p>
              <input
                ref={fileRefB}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file, setEvalB, "B");
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* Résultat de la comparaison */}
      {comparison && (
        <div className="animate-fade-in">
          {/* Avertissement parcours différents */}
          {!comparison.samePathway && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              Les deux outils ont été évalués sur des parcours différents ({comparison.pathwayA} vs {comparison.pathwayB}). Les scores maximaux diffèrent — les pourcentages sont utilisés pour comparer.
            </div>
          )}

          {/* Score global */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm mb-6">
            <div className="bg-[#005E6E] text-white p-4 flex items-center justify-center gap-3">
              <ArrowLeftRight size={20} />
              <h2 className="text-lg font-bold">Comparaison</h2>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <p className="font-bold text-lg text-gray-800">{comparison.toolA}</p>
                  <p className="text-xs text-gray-400">{comparison.pathwayA}</p>
                  <p className={`text-3xl font-bold mt-2 ${
                    (comparison.maxScoreA > 0 ? comparison.totalScoreA / comparison.maxScoreA : 0) >=
                    (comparison.maxScoreB > 0 ? comparison.totalScoreB / comparison.maxScoreB : 0)
                      ? "text-green-600" : "text-gray-500"
                  }`}>
                    {comparison.totalScoreA}
                  </p>
                  <p className="text-xs text-gray-400">/ {comparison.maxScoreA}</p>
                  <p className="text-xs mt-1">{comparison.passedA ? "✅ Validé" : "❌ Non validé"}</p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl text-gray-300 font-light">vs</span>
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">{comparison.toolB}</p>
                  <p className="text-xs text-gray-400">{comparison.pathwayB}</p>
                  <p className={`text-3xl font-bold mt-2 ${
                    (comparison.maxScoreB > 0 ? comparison.totalScoreB / comparison.maxScoreB : 0) >=
                    (comparison.maxScoreA > 0 ? comparison.totalScoreA / comparison.maxScoreA : 0)
                      ? "text-green-600" : "text-gray-500"
                  }`}>
                    {comparison.totalScoreB}
                  </p>
                  <p className="text-xs text-gray-400">/ {comparison.maxScoreB}</p>
                  <p className="text-xs mt-1">{comparison.passedB ? "✅ Validé" : "❌ Non validé"}</p>
                </div>
              </div>

              {/* Points forts */}
              {(comparison.strengthsA.length > 0 || comparison.strengthsB.length > 0) && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Points forts de {comparison.toolA}</p>
                    {comparison.strengthsA.length > 0 ? (
                      <ul className="text-xs text-green-600 space-y-0.5">
                        {comparison.strengthsA.map((s, i) => (
                          <li key={i}>+ {s}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">Aucun avantage</p>
                    )}
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Points forts de {comparison.toolB}</p>
                    {comparison.strengthsB.length > 0 ? (
                      <ul className="text-xs text-green-600 space-y-0.5">
                        {comparison.strengthsB.map((s, i) => (
                          <li key={i}>+ {s}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">Aucun avantage</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Détail par dimension */}
          <div className="space-y-3">
            {(Object.keys(DIMENSION_CONFIG) as string[]).map((key) => {
              const dim = comparison.dimensions[key as keyof typeof comparison.dimensions];
              if (!dim) return null;
              return <DimensionRow key={key} dimKey={key} dim={dim} />;
            })}
          </div>

          {/* Avertissements */}
          {(comparison.warningsA.length > 0 || comparison.warningsB.length > 0) && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Vigilance — {comparison.toolA}
                </h4>
                <ul className="text-xs text-amber-600 space-y-1">
                  {comparison.warningsA.map((w, i) => (
                    <li key={i}>⚠ {w}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Vigilance — {comparison.toolB}
                </h4>
                <ul className="text-xs text-amber-600 space-y-1">
                  {comparison.warningsB.map((w, i) => (
                    <li key={i}>⚠ {w}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Reset */}
          <div className="text-center mt-8">
            <button
              onClick={reset}
              className="text-sm text-[#005E6E] hover:underline"
            >
              Recommencer la comparaison
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
