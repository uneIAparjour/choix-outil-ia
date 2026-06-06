import { Step } from "@/types/evaluation";

export const decisionTreeData: Step[] = [
  // ═══════════════════════════════════════════
  // ÉTAPE 0 : CHOIX DU PARCOURS
  // ═══════════════════════════════════════════
  {
    id: "0",
    dimension: "compliance",
    question: "Dans quel cadre souhaitez-vous utiliser cet outil d'IA générative ?",
    choices: [
      { text: "Usage personnel (curiosité, veille, productivité personnelle)", nextStep: "1", complianceLevel: "compliant" },
      { text: "Usage professionnel enseignant (préparation de cours, correction, génération de supports)", nextStep: "1", complianceLevel: "compliant" },
      { text: "Usage avec des élèves (en classe, en autonomie, en travail collaboratif)", nextStep: "1", complianceLevel: "compliant" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "1",
    dimension: "compliance",
    question: "J'ai cherché et trouvé une application d'IA générative qui pourrait m'accompagner dans la réalisation d'une ou plusieurs tâches.",
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
    question: "Est-ce que je peux accéder à l'application gratuitement pour la tester (application gratuite, freemium ou avec période de test gratuit) ?",
    choices: [
      { text: "Oui", nextStep: "3", complianceLevel: "compliant" },
      { text: "Non", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "3",
    dimension: "compliance",
    question: "L'application respecte-t-elle les critères du RGPD (Règlement Général sur la Protection des Données) ?",
    choices: [
      { text: "Oui", nextStep: "3.3", complianceLevel: "compliant" },
      { text: "Partiellement ou avec des réserves", nextStep: "3.1", complianceLevel: "partial", warning: "Conformité RGPD partielle — vigilance requise" },
      { text: "Non", nextStep: "3.1", complianceLevel: "non-compliant" },
      { text: "Je ne sais pas", nextStep: "3.2" }
    ],
    infoTooltip: "Les 6 critères principaux RGPD :\n- Collecte des données seulement nécessaires\n- Transparence sur la collecte et l'utilisation des données\n- Facilité pour exercer son droit de consultation, rectification, suppression des données\n- Durée de conservation des données\n- Sécurisation des données\n- Démarche continue de vérification de la conformité RGPD",
    infoSources: ["https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on"],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "3.1",
    dimension: "compliance",
    question: "L'application n'est pas (pleinement) conforme au RGPD.",
    choices: [
      { text: "Mon usage est personnel, sans données sensibles — je continue avec vigilance", nextStep: "3.3", complianceLevel: "partial", warning: "Non conforme RGPD — usage personnel uniquement, aucune donnée élève" },
      { text: "Mon usage est professionnel (préparation) avec un compte dédié et attention aux données personnelles", nextStep: "3.3", complianceLevel: "partial", warning: "Non conforme RGPD — usage professionnel restreint, aucune donnée élève" },
      { text: "Je souhaite l'utiliser avec des élèves", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true, warning: "Non conforme RGPD — interdit avec des élèves" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "3.2",
    dimension: "compliance",
    question: "Consultez les 6 critères principaux du RGPD à l'aide de l'infobulle, puis réévaluez.",
    choices: [
      { text: "J'ai consulté les critères et je peux maintenant évaluer", nextStep: "3" },
      { text: "Je ne sais toujours pas", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    infoTooltip: "Les 6 critères principaux RGPD :\n- Collecte des données seulement nécessaires\n- Transparence sur la collecte et l'utilisation des données\n- Facilité pour exercer son droit de consultation, rectification, suppression des données\n- Durée de conservation des données\n- Sécurisation des données\n- Démarche continue de vérification de la conformité RGPD",
    infoSources: ["https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on"],
    isAction: true,
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "3.3",
    dimension: "compliance",
    question: "Les données sont-elles hébergées dans l'Union Européenne ? Sont-elles soumises à des législations extraterritoriales (Cloud Act, FISA) ?",
    choices: [
      { text: "Oui, hébergement UE sans législation extraterritoriale", nextStep: "4", complianceLevel: "compliant" },
      { text: "Hébergement UE mais éditeur soumis au Cloud Act", nextStep: "4", complianceLevel: "partial", warning: "Données potentiellement accessibles via Cloud Act" },
      { text: "Hébergement hors UE", nextStep: "4", complianceLevel: "partial", warning: "Hébergement hors UE — souveraineté des données non garantie" },
      { text: "Je ne sais pas", nextStep: "4", complianceLevel: "partial", warning: "Souveraineté des données non vérifiée" }
    ],
    infoTooltip: "La souveraineté des données va au-delà du RGPD. Le Cloud Act américain permet aux autorités US d'accéder aux données hébergées par des entreprises américaines, même si les serveurs sont en Europe.",
    infoSources: ["https://www.cnil.fr/fr/la-cnil-publie-une-faq-sur-les-transferts-de-donnees-vers-les-etats-unis"],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "4",
    dimension: "compliance",
    question: "L'entreprise qui propose l'application fait-elle mention de sa conformité à l'AI Act ?",
    choices: [
      { text: "Oui (déclaration, certifications, audit)", nextStep: "4.1", complianceLevel: "compliant" },
      { text: "Non, mais vérification effectuée avant le 02/08/2025", nextStep: "4.1", complianceLevel: "partial", warning: "AI Act non 
