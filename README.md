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

`npm run dev` sert aussi les fonctions du dossier `api/` : import LinkedIn par
URL, paiement et génération du PDF sont donc testables en local, avec le même
code qu'en production. Copiez `.env.example` vers `.env` et renseignez ce dont
vous avez besoin — le fichier est lu au démarrage, y compris les variables sans
préfixe `VITE_`, et il est exclu du dépôt.

Sans `.env`, les fonctions répondent `501` en expliquant ce qui manque : le site
reste utilisable, seules les fonctionnalités concernées sont désactivées.

> `npm run preview` sert le bundle construit **sans** les fonctions `api/` :
> c'est un serveur de fichiers statiques. Pour tester l'API, utilisez
> `npm run dev`. Un appel à `/api/…` qui échoue affiche désormais la cause
> exacte — absence de déploiement, erreur de la fonction, configuration
> manquante ou coupure réseau — au lieu d'un message unique.

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
  métier (21 familles) pour la phrase d'accroche et les descriptions de poste.
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

## Pages

| Chemin | Contenu |
| --- | --- |
| `/` | Page d'accueil publique : promesse, étapes, galerie des modèles, fiches métier, questions fréquentes. |
| `/cv/<métier>` | 21 fiches : ce que le recruteur regarde, erreurs propres au métier, formulations à reprendre. |
| `/cv/<situation>` | 6 fiches : étudiant, sans expérience, alternance, reconversion, interruption, après 50 ans. Ce qui change n'est pas le contenu mais l'ordre des sections et la formulation. |
| `/modeles/<modèle>` | 5 fiches : à qui le modèle convient, quand en préférer un autre, déclinaisons de couleur. |
| `/editeur` | L'application d'édition du CV. |

`src/routes.ts` est la liste unique des pages indexables : elle sert au rendu
dans le navigateur, au prérendu et au plan du site. Aucune page ne peut donc
être publiée sans métadonnées, ni oubliée du sitemap.

Métiers et situations partagent le préfixe `/cv/`, parce qu'ils répondent à la
même forme de requête (« cv comptable », « cv reconversion »). Un identifiant en
double ferait silencieusement disparaître une page derrière l'autre :
`scripts/postbuild.mjs` refuse donc de construire si deux fiches réclament la
même adresse.

Les fiches situation ne conseillent jamais de dissimuler quoi que ce soit. Les
dates sont vérifiées par les recruteurs, et une omission découverte coûte plus
cher que le fait qu'elle masquait — la page sur les interruptions le dit
explicitement.

Les vignettes de la galerie sont rendues par **les composants du CV eux-mêmes**,
réduits à l'échelle : un modèle modifié se voit immédiatement sur la page
d'accueil, et une vignette ne peut pas promettre autre chose que le produit.

L'aiguillage tient en une trentaine de lignes (`src/Root.tsx`) — deux vues ne
justifient pas une bibliothèque de routage. `vercel.json` renvoie les chemins
inconnus vers `index.html` en excluant `/api`, pour que `/editeur` reste
partageable et rechargeable.

> La page d'accueil ne comporte **ni témoignages, ni logos d'entreprises, ni
> compteur d'utilisateurs**. Le produit n'a pas encore d'utilisateurs : ces
> éléments seraient fabriqués. À ajouter quand ils existeront et seront
> vérifiables.

### Référencement et partage

Le site est une application React : sans précaution, le HTML livré serait une
coquille vide. Or **les robots des réseaux sociaux — LinkedIn, WhatsApp,
Facebook, Slack — n'exécutent pas JavaScript** : un lien partagé n'afficherait
aucun aperçu, ce qui coupe le canal le plus naturel pour un outil de CV.

`npm run build` enchaîne donc trois étapes : le bundle habituel, une seconde
compilation en mode SSR (`src/entry-static.tsx`), puis `scripts/postbuild.mjs`
qui :

- écrit **un fichier HTML complet par page** (`dist/cv/developpeur.html`, etc.),
  contenant le texte, les titres et les modèles ;
- donne à chacune son titre, sa description, son URL canonique et ses balises
  Open Graph et Twitter, depuis une source unique ;
- pose les données structurées : `FAQPage` sur l'accueil — les réponses peuvent
  alors apparaître directement dans les résultats — et `BreadcrumbList` sur les
  pages de contenu. Le schéma de l'application est déclaré **sans bloc
  tarifaire** : le prix n'étant annoncé qu'après rédaction, il n'a pas à
  s'afficher dans les résultats de recherche ;
