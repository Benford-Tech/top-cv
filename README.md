# CV Studio

Générateur de CV en ligne inspiré de Zety : on remplit un formulaire à gauche,
le CV se met à jour à droite, et on l'exporte en PDF.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle statique dans dist/
npm run preview  # sert le bundle construit
```

Aucun serveur ni base de données : le site est entièrement statique et peut être
déposé tel quel sur n'importe quel hébergement de fichiers.

## Ce que fait l'application

- **Éditeur avec aperçu instantané** — informations personnelles, profil,
  expériences, formation, compétences (avec niveau) et langues. Les entrées se
  réordonnent et se suppriment, les titres de section se renomment.
- **5 modèles** — Moderne, Classique, Deux colonnes, Minimal, Créatif —
  interchangeables à tout moment sans perdre le contenu saisi.
- **Mise en forme** — couleur d'accent (palette ou sélecteur libre), 4 familles
  typographiques, curseur de densité, affichage optionnel de la photo et des
  niveaux de compétence.
- **Suggestions de contenu** — une bibliothèque de formulations rangées par
  métier (11 familles) pour la phrase d'accroche et les descriptions de poste.
  Les repères chiffrés sont laissés en « X » à remplacer : c'est le chiffre qui
  fait la différence sur un CV.
- **Export PDF** au format A4, plus export / import JSON pour reprendre un CV
  plus tard ou le transférer d'un appareil à l'autre.
- **Enregistrement automatique** dans le navigateur (`localStorage`) : rien ne
  quitte le poste de l'utilisateur, photo comprise.

## Choix techniques notables

**L'export PDF passe par la boîte d'impression du navigateur.** Le bouton
« Télécharger en PDF » appelle `window.print()` ; une feuille de style
`@media print` masque l'interface et rend la feuille à ses dimensions réelles.
Le texte reste vectoriel et sélectionnable, donc lisible par les robots de tri
des recruteurs (ATS) — ce qu'une capture en image via `html2canvas` ne permet
pas. En contrepartie, l'utilisateur passe par la boîte de dialogue système et
choisit « Enregistrer au format PDF ».

**L'aperçu est une vraie feuille A4** (`210mm × 297mm`) réduite à l'écran par une
transformation CSS, recalculée par un `ResizeObserver`. Les tailles à l'intérieur
des modèles sont exprimées en `em` relatifs à la taille de base de la feuille :
c'est ce qui permet au curseur de densité d'agir sur tout le document d'un coup.
Des repères en pointillés matérialisent les changements de page.

**La photo est réduite à 480 px et recompressée** avant stockage : le quota de
`localStorage` est de quelques mégaoctets, une photo brute d'appareil le
saturerait à elle seule.

## Déploiement

Le site est entièrement statique : il se construit en `dist/` et se sert depuis
n'importe quel hébergement de fichiers. `vercel.json` fixe la configuration
Vercel (framework Vite, `npm run build`, sortie `dist/`) et met les fichiers de
`assets/` en cache immuable — ils portent une empreinte de contenu dans leur nom,
un nouveau build produit de nouveaux noms.

Le plus simple est d'importer le dépôt depuis le tableau de bord Vercel
(*Add New… → Project*) : chaque poussée sur `main` redéploie, chaque branche
obtient son aperçu. Aucun réglage à saisir, `vercel.json` suffit.

En ligne de commande, depuis une machine authentifiée :

```bash
npx vercel        # aperçu
npx vercel --prod # production
```

Aucune variable d'environnement n'est nécessaire : il n'y a ni API, ni clé, ni
service externe à joindre au moment du build.

## Structure

```
src/
  types.ts                    modèle de données du CV
  data/defaults.ts            CV vide, CV d'exemple, palettes et polices
  data/suggestions.ts         bibliothèque de formulations par métier
  lib/useResume.ts            état de l'éditeur + enregistrement automatique
  lib/storage.ts              lecture / écriture localStorage et fichiers JSON
  lib/format.ts               dates, puces, noms de fichiers
  lib/image.ts                redimensionnement de la photo
  components/Toolbar.tsx      barre d'actions (export, import, PDF)
  components/editor/          formulaires, sélecteur de phrases, panneau de style
  components/preview/         feuille A4 et modèles de CV
```

### Ajouter un modèle

1. Créer `src/components/preview/templates/MonModele.tsx` exportant un composant
   qui reçoit `{ resume, accent }` (voir `parts.tsx` pour les briques communes :
   puces, jauges de niveau, liste de contacts).
2. L'enregistrer dans `templates/index.ts` et ajouter son identifiant à
   `TemplateId` dans `src/types.ts`.
3. Ajouter sa vignette schématique dans `Thumb` (`components/editor/DesignPanel.tsx`).

Exprimer les tailles en `em` et poser `className="avoid-break"` sur chaque entrée
pour qu'une expérience ne soit jamais coupée par un saut de page.

### Ajouter un métier aux suggestions

Ajouter une entrée à `SUGGESTIONS` dans `src/data/suggestions.ts` : un `id`, un
libellé `job`, quelques phrases d'accroche (`summary`) et une dizaine de
formulations de missions (`bullets`).

## Limites connues

- Les polices sont chargées depuis Google Fonts ; hors ligne, l'application
  bascule sur les polices système déclarées en repli.
- Le découpage en pages est celui du navigateur. Le curseur de densité et les
  repères de page permettent d'ajuster, mais il n'y a pas de moteur de
  pagination qui déplacerait automatiquement une section vers la page suivante.
- Pas de compte utilisateur : un CV vit dans le navigateur où il a été saisi,
  l'export JSON sert à le transporter ailleurs.
