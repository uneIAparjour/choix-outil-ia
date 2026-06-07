# Aide au choix d'une application utilisant des IA génératives

Arbre de décision interactif pour évaluer méthodiquement un outil d'IA générative selon 4 dimensions, évolution de la première version inspirée du modèle de [Tricot et al. (2003)](https://edutice.hal.science/edutice-00000154) : **Conformité**, **Utilité**, **Utilisabilité**, **Acceptabilité**.

🔗 **Accès direct** : [uneiaparjour.fr/aide](https://www.uneiaparjour.fr/aide/)

## Présentation

L'application guide l'utilisateur à travers une série de questions pour déterminer si un outil d'IA générative est adapté à son contexte d'usage. Chaque réponse est notée (conforme, partiel, non conforme) et certaines stoppent le parcours si des critères éliminatoires sont choisis. À la fin du parcours, un résumé détaillé est généré avec un score par dimension et une liste de points de vigilance.

### 3 parcours adaptés

| Parcours | Description | Nombre de critères | Score max |
|----------|-------------|-------------------|-----------|
| 🔵 Personnel | Curiosité, veille, productivité personnelle | 13 | 26 |
| 🟢 Professionnel | Productivité, rédaction, analyse, préparation de supports… | 15 | 30 |
| 🟣 Élèves | Usage en classe, en autonomie ou en travail collaboratif | 19 | 38 |

### 4 dimensions évaluées

- **Conformité** — RGPD, souveraineté des données, AI Act, accessibilité handicap
- **Utilité** — Modèle économique, valeur ajoutée, fiabilité des résultats
- **Utilisabilité** — Transparence du fonctionnement, facilité d'utilisation
- **Acceptabilité** — Impact environnemental, éthique, biais, valeurs professionnelles, validation pédagogique (élèves)

### Fonctionnalités

- Parcours adaptatif selon le contexte d'usage choisi
- Système de notation à 3 niveaux (conforme 2 pts / partiel 1 pt / non conforme 0 pt)
- Critères éliminatoires avec rejet immédiat
- Infobulles cliquables avec sources et pistes de vérification
- Export de l'évaluation en JSON
- Comparaison de deux outils via import de fichiers JSON
- Score max calculé sur le parcours complet (pas seulement les critères traversés)

## Nouveautés de la version 2

### Sur le fond

- **3 parcours** au lieu d'un parcours unique — le niveau d'exigence s'adapte au contexte (personnel, professionnel, élèves)
- **4 dimensions** structurées selon Tricot et al. (2003), avec badges visuels par dimension
- **Critères RGPD nuancés** — distinction entre expérimentation (on teste avec précautions) et usage régulier (conformité obligatoire)
- **AI Act reformulé** — basé sur les obligations réelles de transparence (Article 50), sans les références à des dates obsolètes de la V1
- **Infobulles enrichies** — pistes de vérification concrètes pour l'impact environnemental et les biais algorithmiques
- **Fiabilité clarifiée** — distinction entre résultats sourcés/vérifiables et résultats corrects mais non sourcés
- **Mentions DPD** — rappel de consulter le Délégué à la Protection des Données pour un usage régulier

### Sur la forme

- **Export JSON** de chaque évaluation pour archivage ou comparaison
- **Mode comparaison** — import de 2 fichiers JSON pour comparer deux outils côte à côte, avec détail par dimension et alerte si les parcours diffèrent
- **Score sur le parcours complet** — un outil éliminé au 2ᵉ critère affiche 2/30, pas 2/4
- **Boutons uniformes** — tous les choix en couleur unique (#005E6E), avertissements affichés en texte sous le bouton
- **Infobulles au clic** (Popover) au lieu du survol (Tooltip), compatible mobile
- **Navigation** — clic sur une étape passée pour revenir en arrière et modifier sa réponse

### Nettoyage technique

- Suppression de toutes les traces Lovable utilisé pour la V1 (favicon, scripts, meta, tagger)
- Suppression de 45 composants UI inutilisés et 30+ packages npm
- Triple TooltipProvider → un seul
- QueryClientProvider et Sonner inutilisés → supprimés
- `dangerouslySetInnerHTML` → `whitespace-pre-line`

## Documentation

L'arbre de décision complet est documenté dans [`docs/arbre-decision.md`](docs/arbre-decision.md) avec toutes les questions, réponses, niveaux de conformité et routages par parcours.

## Architecture

```
src/
├── types/evaluation.ts          # Types TypeScript (Pathway, Step, Choice, EvaluationExport…)
├── data/decisionTreeData.ts     # Données de l'arbre de décision (questions, réponses, infobulles)
├── lib/
│   ├── scoring.ts               # Scoring par dimension, export/import JSON
│   └── comparison.ts            # Comparaison de deux évaluations
├── components/
│   ├── DecisionTree.tsx          # Composant principal (routing, état, navigation)
│   ├── PathwaySelector.tsx       # Sélection du parcours (3 cartes)
│   ├── ToolInfoForm.tsx          # Formulaire nom/URL/éditeur
│   ├── StepCard.tsx              # Carte question avec boutons et infobulles
│   ├── ResultSummary.tsx         # Résumé des scores avec barres de progression
│   └── ComparisonView.tsx        # Vue comparaison de deux JSON
├── pages/
│   ├── Index.tsx                 # Page principale
│   └── Compare.tsx               # Page /comparer
├── App.tsx                       # Routes
└── main.tsx                      # Point d'entrée
```

## Stack technique

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- Radix UI (Popover, Tooltip, Toast)
- Lucide Icons
- Police Marianne (DSFR)

## Développement

```bash
npm install
npm run dev
```

L'application tourne sur `http://localhost:8080`.

## Intégration WordPress

L'application est intégrée dans la page WordPress via une iframe. Déploiement GitHub Pages à venir.

## Licence

Mis à disposition sous [licence CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fr) par [uneIAparjour](https://www.uneiaparjour.fr).

- [Version 1](https://github.com/uneIAparjour/choix-outil-ia/tree/main) disponible sur la branche `main`
- [Code source v2](https://github.com/uneIAparjour/choix-outil-ia/tree/v2) sur la branche `v2`
