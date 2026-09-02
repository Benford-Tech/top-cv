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

- **Import LinkedIn** — expériences, formations, compétences, langues et
  recommandations reçues, par l'adresse du profil ou par l'export de données du
  compte (voir plus bas).
- **Éditeur avec aperçu instantané** — informations personnelles, profil,
  expériences, formation, compétences (avec niveau), langues et recommandations. Les entrées se
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

## Import LinkedIn

L'application peut préremplir un CV depuis LinkedIn : expériences, formations,
compétences, langues, identité **et recommandations reçues**.

Deux voies, selon ce que le déploiement offre.

### Par l'adresse du profil

Un champ accepte `https://www.linkedin.com/in/identifiant` et interroge la
fonction serveur `api/linkedin.ts`, qui relaie vers un fournisseur de données.

**Cela ne peut pas se faire depuis le navigateur** : ni LinkedIn ni ces
fournisseurs n'émettent d'en-têtes CORS, et une clé d'API n'a rien à faire dans
un bundle public. D'où la fonction serveur — la configuration Vercel du dépôt
la déploie automatiquement.

Aucun fournisseur n'est codé en dur. L'endpoint, la clé, le nom du paramètre et
l'en-tête d'authentification se déclarent en variables d'environnement (voir
`.env.example`), ce qui permet d'en changer sans toucher au code. C'est
volontaire : **Proxycurl, longtemps la référence du secteur, a fermé le
4 juillet 2026** après une action en justice de LinkedIn — reprochant des
centaines de milliers de faux comptes et l'aspiration de données non publiques,
et non le principe du profil public. Les acteurs restants relèvent de trois
familles : moissonneurs temps réel, revendeurs de bases, et API adossées à un
compte réel.

Sans variables d'environnement, l'endpoint répond `501` et l'interface propose
l'archive. Les erreurs du fournisseur sont renvoyées sous forme de code
seulement : ni la clé ni les détails d'infrastructure ne remontent au navigateur.

**À peser avant de brancher un fournisseur :**

- cela repose sur l'aspiration de profils LinkedIn, ce que ses conditions
  d'utilisation interdisent — le risque contractuel est chez le fournisseur,
  mais il retombe sur le service qui s'y adosse ;
- l'URL du profil est transmise à un tiers, et il s'agit de données
  personnelles : le RGPD s'applique, y compris quand la personne traite ses
  propres données via votre service ;
- chaque recherche est facturée, et la disponibilité dépend d'un acteur externe ;
- les recommandations ne sont pas restituées par tous les fournisseurs.

### Par l'archive d'export

Sans dépendance externe, et c'est la seule voie qui garantit les
recommandations. LinkedIn n'ouvre pas ces données par ses propres interfaces :

- l'OAuth public (*Sign In with LinkedIn / OpenID Connect*) ne rend que le nom,
  la photo et l'adresse e-mail — ni postes, ni formations, ni compétences ;
- l'API profil complète est réservée au *LinkedIn Partner Program*, sur dossier ;
- **aucune API LinkedIn n'expose les recommandations**, partenaire ou non ;
- le scraping est interdit par les conditions d'utilisation, et bloqué en
  pratique.

L'export que chaque membre peut demander pour lui-même contourne tout cela :
*Préférences et confidentialité → Confidentialité des données → Obtenir une
copie de vos données*. L'archive ZIP se dépose dans
l'application, qui la lit **dans le navigateur** — elle n'est envoyée nulle part.

Fichiers exploités : `Profile.csv`, `Positions.csv`, `Education.csv`,
`Skills.csv`, `Languages.csv`, `Email Addresses.csv` et
`Recommendations_Received.csv`. Les CSV isolés sont acceptés aussi, si l'archive
a déjà été décompressée.

Quelques partis pris de lecture :

- une date de fin vide sur un poste vaut « poste actuel » ;
- une recommandation dont le statut n'est pas `VISIBLE` est ignorée — ce qui est
  masqué sur le profil n'a pas à surgir sur un CV ;
- LinkedIn ne note pas les compétences : elles arrivent toutes à 4 sur 5, à
  ajuster ensuite ;
- les champs d'identité (nom, titre, ville, e-mail, profil) ne sont remplis que
  s'ils sont vides — un import n'écrase jamais ce qui a été saisi à la main ;
- au choix, l'import **remplace** les sections retenues ou **s'ajoute** à leur
  suite.

> Les intitulés de colonnes et de fichiers varient selon la version de l'export
> et la langue du compte. Le lecteur les compare de façon souple (casse, accents
> et ponctuation ignorés, plusieurs intitulés acceptés), et l'écran d'import
> affiche le décompte de ce qui a réellement été reconnu, section par section :
> un export atypique se voit au lieu de passer inaperçu. Le lecteur a été validé
> sur une archive de test reproduisant la structure documentée, pas sur toutes
> les variantes existantes.

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

Aucune variable d'environnement n'est nécessaire pour le build. Celles de
`.env.example` ne servent qu'à la recherche par adresse de profil : sans elles,
le site fonctionne, et seule cette voie d'import est désactivée.

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
  lib/csv.ts                  lecteur CSV conforme à RFC 4180
  lib/linkedin.ts             lecture de l'archive d'export LinkedIn
  lib/linkedinProfile.ts      normalisation de la réponse d'un fournisseur
api/
  linkedin.ts                 relais serveur vers le fournisseur de données
  components/Toolbar.tsx      barre d'actions (export, import, PDF)
  components/editor/          formulaires, sélecteur de phrases, import LinkedIn,
                              panneau de style
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
