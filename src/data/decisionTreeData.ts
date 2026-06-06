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
      { text: "Non, aucune mention de conformité à l'AI Act", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    infoTooltip: "L'AI Act (règlement européen sur l'intelligence artificielle) est en vigueur. Ses critères principaux :\n- Transparence : informations claires sur le fonctionnement\n- Sécurité : protection des données et contre les cyberattaques\n- Responsabilité : mécanismes de correction des erreurs ou biais\n- Éthique : absence de discrimination, respect de la vie privée",
    infoSources: ["https://artificialintelligenceact.eu/fr/"],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "4.1",
    dimension: "compliance",
    question: "L'application est-elle accessible aux personnes en situation de handicap ? (conformité RGAA/WCAG, compatibilité lecteurs d'écran, alternatives textuelles)",
    choices: [
      { text: "Oui", nextStep: "5", complianceLevel: "compliant" },
      { text: "Partiellement", nextStep: "5", complianceLevel: "partial", warning: "Accessibilité handicap partielle" },
      { text: "Non", nextStep: "5", complianceLevel: "non-compliant", warning: "Non accessible aux personnes en situation de handicap" },
      { text: "Je ne sais pas", nextStep: "5", complianceLevel: "partial", warning: "Accessibilité handicap non vérifiée" }
    ],
    infoTooltip: "L'accessibilité numérique est une obligation légale pour les services publics (RGAA). Les critères WCAG définissent les standards internationaux d'accessibilité web.",
    infoSources: ["https://accessibilite.numerique.gouv.fr/"],
    pathways: ["personal", "professional", "students"]
  },

  // ═══════════════════════════════════════════
  // DIMENSION 2 : UTILITÉ
  // ═══════════════════════════════════════════
  {
    id: "5",
    dimension: "utility",
    question: "Est-ce que je pourrai, après mes tests, continuer à utiliser cet outil en fonction du modèle économique proposé (gratuité, freemium, abonnement, limitations) ?",
    choices: [
      { text: "Oui", nextStep: "6", complianceLevel: "compliant" },
      { text: "Non", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "6",
    dimension: "utility",
    question: "L'utilisation de l'IA générative m'apporte-t-elle une réelle valeur ajoutée ? (gain de temps, idées, précision, qualité, fonctionnalités nouvelles)",
    choices: [
      { text: "Oui, clairement", nextStep: "6.1", complianceLevel: "compliant" },
      { text: "Partiellement", nextStep: "6.1", complianceLevel: "partial", warning: "Valeur ajoutée limitée par rapport aux alternatives" },
      { text: "Non", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true },
      { text: "Je ne sais pas", nextStep: "6.0", complianceLevel: "partial" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "6.0",
    dimension: "utility",
    question: "Évaluez les fonctionnalités de l'application et leur impact potentiel sur la tâche à accomplir.",
    choices: [
      { text: "J'ai évalué, je peux maintenant répondre", nextStep: "6" }
    ],
    isAction: true,
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "6.1",
    dimension: "utility",
    question: "L'outil produit-il des résultats fiables et vérifiables ?",
    choices: [
      { text: "Oui : l'outil cite ses sources et/ou propose des mécanismes de vérification", nextStep: "7", complianceLevel: "compliant" },
      { text: "Partiellement : les résultats semblent corrects mais ne sont pas sourcés ni vérifiables automatiquement", nextStep: "7", complianceLevel: "partial", warning: "Fiabilité partielle — vérification manuelle nécessaire" },
      { text: "Non : les résultats sont souvent erronés ou invérifiables", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true, warning: "Fiabilité insuffisante" }
    ],
    infoTooltip: "Les IA génératives peuvent produire des « hallucinations » : des informations présentées avec assurance mais factuellement fausses. C'est l'un des principaux risques en contexte éducatif. Vérifiez si l'outil cite ses sources, signale son niveau d'incertitude, ou propose des mécanismes de vérification.",
    pathways: ["personal", "professional", "students"]
  },

  // ═══════════════════════════════════════════
  // DIMENSION 3 : UTILISABILITÉ
  // ═══════════════════════════════════════════
  {
    id: "7",
    dimension: "usability",
    question: "L'application fournit-elle des informations claires sur son fonctionnement et ses limitations ?",
    choices: [
      { text: "Oui", nextStep: "8", complianceLevel: "compliant" },
      { text: "Non", nextStep: "7.1", complianceLevel: "non-compliant" },
      { text: "Je ne sais pas", nextStep: "7.1" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "7.1",
    dimension: "usability",
    question: "Consultez la documentation ou la FAQ de l'application et/ou contactez le support pour obtenir des informations sur son fonctionnement et ses limitations.",
    choices: [
      { text: "J'ai trouvé des informations claires", nextStep: "8", complianceLevel: "compliant" },
      { text: "Les réponses ne sont pas claires", nextStep: "8", complianceLevel: "partial", warning: "Transparence insuffisante sur le fonctionnement" },
      { text: "Je n'ai pas trouvé de réponse", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    isAction: true,
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "8",
    dimension: "usability",
    question: "L'application est-elle facile à utiliser ? (en français si nécessaire, ergonomie, menus explicites, tutoriels…)",
    choices: [
      { text: "Oui", nextStep: "9", complianceLevel: "compliant" },
      { text: "Non, mais je peux apprendre à la prendre en main", nextStep: "9", complianceLevel: "partial", warning: "Prise en main difficile — temps d'apprentissage nécessaire" },
      { text: "Non, et je n'ai pas le temps ou les compétences", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    pathways: ["personal", "professional", "students"]
  },

  // ═══════════════════════════════════════════
  // DIMENSION 4 : ACCEPTABILITÉ
  // ═══════════════════════════════════════════
  {
    id: "9",
    dimension: "acceptability",
    question: "L'application a-t-elle été conçue pour minimiser son impact environnemental ? (rapports, certifications, matériels et serveurs, taille du modèle…)",
    choices: [
      { text: "Oui", nextStep: "10", complianceLevel: "compliant" },
      { text: "Partiellement ou pas d'information claire", nextStep: "10", complianceLevel: "partial", warning: "Impact environnemental non vérifié ou partiellement maîtrisé" },
      { text: "Non, impact environnemental significatif", nextStep: "10", complianceLevel: "non-compliant", warning: "Impact environnemental significatif" }
    ],
    infoTooltip: "L'entraînement et l'utilisation des modèles d'IA consomment des ressources importantes (énergie, eau, matériel). Certains éditeurs publient des rapports environnementaux et utilisent des centres de données alimentés en énergie renouvelable.",
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "10",
    dimension: "acceptability",
    question: "L'application utilise-t-elle ou a-t-elle utilisé des employés ou sous-traitants peu payés voire exploités pour l'entraînement ou le fonctionnement de l'IA ?",
    choices: [
      { text: "Non", nextStep: "10.1", complianceLevel: "compliant" },
      { text: "Je ne sais pas", nextStep: "10.0", complianceLevel: "partial" },
      { text: "Oui", nextStep: "10.1", complianceLevel: "non-compliant", warning: "Pratiques éthiques douteuses concernant les conditions de travail" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "10.0",
    dimension: "acceptability",
    question: "Recherchez des informations sur les pratiques éthiques de l'entreprise, consultez l'annuaire de fairlabor.org ou des articles de presse.",
    choices: [
      { text: "J'ai vérifié, pas de problème identifié", nextStep: "10.1", complianceLevel: "compliant" },
      { text: "J'ai vérifié, des problèmes existent", nextStep: "10.1", complianceLevel: "non-compliant", warning: "Pratiques éthiques douteuses concernant les conditions de travail" },
      { text: "Je ne sais toujours pas", nextStep: "10.1", complianceLevel: "partial", warning: "Conditions de travail des sous-traitants non vérifiées" }
    ],
    infoSources: ["https://www.fairlabor.org/"],
    isAction: true,
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "10.1",
    dimension: "acceptability",
    question: "L'éditeur communique-t-il sur les biais connus de son modèle et les mesures prises pour les atténuer ?",
    choices: [
      { text: "Oui, documentation transparente sur les biais", nextStep: "11", complianceLevel: "compliant" },
      { text: "Partiellement", nextStep: "11", complianceLevel: "partial", warning: "Communication partielle sur les biais algorithmiques" },
      { text: "Non", nextStep: "11", complianceLevel: "non-compliant", warning: "Aucune information sur les biais algorithmiques" }
    ],
    infoTooltip: "Les modèles d'IA peuvent reproduire ou amplifier des biais présents dans leurs données d'entraînement (genre, origine, culture…). En contexte éducatif, des biais non identifiés peuvent transmettre des stéréotypes aux élèves.",
    pathways: ["personal", "professional", "students"]
  },

  // ═══════════════════════════════════════════
  // VALEURS (professionnel + élèves uniquement)
  // ═══════════════════════════════════════════
  {
    id: "11",
    dimension: "acceptability",
    question: "L'application est-elle conforme à mes valeurs professionnelles ?",
    choices: [
      { text: "Oui", nextStep: "12", complianceLevel: "compliant" },
      { text: "Partiellement", nextStep: "12", complianceLevel: "partial", warning: "Alignement partiel avec les valeurs professionnelles" },
      { text: "Non", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    pathways: ["professional", "students"]
  },
  {
    id: "12",
    dimension: "acceptability",
    question: "Dans le cadre d'une utilisation commune ou collaborative, l'application est-elle conforme aux valeurs des autres utilisateurs ?",
    choices: [
      { text: "Oui", nextStep: "13", complianceLevel: "compliant" },
      { text: "Non", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true },
      { text: "Je l'utiliserai seul(e)", nextStep: "13", complianceLevel: "compliant" }
    ],
    pathways: ["professional", "students"]
  },

  // ═══════════════════════════════════════════
  // BRANCHE PÉDAGOGIQUE (élèves uniquement)
  // ═══════════════════════════════════════════
  {
    id: "13",
    dimension: "acceptability",
    question: "Je souhaite utiliser cet outil dans un cadre pédagogique avec des élèves à partir de la 4ème, comme indiqué dans le cadre d'usage de l'IA en éducation ?",
    choices: [
      { text: "Oui, avec des élèves à partir de la 4ème", nextStep: "14", complianceLevel: "compliant" },
      { text: "Les élèves ne sont pas encore en 4ème", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true, warning: "Usage d'IA générative interdit avant la 4ème" }
    ],
    infoTooltip: "Le cadre d'usage de l'IA en éducation prévoit l'utilisation d'outils d'IA générative à partir de la 4ème.",
    infoSources: ["https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647e"],
    pathways: ["students"]
  },
  {
    id: "14",
    dimension: "utility",
    question: "L'application permet-elle d'atteindre les objectifs pédagogiques définis par les programmes scolaires français ?",
    choices: [
      { text: "Oui", nextStep: "14.1", complianceLevel: "compliant" },
      { text: "Partiellement", nextStep: "14.1", complianceLevel: "partial", warning: "Alignement partiel avec les programmes scolaires" },
      { text: "Non", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true },
      { text: "Je ne sais pas", nextStep: "14.0" }
    ],
    pathways: ["students"]
  },
  {
    id: "14.0",
    dimension: "utility",
    question: "Consultez les programmes scolaires et évaluez comment l'application peut s'y intégrer.",
    choices: [
      { text: "J'ai consulté, je peux maintenant évaluer", nextStep: "14" }
    ],
    isAction: true,
    pathways: ["students"]
  },
  {
    id: "14.1",
    dimension: "utility",
    question: "L'élève reste-t-il en situation d'apprentissage actif avec cet outil, ou l'outil fait-il le travail à sa place ?",
    choices: [
      { text: "L'élève reste actif et l'outil accompagne son apprentissage", nextStep: "15", complianceLevel: "compliant" },
      { text: "L'outil peut faire le travail à la place de l'élève mais peut être encadré", nextStep: "15", complianceLevel: "partial", warning: "Risque de délégation — encadrement pédagogique nécessaire" },
      { text: "L'outil fait le travail à la place de l'élève", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true, warning: "L'outil remplace l'apprentissage au lieu de le soutenir" }
    ],
    infoTooltip: "La question fondamentale : l'IA doit être un levier d'apprentissage, pas un substitut. L'élève doit rester en posture active (réfléchir, reformuler, vérifier, critiquer) et non passive (copier-coller le résultat).",
    pathways: ["students"]
  },
  {
    id: "15",
    dimension: "acceptability",
    question: "L'application a-t-elle été testée et validée par des enseignants ou des experts en pédagogie ? (Ministère, inspection, recherche, Réseau Canopé…)",
    choices: [
      { text: "Oui", nextStep: "success", complianceLevel: "compliant" },
      { text: "Non", nextStep: "15.1" },
      { text: "Je ne sais pas", nextStep: "15.2" }
    ],
    pathways: ["students"]
  },
  {
    id: "15.1",
    dimension: "acceptability",
    question: "Effectuez des tests pour évaluer l'efficacité pédagogique.",
    choices: [
      { text: "J'ai testé avec des collègues, résultats concluants", nextStep: "success", complianceLevel: "compliant" },
      { text: "J'ai testé seul(e), résultats concluants", nextStep: "success", complianceLevel: "partial", warning: "Validation par un seul enseignant — un retour collectif serait préférable" },
      { text: "Les tests ne sont pas concluants", nextStep: "reject", complianceLevel: "non-compliant", isEliminating: true }
    ],
    isAction: true,
    pathways: ["students"]
  },
  {
    id: "15.2",
    dimension: "acceptability",
    question: "Recherchez des études de cas ou des témoignages d'enseignants ayant utilisé l'application.",
    choices: [
      { text: "J'ai trouvé des retours, je peux maintenant évaluer", nextStep: "15" }
    ],
    isAction: true,
    pathways: ["students"]
  },

  // ═══════════════════════════════════════════
  // CONCLUSIONS
  // ═══════════════════════════════════════════
  {
    id: "success",
    dimension: "acceptability",
    question: "Bravo ! Vous avez trouvé un outil qui répond à vos critères. Consultez le résumé de votre évaluation ci-dessous. Si l'utilisation de cette application peut devenir régulière dans le cadre de votre travail, pensez à la faire inscrire au registre RGPD et à informer le DPD de votre établissement.",
    choices: [
      { text: "Exporter l'évaluation (JSON)", nextStep: "export", complianceLevel: "compliant" },
      { text: "Recommencer avec un autre outil", nextStep: "0", complianceLevel: "compliant" }
    ],
    infoTooltip: "Pensez à réévaluer cet outil dans 6 mois ou si les conditions d'utilisation changent. Le domaine de l'IA évolue très rapidement.",
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "reject",
    dimension: "acceptability",
    question: "Cet outil ne remplit pas tous les critères nécessaires pour votre usage.",
    choices: [
      { text: "Exporter l'évaluation (JSON)", nextStep: "export", complianceLevel: "compliant" },
      { text: "Chercher un autre outil", nextStep: "0", complianceLevel: "compliant" },
      { text: "Revoir mes critères — puis-je en assouplir un ?", nextStep: "reconsider", complianceLevel: "compliant" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "reconsider",
    dimension: "acceptability",
    question: "Mes valeurs personnelles, mes valeurs professionnelles et mon cadre d'utilisation me permettent-ils de laisser de côté un critère de choix ?",
    choices: [
      { text: "Oui, je souhaite réévaluer avec des critères assouplis", nextStep: "0", complianceLevel: "partial", warning: "Réévaluation avec critères assouplis" },
      { text: "Non, je maintiens mes exigences", nextStep: "final-reject", complianceLevel: "compliant" }
    ],
    pathways: ["personal", "professional", "students"]
  },
  {
    id: "final-reject",
    dimension: "acceptability",
    question: "Je n'utilise pas d'outils d'IA générative pour la tâche prévue et/ou je reprends mes recherches.",
    choices: [
      { text: "Exporter l'évaluation (JSON)", nextStep: "export", complianceLevel: "compliant" },
      { text: "Recommencer l'analyse", nextStep: "0", complianceLevel: "compliant" }
    ],
    pathways: ["personal", "professional", "students"]
  }
];