- génère `robots.txt` (l'éditeur et `/api` sont exclus de l'indexation : ce sont
  des applications, pas des pages), `sitemap.xml` et `404.html`.

Deux pièges évités, qui coûtent cher en référencement :

- **Les fichiers sont plats** (`cv/developpeur.html`), pas des dossiers avec un
  index. Sinon `/x` et `/x/` répondent tous les deux et chaque page compte
  double.
- **La réécriture ne vise que `/editeur`.** Une règle attrape-tout renverrait
  l'accueil pour n'importe quelle adresse : ces « fausses 404 » sont détectées
  et sanctionnées. Une adresse inconnue doit répondre 404.

Les vignettes réduites affichent une version courte du CV de démonstration
(`tileResume`). À 150 px de large le texte n'est pas lisible de toute façon, et
l'afficher en entier répéterait les mêmes centaines de mots sur chaque page,
noyant le contenu propre à chacune.

Au chargement, React **hydrate** ce contenu au lieu de le reconstruire : rien ne
clignote. Les autres chemins reçoivent le même fichier par la réécriture Vercel
et repartent d'un conteneur vide, puisqu'ils doivent rendre autre chose.

`public/og.png` (1200 × 630) est l'image de partage. Elle est composée avec les
vrais modèles de CV, comme les vignettes de la galerie.

> **`SITE_URL` est à définir dans Vercel** (par exemple
> `https://votre-domaine.fr`). Les balises Open Graph et le plan du site exigent
> des URL absolues ; sans cette variable, une valeur par défaut est utilisée et
> les aperçus pointeront vers le mauvais domaine.

## Comptes, paiement et téléchargement

Le CV se rédige librement, mais **le PDF ne s'obtient qu'avec un compte et
après paiement**, à l'unité : un règlement débloque définitivement ce CV, y
compris après modification.

**Le montant n'est pas affiché sur la page d'accueil**, mais au moment du
téléchargement, une fois le CV terminé. Il ne vient pas du code du navigateur :
c'est la réponse `402` de `api/cv/pdf.ts` qui le transporte, à partir de
`CV_PRICE_CENTS`. Le montant annoncé et celui facturé par Stripe ont donc la
même source et ne peuvent pas diverger. La page d'accueil dit en revanche que le
téléchargement est payant : laisser croire à la gratuité puis présenter un
paywall après vingt minutes de saisie serait déloyal.

### Pourquoi le PDF est fabriqué par le serveur

Tant que le PDF était produit par l'impression du navigateur, **il n'y avait
rien à protéger** : `Ctrl+P` donnait le document sans passer par le moindre
bouton, et la feuille de style d'impression du projet y aidait activement.
Masquer un bouton n'est pas un verrou.

Le document est donc désormais rendu par `api/cv/pdf.ts` : Chromium sans
interface compose le PDF à partir des données stockées en base, et l'endpoint ne
le remet qu'à un utilisateur authentifié dont le CV est marqué payé. Les mêmes
composants React servent à l'aperçu et au PDF — un seul jeu de modèles à
maintenir, et aucun écart possible entre ce qui est vu et ce qui est vendu.

En conséquence, dans le navigateur :

- l'impression de la page est neutralisée : elle ne rend qu'une ligne renvoyant
  vers le bouton de téléchargement ;
- l'aperçu porte un filigrane tant que le CV n'est pas débloqué ;
- l'export JSON demande d'être connecté. Il est **volontairement conservé** :
  ce sont les données de l'utilisateur, pas un CV mis en page, et le droit à la
  portabilité des données (RGPD, article 20) s'y oppose.

> **Ce qui n'est pas bloqué, et ne peut pas l'être.** Le texte de l'aperçu reste
> dans la page : une capture d'écran ou un copier-coller restent possibles. Ce
> qui est garanti, c'est que le **document propre, paginé, en pleine qualité**
> n'existe que sur le serveur et n'est remis qu'après paiement. Un aperçu
> réellement inviolable supposerait de n'envoyer au navigateur qu'une image
> dégradée, au prix d'un éditeur temps réel — le compromis retenu est celui des
> produits du marché.

### Où se joue le droit de télécharger

Trois verrous, du plus externe au plus interne :

1. **La signature du webhook.** `api/stripe-webhook.ts` est le seul chemin qui
   passe `paid` à `true`. Il rejette toute requête dont la signature Stripe
   n'est pas valide : appeler l'URL à la main ne donne rien.
