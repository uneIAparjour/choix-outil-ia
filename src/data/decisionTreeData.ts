import { Step } from "@/types/evaluation";

export const decisionTreeData: Step[] = [
  // ═══════════════════════════════════════════
  // CHOIX DU PARCOURS
  // ═══════════════════════════════════════════
  {
    id: "0",
    dimension: "compliance",
    question: "Dans quel cadre souhaitez-vous utiliser cet outil ?",
    choices: [
      { text: "Usage personnel (curiosité, veille, productivité personnelle)", nextStep: "1", complianceLevel: "compliant" },
      { text: "Usage professionnel (productivité, rédaction, analyse, préparation de supports…)", nextStep: "1", complianceLevel: "compliant" },
      { text: "Usage avec des élèves (en classe, en autonomie, en travail collaboratif)", nextStep: "1", complianceLevel: "compliant" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  // ═══════════════════════════════════════════
  // SOUS-PARCOURS PROFESSIONNEL : CONTEXTE
  // ═══════════════════════════════════════════
  {
    id: "0.1",
    dimension: "compliance",
    question: "Dans quel cadre professionnel souhaitez-vous utiliser cet outil ?",
    choices: [
      { text: "Enseignant(e) — préparation de cours, évaluations, corrections", nextStep: "0.2", complianceLevel: "compliant" },
      { text: "Personnel Éducation nationale — tâches administratives (rédaction, synthèse, traduction…)", nextStep: "0.2", complianceLevel: "compliant" },
      { text: "Autre contexte professionnel (hors Éducation nationale)", nextStep: "0.2", complianceLevel: "compliant" }
    ],
    pathways: ["professional"]
  },

  // ═══════════════════════════════════════════
  // SOUS-PARCOURS : TEST OU USAGE RÉGULIER
  // ═══════════════════════════════════════════
  {
    id: "0.2",
    dimension: "compliance",
    question: "Quel type d'usage envisagez-vous ?",
    choices: [
      { text: "Je teste ou j'explore l'outil avant de décider", nextStep: "1", complianceLevel: "compliant" },
      { text: "Usage régulier ou qui va le devenir", nextStep: "1", complianceLevel: "compliant" }
    ],
    infoTooltip: "L'exploration permet de découvrir un outil avant de s'engager. Un usage régulier implique des obligations supplémentaires, notamment l'inscription au registre des traitements par le responsable de traitement.",
    pathways: ["professional", "students"]
  },

  {
    id: "1",
    dimension: "compliance",
    question: "J'ai cherché et trouvé une application d'IA générative qui pourrait m'accompagner.",
    choices: [
      { text: "Je commence l'analyse de l'application", nextStep: "2", complianceLevel: "compliant" }
    ],
    pathways: ["personal", "professional", "students"]
  },

  // ═══════════════════════════════════════════
  // DIMENSION 1 : CONFORMITÉ
  // ═══════════════════════════════════════════
  {
    id: "2",
    dimension: "compliance",
    question: "Est-ce que je peux accéder à l'application gratuitement pour la tester ?",
    choices: [
      { text: "Oui", nextStep: "3", complianceLevel: "compliant" },
      { text: "Non", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "3",
    dimension: "compliance",
    question: "L'application vous semble-t-elle respecter les critères du RGPD ? (À confirmer si utilisation régulière par la ou le Délégué à la Protection des Données)",
    choices: [
      { text: "Oui", nextStep: "3.3", complianceLevel: "compliant" },
      { text: "Partiellement ou avec des réserves", nextStep: "3.3", complianceLevel: "partial", warning: "Conformité RGPD partielle — vigilanc
