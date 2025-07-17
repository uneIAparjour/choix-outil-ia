// Data structure for our decision tree
export const decisionTreeData = [
  {
    id: "1",
    question: "J'ai cherché et trouvé une application d'IA générative qui pourrait m'accompagner dans la réalisation d'une ou plusieurs tâches",
    choices: [
      { text: "Je commence l'analyse de l'application", nextStep: "2" }
    ]
  },
  {
    id: "2",
    question: "Est-ce que je peux accéder à l'application gratuitement pour la tester (application gratuite, freemium ou avec période de test gratuit) ?",
    choices: [
      { text: "Oui", nextStep: "3" },
      { text: "Non", nextStep: "18" }
    ]
  },
  {
    id: "3",
    question: "L'application respecte-t-elle les critères du RGPD (Règlement Général sur la Protection des Données) ?",
    choices: [
      { text: "Oui", nextStep: "4" },
      { text: "Non", nextStep: "3.1" },
      { text: "Je ne sais pas", nextStep: "3.2" }
    ],
    infoTooltip: "Les 6 critères principaux RGPD : \n- Collecte des données seulement nécessaires \n- Transparence sur la collecte et l'utilisation des données \n- Facilité pour exercer son droit de consultation, rectification, suppression des données \n- Durée de conservation des données \n- Sécurisation des données \n- Démarche continue de vérification de la conformité RGPD"
  },
  {
    id: "3.1",
    question: "Vous souhaitez utiliser l'application dans le cadre :",
    choices: [
      { text: "d'une expérimentation personnelle ou de travaux de préparation avec un compte dédié avec attention particulière aux données personnelles", nextStep: "4" },
      { text: "d'une utilisation directe par des élèves", nextStep: "18" }
    ]
  },
  {
    id: "3.2",
    question: "Je consulte les 6 critères principaux du RGPD",
    choices: [
      { text: "Je ne sais toujours pas", nextStep: "18" },
      { text: "J'ai suivi cette étape", nextStep: "Retour à Étape 3" }
    ],
    infoTooltip: "Les 6 critères principaux RGPD : \n- Collecte des données seulement nécessaires \n- Transparence sur la collecte et l'utilisation des données \n- Facilité pour exercer son droit de consultation, rectification, suppression des données \n- Durée de conservation des données \n- Sécurisation des données \n- Démarche continue de vérification de la conformité RGPD",
    isAction: true
  },
  {
    id: "4",
    question: "L'entreprise qui propose l'application fait-elle mention de sa conformité à l'AI Act ? (déclaration, certifications, audit...)",
    choices: [
      { text: "Oui", nextStep: "5" },
      { text: "Non, vérification effectuée avant le 02/08/2025", nextStep: "5" },
      { text: "Non, vérification effectuée après le 02/08/2025", nextStep: "18" }
    ],
    infoTooltip: "L'AI Act devra être pleinement appliqué au 02/08/2025. Ses critères principaux : \n- Transparence : L'application doit fournir des informations claires sur son fonctionnement, y compris les algorithmes utilisés et les données traitées. \n- Sécurité : L'application doit garantir la sécurité des données et protéger contre les cyberattaques. \n- Responsabilité : L'entreprise doit être responsable des résultats produits par l'IA et doit avoir des mécanismes en place pour corriger les erreurs ou les biais. \n- Éthique : L'application doit respecter les principes éthiques, comme l'absence de discrimination et le respect de la vie privée."
  },
  {
    id: "5",
    question: "Est-ce que je pourrai, après mes tests, continuer à utiliser cet outil en fonction du modèle économique proposé (gratuité, freemium, abonnement individuel ou collectif, limitations d'usage) ?",
    choices: [
      { text: "Oui", nextStep: "6" },
      { text: "Non", nextStep: "18" }
    ]
  },
  {
    id: "6",
    question: "L'application fournit-elle des informations claires sur son fonctionnement et ses limitations ?",
    choices: [
      { text: "Oui", nextStep: "7" },
      { text: "Non", nextStep: "6.1" },
      { text: "Je ne sais pas", nextStep: "6.1" }
    ]
  },
  {
    id: "6.1",
    question: "Consultez la documentation ou la FAQ de l'application et / ou contactez le support de l'application pour demander des informations supplémentaires sur son fonctionnement et ses limitations.",
    choices: [
      { text: "J'ai trouvé / reçu des informations claires", nextStep: "Retour à Étape 6" },
      { text: "Les réponses trouvées / reçues ne sont pas claires", nextStep: "18" },
      { text: "Je n'ai pas trouvé / reçu de réponse", nextStep: "18" }
    ],
    isAction: true
  },
  {
    id: "7",
    question: "L'application a-t-elle été conçue pour minimiser son impact environnemental ? (rapports, certifications, matériels et serveurs, grandeur du modèle...)",
    choices: [
      { text: "Oui", nextStep: "8" },
      { text: "Non", nextStep: "18" },
      { text: "Je ne sais pas", nextStep: "7.1" }
    ]
  },
  {
    id: "7.1",
    question: "Évaluer l'impact environnemental en examinant les pratiques de l'entreprise en matière de durabilité. Envisagez des alternatives si l'impact est significatif.",
    choices: [
      { text: "J'ai suivi cette étape", nextStep: "Retour à Étape 7" }
    ],
    isAction: true
  },
  {
    id: "8",
    question: "L'application utilise-t-elle ou a-t-elle utilisé des employés ou sous-traitants peu payés voire exploités pour l'entraînement ou le fonctionnement de l'IA ?",
    choices: [
      { text: "Oui", nextStep: "18" },
      { text: "Non", nextStep: "9" },
      { text: "Je ne sais pas", nextStep: "8.1" }
    ]
  },
  {
    id: "8.1",
    question: "Recherchez des informations sur les pratiques éthiques de l'entreprise, consultez l'annuaire des membres de l'association fairlabor.org ou des articles de presse traitant ce sujet.",
    choices: [
      { text: "L'application n'utilise pas d'employés ou sous-traitants peu payés voire exploités pour l'entraînement ou le fonctionnement de l'IA", nextStep: "9" },
      { text: "Je ne sais toujours pas", nextStep: "18" }
    ],
    isAction: true
  },
  {
    id: "9",
    question: "L'utilisation de l'IA générative m'apporte-t-elle une réelle valeur ajoutée ? (Temps, idées, précision, qualité, fonctionnalités...)",
    choices: [
      { text: "Oui", nextStep: "10" },
      { text: "Non", nextStep: "18" },
      { text: "Je ne sais pas", nextStep: "9.1" }
    ]
  },
  {
    id: "9.1",
    question: "Évaluez les fonctionnalités de l'application et leur impact potentiel sur la tâche à accomplir.",
    choices: [
      { text: "J'ai suivi cette étape", nextStep: "Retour à Étape 9" }
    ],
    isAction: true
  },
  {
    id: "10",
    question: "L'application est-elle facile à utiliser ? (en français si je ne maîtrise pas suffisamment la langue par défaut de l'interface, ergonomie, menus explicites, tutoriels…)",
    choices: [
      { text: "Oui", nextStep: "11" },
      { text: "Non", nextStep: "10.1" }
    ]
  },
  {
    id: "10.1",
    question: "Je peux prendre du temps et apprendre pour la prendre en main ?",
    choices: [
      { text: "Oui", nextStep: "11" },
      { text: "Non, je n'ai pas le temps, l'envie ou les compétences pour aller plus loin dans la prise en main", nextStep: "18" }
    ]
  },
  {
    id: "11",
    question: "L'application est-elle conforme à mes valeurs professionnelles ?",
    choices: [
      { text: "Oui", nextStep: "12" },
      { text: "Non", nextStep: "18" }
    ]
  },
  {
    id: "12",
    question: "Dans le cadre d'une utilisation commune ou collaborative, l'application est-elle conforme aux valeurs des autres utilisateurs ?",
    choices: [
      { text: "Oui", nextStep: "13" },
      { text: "Non", nextStep: "18" },
      { text: "Je l'utiliserai seule / seul", nextStep: "13" }
    ]
  },
  {
    id: "13",
    question: "Je souhaite utiliser cet outil dans un cadre pédagogique ?",
    choices: [
      { text: "Oui", nextStep: "13.1" },
      { text: "Non", nextStep: "17" }
    ]
  },
  {
    id: "13.1",
    question: "Je souhaite utiliser cette application avec des élèves à partir de la 4ème comme indiqué dans le Cadre d'usage de l'IA en éducation ?",
    choices: [
      { text: "Oui", nextStep: "14" },
      { text: "Les élèves ne sont pas encore en 4ème", nextStep: "13.2" }
    ],
    infoTooltip: "Cadre d'usage de l'IA en éducation : https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647e"
  },
  {
    id: "13.2",
    question: "Je ne peux pas utiliser d'outil d'IA générative avec mes élèves avant la 4ème",
    choices: [
      { text: "Je cherche un autre outil d'IA générative", nextStep: "18" }
    ]
  },
  {
    id: "14",
    question: "L'application permet-elle d'atteindre les objectifs pédagogiques définis par les programmes scolaires français ?",
    choices: [
      { text: "Oui", nextStep: "15" },
      { text: "Non", nextStep: "18" },
      { text: "Je ne sais pas", nextStep: "14.1" }
    ]
  },
  {
    id: "14.1",
    question: "Consultez les programmes scolaires et évaluez comment l'application peut s'y référer.",
    choices: [
      { text: "J'ai suivi cette étape", nextStep: "Retour à Étape 14" }
    ],
    isAction: true
  },
  {
    id: "15",
    question: "L'application a-t-elle été testée et validée par des enseignants ou des experts en pédagogie ? (Ministère, inspection, recherche, Réseau Canopé...)",
    choices: [
      { text: "Oui", nextStep: "17" },
      { text: "Non", nextStep: "15.1" },
      { text: "Je ne sais pas", nextStep: "15.2" }
    ]
  },
  {
    id: "15.1",
    question: "Effectuez des tests.",
    choices: [
      { text: "Évaluez l'efficacité pédagogique avec un groupe test de collègues et recueillez leurs retours", nextStep: "15.1.1" },
      { text: "Vous souhaitez tester par vous-même", nextStep: "15.1.1" }
    ],
    isAction: true
  },
  {
    id: "15.1.1",
    question: "Effectuez des tests.",
    choices: [
      { text: "Les tests vous semblent concluants", nextStep: "17" },
      { text: "Les tests ne vous semblent pas concluants", nextStep: "18" }
    ],
    isAction: true
  },
  {
    id: "15.2",
    question: "Recherchez des études de cas ou des témoignages d'enseignants ayant utilisé l'application",
    choices: [
      { text: "J'ai suivi cette étape", nextStep: "Retour à Étape 15" }
    ],
    isAction: true
  },
  {
    id: "16",
    question: "Mes valeurs personnelles, mes valeurs professionnelles et mon cadre d'utilisation me permettent-ils de laisser de côté un critère de choix ?",
    choices: [
      { text: "Oui (Mes valeurs personnelles, mes valeurs professionnelles et mon cadre d'utilisation me permettent de laisser de côté un critère de choix)", nextStep: "1" },
      { text: "Non (Mes valeurs personnelles, mes valeurs professionnelles et mon cadre d'utilisation ne me permettent pas de laisser de côté un ou plusieurs critères de choix)", nextStep: "19" }
    ]
  },
  {
    id: "17",
    question: "Bravo ! Vous avez trouvé l'outil qui vous convient. Si l'utilisation de cette application peut devenir régulière dans le cadre de votre travail, pensez à la faire inscrire au registre RGPD. Bonnes utilisations à venir !",
    choices: [
      { text: "Recommencer l'analyse", nextStep: "1" }
    ]
  },
  {
    id: "18",
    question: "Je cherche un autre outil d'IA générative",
    choices: [
      { text: "J'ai cherché et j'ai trouvé un autre outil d'IA générative qui me semble intéressant", nextStep: "Retour à Étape 1" },
      { text: "J'ai cherché et n'ai pas trouvé d'autre outil d'IA générative qui me semble intéressant", nextStep: "16" }
    ],
    isAction: true
  },
  {
    id: "19",
    question: "Je n'utilise pas d'outils d'IA générative pour la tâche prévue et/ou je reprends mes recherches.",
    choices: [
      { text: "Recommencer l'analyse", nextStep: "1" }
    ]
  }
];