2. **Les privilèges de colonnes.** La base retire au rôle `authenticated`
   l'écriture sur `paid`, `paid_at` et `stripe_session_id` (`grant update
   (title, data)`). Même en forgeant une requête, un utilisateur connecté ne
   peut pas s'accorder le droit de télécharger. Les politiques RLS seules ne le
   permettraient pas : elles ne savent pas restreindre colonne par colonne.
3. **RLS.** Un identifiant de CV volé ne sert à rien : les politiques limitent
   chaque lecture et écriture au propriétaire.

### Mise en place

1. Créer un projet Supabase, exécuter `supabase/schema.sql` dans son éditeur SQL.
2. Renseigner les variables de `.env.example` dans Vercel.
3. Déclarer le webhook Stripe vers `https://votre-domaine/api/stripe-webhook`,
   événement `checkout.session.completed`, et reporter son secret de signature
   dans `STRIPE_WEBHOOK_SECRET`.

Sans ces variables, l'application reste utilisable comme brouillon local et
annonce clairement que le téléchargement n'est pas disponible.

## Partir d'un CV existant

Un CV **Word (.docx)** ou **PDF** déjà rédigé peut être déposé dans l'éditeur :
identité, coordonnées, expériences, formations, compétences et langues en sont
extraites. Le fichier est lu **dans le navigateur**, rien n'est envoyé nulle part.

Un CV n'a aucune structure garantie — chacun invente ses intitulés et sa
disposition. L'analyse (`src/lib/cvParser.ts`) repose donc sur deux repères
robustes : les **intitulés de rubriques** (français et anglais) et les **plages
de dates**, reconnues sous leurs formes courantes — « mars 2021 – aujourd'hui »,
« 09/2018 - 02/2021 », « 2016 – 2018 », « Depuis 2021 » — qu'elles soient seules
sur leur ligne ou suivies de l'intitulé, comme c'est fréquent sous Word.

C'est un gain de ressaisie, pas une conversion exacte : l'écran d'import affiche
le décompte de ce qui a été reconnu, section par section, et le résultat est à
relire.

> Le format **.doc** (Word 97-2003) est un binaire propriétaire illisible dans un
> navigateur. L'application le détecte et demande de réenregistrer en `.docx` ou
> d'exporter en PDF, plutôt que d'échouer sans explication.

Le texte du `.docx` est extrait avec `fflate`, déjà présent pour l'archive
LinkedIn : un `.docx` est une archive ZIP dont `word/document.xml` porte le
contenu. Aucune dépendance supplémentaire.

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
la façon de transmettre la clé se déclarent en variables d'environnement (voir
`.env.example`), ce qui permet d'en changer sans toucher au code. Les deux
conventions d'authentification du marché sont prises en charge : clé en en-tête
(`Authorization: Bearer …` par défaut) ou clé en paramètre d'URL
(`LINKEDIN_API_KEY_PARAM`), cette dernière étant celle de plusieurs
prestataires actuels. C'est
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

### Par un fichier que LinkedIn vous donne — gratuit, sans prestataire

Deux fichiers, avec un arbitrage clair entre rapidité et complétude :

| Fichier | Délai | Contenu |
| --- | --- | --- |
| **PDF du profil** — sur votre profil, *Ressources* (ou *Plus*) → *Enregistrer au format PDF* | immédiat | expériences, formations, compétences, langues — **pas les recommandations** |
| **Archive de données** — *Confidentialité des données → Obtenir une copie de vos données* | quelques minutes à 24 h | tout, **recommandations reçues comprises** |

Les deux sont lus **dans le navigateur**, rien n'est envoyé nulle part, et aucun
compte tiers n'est nécessaire.

Le PDF n'est pas un format documenté : son analyse (`src/lib/linkedinPdf.ts`)
est heuristique. Les lignes de dates servent d'ancres — chaque entrée du profil
suit la disposition « entreprise / poste / dates / lieu / description » — et
l'écran d'import affiche le décompte de ce qui a été reconnu, section par
section, pour qu'un document atypique se voie plutôt que d'être avalé en
silence. `pdfjs-dist` est chargé à la demande : il ne pèse sur le bundle que
lorsqu'un PDF est effectivement déposé.

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
  resumes.ts                  CV de l'utilisateur (liste, création, mise à jour)
  checkout.ts                 ouverture d'une session de paiement Stripe
  stripe-webhook.ts           seul chemin accordant le droit de télécharger
  cv/pdf.ts                   fabrication du PDF, après vérification du paiement
  _lib/renderResume.tsx       rendu serveur du CV en HTML
  _lib/pdf.ts                 HTML vers PDF via Chromium
  _lib/auth.ts                vérification du jeton et clients Supabase
supabase/
  schema.sql                  tables, RLS et privilèges de colonnes
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
