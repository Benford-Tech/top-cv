import type { TemplateId } from '../types'

/** Contenu éditorial des pages de modèle, distinct de la simple description. */
export type TemplateCopy = {
  id: TemplateId
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  suitedFor: string[]
  avoidIf: string
}

export const TEMPLATE_COPY: TemplateCopy[] = [
  {
    id: 'moderne',
    metaTitle: 'Modèle de CV moderne à remplir, gratuit à l’aperçu',
    metaDescription:
      'Un modèle de CV en une colonne, titres colorés, lisible par les logiciels de tri. Remplissez-le en ligne et voyez le rendu A4 en temps réel.',
    h1: 'Modèle de CV moderne',
    intro:
      "Une colonne unique, des titres soulignés d'une couleur d'accent, des dates alignées à droite. C'est la mise en page la plus sûre : elle se lit vite, et surtout elle se laisse analyser sans difficulté par les outils de tri automatique, qui trébuchent souvent sur les colonnes multiples.",
    suitedFor: [
      'Une candidature qui passera par un formulaire en ligne ou un cabinet de recrutement',
      'Les métiers techniques, où le contenu prime sur la mise en scène',
      'Un parcours dense qu’il faut faire tenir sans le tasser',
    ],
    avoidIf: 'Vous postulez dans un secteur créatif où l’on attend une signature visuelle plus affirmée.',
  },
  {
    id: 'classique',
    metaTitle: 'Modèle de CV classique et sobre à remplir en ligne',
    metaDescription:
      'Un modèle de CV centré, sobre, sans fantaisie graphique, adapté aux secteurs traditionnels. Aperçu A4 en temps réel et export PDF.',
    h1: 'Modèle de CV classique',
    intro:
      "En-tête centré, filets fins, intitulés en majuscules : cette mise en page ne cherche pas à se faire remarquer, et c'est précisément sa force. Dans les environnements où l'originalité graphique éveille la méfiance, elle inspire le sérieux.",
    suitedFor: [
      'La fonction publique, le droit, la santé, la banque et l’assurance',
      'Les cabinets comptables et les directions financières',
      'Une candidature spontanée à une maison ancienne ou familiale',
    ],
    avoidIf: 'Vous visez une jeune entreprise du numérique, où cette sobriété peut être lue comme un manque d’élan.',
  },
  {
    id: 'colonne',
    metaTitle: 'Modèle de CV deux colonnes avec bandeau latéral',
    metaDescription:
      'Un modèle de CV à colonne latérale colorée pour les contacts, compétences et langues. À remplir en ligne, aperçu A4 immédiat.',
    h1: 'Modèle de CV à deux colonnes',
    intro:
      "Un bandeau coloré rassemble contacts, compétences et langues ; la colonne principale reste entièrement disponible pour le récit du parcours. C'est la structure qui fait tenir le plus d'informations sans donner une impression d'encombrement.",
    suitedFor: [
      'Un parcours riche en outils, langues et certifications',
      'Les fonctions de pilotage, où le périmètre compte autant que les missions',
      'Une candidature envoyée directement, en PDF, à un interlocuteur identifié',
    ],
    avoidIf:
      'La candidature passe par un outil de tri automatique : certains lisent mal les mises en page à deux colonnes.',
  },
  {
    id: 'minimal',
    metaTitle: 'Modèle de CV minimaliste, dates en marge',
    metaDescription:
      'Un modèle de CV épuré, avec les dates en colonne latérale et beaucoup d’espace. Lecture posée, export PDF au texte réel.',
    h1: 'Modèle de CV minimaliste',
    intro:
      "Les dates se rangent dans une colonne étroite à gauche, le contenu respire à droite. La chronologie se lit d'un regard, ce qui rend cette mise en page particulièrement à l'aise avec les parcours faits de missions nombreuses ou courtes.",
    suitedFor: [
      'Les parcours d’indépendant, d’intérim ou de saisonnier',
      'Les profils seniors dont la chronologie est longue',
      'Les métiers où la sobriété est un signal de maturité',
    ],
    avoidIf: 'Votre parcours est encore court : l’espace disponible risque de souligner le peu de contenu.',
  },
  {
    id: 'creatif',
    metaTitle: 'Modèle de CV créatif avec en-tête pleine largeur',
    metaDescription:
      'Un modèle de CV à en-tête coloré pleine largeur et frise chronologique. À remplir en ligne, avec aperçu A4 en temps réel.',
    h1: 'Modèle de CV créatif',
    intro:
      "Un bandeau coloré pleine largeur porte l'identité, puis le parcours se déroule sur une frise verticale. La mise en page affirme un parti pris graphique tout en gardant un corps de texte parfaitement lisible — l'écueil habituel des CV dits créatifs.",
    suitedFor: [
      'Le marketing, la communication, le design et l’événementiel',
      'Les agences, où le CV est aussi une démonstration de goût',
      'Une candidature spontanée qu’il faut faire remarquer dans une pile',
    ],
    avoidIf:
      'Le secteur visé est conservateur : la couleur pleine largeur peut y être perçue comme déplacée.',
  },
  {
    id: 'elegant',
    metaTitle: 'Modèle de CV élégant en serif, à remplir en ligne',
    metaDescription:
      'Un modèle de CV en typographie serif, capitales espacées et filets fins. Allure de document imprimé, aperçu A4 en temps réel et export PDF.',
    h1: 'Modèle de CV élégant',
    intro:
      "Une serif, des capitales espacées, des filets d'un cheveu : rien ici ne vient d'un gabarit d'écran. La mise en page emprunte ses codes à l'imprimé — carton d'invitation, papier à en-tête — et cela suffit à la distinguer sans une once de couleur en aplat.",
    suitedFor: [
      'Les fonctions de direction et les postes de représentation',
      'Le luxe, l’hôtellerie, l’édition, le notariat, les métiers d’art',
      'Une candidature remise en main propre, ou imprimée pour un entretien',
    ],
    avoidIf:
      'Vous postulez dans la tech ou une jeune entreprise : la serif y paraît volontiers datée.',
  },
  {
    id: 'compact',
    metaTitle: 'Modèle de CV compact : une carrière longue sur une page',
    metaDescription:
      'Un modèle de CV à deux colonnes de contenu et corps réduit, pour faire tenir un parcours long sur une seule page. À remplir en ligne.',
    h1: 'Modèle de CV compact',
    intro:
      "Deux colonnes de contenu, pas de bandeau coloré, un interlignage serré : le parcours occupe la colonne large, la formation, les compétences et les langues se rangent dans l'étroite. C'est le modèle des carrières de quinze ans qu'un recruteur veut lire sur une page.",
    suitedFor: [
      'Les parcours de plus de dix ans, avec de nombreux postes',
      'Les candidatures où la règle de la page unique est explicite',
      'Les profils à double compétence, qui ont beaucoup à énumérer',
    ],
    avoidIf:
      'Votre parcours tient déjà largement : la densité ne rendrait service à personne, et l’air est un confort de lecture.',
  },
  {
    id: 'technique',
    metaTitle: 'Modèle de CV technique avec grille de compétences notées',
    metaDescription:
      'Un modèle de CV à rail latéral gris, compétences notées sur cinq niveaux et dates en chasse fixe. Pensé pour les profils techniques.',
    h1: 'Modèle de CV technique',
    intro:
      "Un rail gris — jamais coloré — porte les compétences, chacune notée sur cinq niveaux, et les dates s'écrivent en chasse fixe. Le recruteur technique cherche d'abord une pile technologique et un niveau de maîtrise : ils sont ici lisibles en un regard, avant même le récit des missions.",
    suitedFor: [
      'Le développement, les données, la cybersécurité, l’infrastructure',
      'Les profils dont la valeur tient d’abord à un ensemble d’outils maîtrisés',
      'Les candidatures où l’on attend une auto-évaluation explicite',
    ],
    avoidIf:
      'Vos compétences sont difficiles à noter — une note sur cinq mal calibrée se retourne contre vous en entretien technique.',
  },
  {
    id: 'academique',
    metaTitle: 'Modèle de CV académique : rubriques numérotées, formation d’abord',
    metaDescription:
      'Un modèle de CV pour l’enseignement et la recherche : rubriques numérotées, formation avant expérience, aucune fioriture. À remplir en ligne.',
    h1: 'Modèle de CV académique',
    intro:
      "La formation passe avant l'expérience et les rubriques sont numérotées : c'est la convention de l'enseignement et de la recherche, où le diplôme fonde la légitimité et où le document se lit comme un dossier. Aucune icône, aucune pastille — rien qui puisse être pris pour de l'ornement.",
    suitedFor: [
      'Les candidatures universitaires, doctorales et post-doctorales',
      'L’enseignement, la recherche publique et privée, les concours',
      'Les professions réglementées où le titre prime sur le poste',
    ],
    avoidIf:
      'Vous visez le secteur privé hors recherche : y placer la formation en tête donne l’impression d’un parcours qui n’a pas commencé.',
  },
  {
    id: 'ats',
    metaTitle: 'Modèle de CV compatible ATS, lisible par les logiciels de tri',
    metaDescription:
      'Un modèle de CV sans couleur, sans icône et sur une seule colonne, conçu pour être analysé sans erreur par les logiciels de tri de candidatures.',
    h1: 'Modèle de CV compatible ATS',
    intro:
      "Une colonne, aucune couleur, aucune icône, des puces qui sont de vrais tirets et des intitulés de rubrique en mots courants. Tout ce qui fait trébucher un analyseur automatique — colonnes multiples, texte en image, glyphes exotiques, information portée par une couleur — est ici absent par construction.",
    suitedFor: [
      'Les candidatures déposées dans un formulaire ou un portail d’emploi',
      'Les grands groupes et les cabinets qui présélectionnent par logiciel',
      'Un envoi en nombre, où l’on ne sait pas ce qui lira le document',
    ],
    avoidIf:
      'Le CV part directement à une personne identifiée : cette austérité n’apporte alors rien, et un modèle plus soigné servira mieux.',
  },
  {
    id: 'portrait',
    metaTitle: 'Modèle de CV avec photo dans un bandeau coloré',
    metaDescription:
      'Un modèle de CV à photo ronde dans un bandeau coloré, nom et coordonnées à côté. À remplir en ligne, aperçu A4 en temps réel et export PDF.',
    h1: 'Modèle de CV avec photo',
    intro:
      "La photo, ronde, occupe le bandeau coloré avec le nom, le titre et les coordonnées ; le corps du CV démarre ensuite sur fond blanc, en une colonne. C'est la disposition la plus répandue des banques de modèles françaises, et celle qu'un recruteur reconnaît sans avoir à la déchiffrer.",
    suitedFor: [
      'Les métiers de contact : commerce, accueil, santé, immobilier',
      'Une candidature en France, où la photo reste d’usage courant',
      'Les profils juniors, à qui un visage donne une présence que le parcours n’a pas encore',
    ],
    avoidIf:
      'Vous postulez au Royaume-Uni, en Irlande ou en Amérique du Nord : la photo y est déconseillée, parfois écartée d’office pour prévenir les discriminations.',
  },
  {
    id: 'ardoise',
    metaTitle: 'Modèle de CV à colonne sombre, sobre et contrasté',
    metaDescription:
      'Un modèle de CV à colonne anthracite pleine hauteur, la couleur d’accent réduite aux repères. À remplir en ligne, export PDF au texte réel.',
    h1: 'Modèle de CV à colonne sombre',
    intro:
      "Une colonne anthracite tient toute la hauteur — photo, coordonnées, compétences, langues — et la couleur d'accent ne sert plus qu'aux repères. Le contraste est fort sans être criard, là où un aplat vif sur toute une page se défend mal dans les secteurs sobres.",
    suitedFor: [
      'Le conseil, la finance, l’industrie, l’ingénierie',
      'Les profils confirmés qui veulent du caractère sans couleur vive',
      'Une candidature lue à l’écran plutôt qu’imprimée',
    ],
    avoidIf:
      'Le CV sera imprimé en nombre : un aplat sombre pleine hauteur consomme beaucoup d’encre et grise à la photocopie.',
  },
  {
    id: 'cartes',
    metaTitle: 'Modèle de CV en cartes : chaque rubrique dans son cadre',
    metaDescription:
      'Un modèle de CV où chaque rubrique occupe son propre cadre, sur fond gris clair. Lecture par blocs, à remplir en ligne avec aperçu A4.',
    h1: 'Modèle de CV en cartes',
    intro:
      "Chaque rubrique occupe son cadre, posé sur un fond gris clair. La lecture se fait par blocs : l'œil saute d'un cadre à l'autre au lieu de descendre une colonne, ce qui aide quand les rubriques sont nombreuses et de longueurs inégales.",
    suitedFor: [
      'Les parcours composites : missions, projets, bénévolat, certifications',
      'Les profils en reconversion, dont les rubriques ne se suivent pas naturellement',
      'Les candidatures dans le numérique et les services, habitués à cette grammaire visuelle',
    ],
    avoidIf:
      'Votre CV tient en trois rubriques courtes : les cadres paraîtront alors une décoration sans objet.',
  },
]

export function templateCopy(id: TemplateId): TemplateCopy | undefined {
  return TEMPLATE_COPY.find((item) => item.id === id)
}
