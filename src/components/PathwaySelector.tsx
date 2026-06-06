import React from "react";
import { Pathway } from "@/types/evaluation";
import { User, Briefcase, GraduationCap } from "lucide-react";

interface PathwaySelectorProps {
  onSelect: (pathway: Pathway) => void;
}

const pathways = [
  {
    id: "personal" as Pathway,
    icon: User,
    title: "Usage personnel",
    description: "Curiosité, veille, productivité personnelle",
    detail: "Parcours allégé — les critères réglementaires sont informatifs mais non éliminatoires.",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    iconColor: "text-blue-600",
  },
  {
    id: "professional" as Pathway,
    icon: Briefcase,
    title: "Usage professionnel",
    description: "Préparation de cours, correction, génération de supports",
    detail: "Parcours intermédiaire — RGPD souhaitable, pas de branche pédagogique élèves.",
    color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    iconColor: "text-emerald-600",
  },
  {
    id: "students" as Pathway,
    icon: GraduationCap,
    title: "Usage avec des élèves",
    description: "En classe, en autonomie, en travail collaboratif",
    detail: "Parcours complet — RGPD éliminatoire, seuil 4ème, accessibilité obligatoire, posture de l'élève.",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    iconColor: "text-purple-600",
  },
];

const PathwaySelector: React.FC<PathwaySelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-[#2D3648] text-center mb-2">
        Dans quel cadre souhaitez-vous utiliser cet outil ?
      </h2>
      <p className="text-sm text-gray-500 text-center mb-8">
        Le niveau d'exigence sera adapté à votre contexte d'usage.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pathways.map((pw) => {
          const Icon = pw.icon;
          return (
            <button
              key={pw.id}
              onClick={() => onSelect(pw.id)}
              className={`flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all duration-200 ${pw.color} hover:shadow-md`}
            >
              <div className={`mb-4 p-3 rounded-full bg-white shadow-sm ${pw.iconColor}`}>
                <Icon size={28} />
              </div>
              <h3 className="font-semibold text-[#2D3648] text-lg mb-1">
                {pw.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {pw.description}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {pw.detail}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PathwaySelector;
