import type { TemplateId } from '../types'

/**
 * Fiches par situation de candidature, et non par métier : ce qui change ici,
 * c'est la structure du CV et la manière de formuler un point délicat — absence
 * d'expérience, interruption, changement de voie.
 *
 * Ligne de conduite : aucune de ces pages ne conseille de dissimuler quoi que
 * ce soit. Un recruteur vérifie les dates, et un mensonge découvert coûte plus
 * cher que le fait qu'il masquait.
 */
export type SituationPage = {
  slug: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  /** Le renversement de perspective à opérer avant d'écrire. */
  principle: { title: string; body: string }
  /** Comment l'ordre des sections doit changer par rapport à un CV classique. */
  structure: { title: string; body: string }[]
  /** Formulations concrètes pour le passage difficile. */
  wording: { context: string; example: string }[]
  mistakes: string[]
  template: TemplateId
  templateWhy: string
}

export const SITUATION_PAGES: SituationPage[] = [
  {
    slug: 'etudiant',
    metaTitle: 'CV étudiant : que mettre quand on étudie encore',
    metaDescription:
      'Comment construire un CV étudiant : ordre des sections, jobs d’été, projets et associations. Formulations d’exemple et modèle à remplir en ligne.',
    h1: 'CV étudiant : remplir une page sans expérience professionnelle',
    intro:
      "La difficulté n'est pas d'avoir peu vécu, c'est de croire que rien ne compte. Un recruteur qui reçoit une candidature étudiante ne cherche pas dix ans de métier : il cherche des signes de sérieux, d'autonomie et de curiosité. Ces signes existent dans un parcours d'étudiant, à condition de les nommer correctement.",
    principle: {
      title: 'La formation devient la colonne vertébrale',
      body: "Sur un CV expérimenté, la formation tient trois lignes en bas de page. Sur le vôtre, elle passe en haut et se détaille : spécialisation, matières majeures, moyenne si elle est bonne, projets menés, mémoire. C'est votre matière première, traitez-la comme telle.",
    },
    structure: [
      {
        title: '1. Formation, en premier et développée',
        body: "Intitulé exact du diplôme, établissement, années, et deux ou trois lignes sur ce que vous y avez réellement fait : projet de fin d'année, spécialisation choisie, travaux notables.",
      },
      {
        title: '2. Projets, avant les jobs d’été',
        body: "Un projet universitaire mené en équipe, une application développée seul, une étude de marché réalisée pour un client réel : c'est ce qui ressemble le plus à du travail. Décrivez-les comme des expériences, avec un objectif et un résultat.",
      },
      {
        title: '3. Expériences, même sans rapport',
        body: "Caisse, service, animation, garde d'enfants : elles prouvent la ponctualité, la tenue face au public et l'endurance. Un recruteur les lit comme un signe de sérieux, pas comme un aveu.",
      },
      {
        title: '4. Engagements et centres d’intérêt',
        body: "Bureau des étudiants, club sportif, bénévolat, projet personnel suivi dans la durée. Sur un CV étudiant, cette section a un vrai poids : c'est souvent là que se voit la personnalité.",
      },
    ],
    wording: [
      {
        context: 'Un projet d’études, présenté comme une expérience',
        example:
          "Projet de fin d'année, équipe de 4 : conception d'une application de suivi de consommation électrique. Responsable de l'interface et des tests utilisateurs auprès de 12 personnes.",
      },
      {
        context: 'Un job alimentaire, valorisé sans exagération',
        example:
          "Équipier polyvalent, restauration rapide — 20 h par semaine en parallèle des cours pendant 14 mois. Service en heures de pointe, formation de 3 nouveaux équipiers.",
      },
      {
        context: 'Un engagement associatif',
        example:
          "Trésorier du bureau des étudiants : gestion d'un budget de 8 000 €, organisation de 6 événements, présentation des comptes en assemblée générale.",
      },
    ],
    mistakes: [
      "Gonfler la durée d'un stage de deux mois pour qu'il ressemble à un poste : les dates sont vérifiées, et l'écart se voit tout de suite.",
      "Écrire « aucune expérience professionnelle » : la phrase attire l'œil sur ce qui manque au lieu de montrer ce qui existe.",
      "Recopier une liste de centres d'intérêt passe-partout — lecture, voyages, cinéma — qui ne distingue de personne.",
    ],
    template: 'minimal',
    templateWhy:
      "Beaucoup d'air et une chronologie en marge : la page reste équilibrée même avec peu de contenu, là où un modèle dense soulignerait les vides.",
  },
  {
    slug: 'sans-experience',
    metaTitle: 'CV sans expérience : structurer un premier CV après le diplôme',
    metaDescription:
      'Comment faire un CV sans expérience professionnelle : quoi mettre à la place, comment ordonner les sections, quelles formulations utiliser. Modèle à remplir.',
    h1: 'CV sans expérience : montrer une capacité, pas un passé',
    intro:
      "Diplôme en poche et rien à mettre dans la case « expérience » : c'est la situation la plus décourageante à l'écriture, et la plus courante. Le recruteur qui ouvre votre CV le sait déjà — il a lu votre année de sortie. Ce qu'il cherche, ce n'est pas un passé, c'est un indice que vous serez opérationnel vite.",
    principle: {
      title: 'Remplacer l’ancienneté par la preuve',
      body: "Vous ne pouvez pas prouver par l'ancienneté ; prouvez par le concret. Un travail réalisé, un outil maîtrisé, une certification obtenue, un projet mené jusqu'au bout : chacun est une preuve vérifiable. Trois preuves valent mieux qu'une page de qualités revendiquées.",
    },
    structure: [
      {
        title: '1. Un titre qui annonce le poste visé',
        body: "Sans expérience, le titre remplace le fil rouge que l'expérience aurait donné. Écrivez l'intitulé du poste recherché, pas « jeune diplômé motivé ».",
      },
      {
        title: '2. Une accroche de trois lignes',
        body: "Ce que vous savez faire, avec quels outils, et pour quel type de poste. C'est le seul endroit où vous pouvez orienter la lecture avant que le recruteur ne constate le peu d'expérience.",
      },
      {
        title: '3. Compétences techniques, détaillées',
        body: "Outils, langages, logiciels, méthodes, certifications. Sur un CV sans expérience, cette section monte juste après l'accroche : c'est votre argument le plus solide.",
      },
      {
        title: '4. Stages, projets et travaux, traités à égalité',
        body: "Un stage de six mois, un projet de fin d'études et un travail personnel abouti peuvent figurer dans la même section, décrits de la même façon : contexte, ce que vous avez fait, résultat.",
      },
    ],
    wording: [
      {
        context: 'Une accroche qui oriente sans mentir',
        example:
          "Diplômé en génie civil, formé au calcul de structure et à la conduite de chantier lors d'un stage de 6 mois en entreprise générale. Je cherche un poste d'assistant conducteur de travaux en bâtiment.",
      },
      {
        context: 'Un stage décrit comme un vrai poste',
        example:
          "Stage de fin d'études, 6 mois — suivi quotidien d'un chantier de 3,4 M€ aux côtés du conducteur de travaux. Tenue du journal de chantier et préparation des réunions hebdomadaires.",
      },
      {
        context: 'Une compétence prouvée plutôt que déclarée',
        example:
          "Anglais professionnel — TOEIC 890, semestre d'études suivi en anglais aux Pays-Bas.",
      },
    ],
    mistakes: [
      "Aligner des qualités — dynamique, motivé, rigoureux — que tous les candidats revendiquent et qu'aucun ne démontre.",
      "Écrire une lettre de motivation déguisée en accroche : trois lignes suffisent, le reste va dans la lettre.",
      "Laisser la formation en bas de page, par mimétisme avec les CV expérimentés, alors que c'est ici l'élément le plus solide.",
    ],
    template: 'moderne',
    templateWhy:
      "Un titre en évidence et des sections nettes : la structure porte la candidature là où l'expérience ne le peut pas encore.",
  },
  {
    slug: 'alternance',
    metaTitle: 'CV pour une alternance : ce que l’entreprise regarde vraiment',
    metaDescription:
      'CV alternance et apprentissage : rythme, motivation pour le métier, sérieux scolaire. Comment structurer et formuler, avec un modèle à remplir.',
    h1: 'CV pour une alternance : rassurer sur deux points',
    intro:
      "Une entreprise qui recrute un alternant investit du temps de tutorat avant d'obtenir du travail utile. Elle se pose donc deux questions, et deux seulement : cette personne va-t-elle tenir jusqu'au bout, et sera-t-elle présente quand j'en ai besoin. Un CV d'alternance qui répond à ces deux questions passe devant les autres.",
    principle: {
      title: 'Le rythme est une information, pas un détail',
      body: "Trois jours en entreprise et deux à l'école, ou une semaine sur deux, ne s'organisent pas pareil côté employeur. Indiquez le rythme, les dates de début et de fin, et la durée du contrat, dès l'en-tête. Beaucoup de candidats l'oublient, et cela oblige le recruteur à chercher.",
    },
    structure: [
      {
        title: '1. Un en-tête qui donne le cadre',
        body: "Diplôme préparé, école, rythme d'alternance, période recherchée. Quatre informations qui permettent de dire oui ou non en dix secondes.",
      },
      {
        title: '2. La motivation pour le métier, pas pour le diplôme',
        body: "Expliquez en deux lignes pourquoi ce métier-là. Une entreprise redoute l'alternant qui subit une orientation : montrer un choix construit vous distingue immédiatement.",
      },
      {
        title: '3. Tout ce qui prouve le sérieux',
        body: "Assiduité, jobs tenus en parallèle des cours, projets menés à terme, mentions obtenues. C'est la réponse à « va-t-elle tenir jusqu'au bout ».",
      },
      {
        title: '4. Les bases techniques déjà acquises',
        body: "Même modestes. Un alternant qui connaît déjà l'outil du service économise des semaines de formation, et cela pèse dans la décision.",
      },
    ],
    wording: [
      {
        context: 'L’en-tête qui répond avant qu’on demande',
        example:
          "BTS Comptabilité et gestion en alternance — rythme 3 jours entreprise / 2 jours école, de septembre 2026 à juin 2028.",
      },
      {
        context: 'Une motivation construite, pas une formule',
        example:
          "J'ai découvert la comptabilité en tenant les comptes de l'association sportive de ma commune pendant deux ans. C'est ce qui m'a décidé à en faire mon métier.",
      },
      {
        context: 'La preuve du sérieux par les faits',
        example:
          "Emploi de 15 h par semaine en supermarché maintenu pendant les deux années de terminale, sans absence, tout en obtenant le baccalauréat avec mention.",
      },
    ],
    mistakes: [
      "Omettre le rythme et les dates, ce qui oblige l'entreprise à un aller-retour avant même d'examiner la candidature.",
      "Envoyer le même CV à trente entreprises sans adapter le titre au poste proposé.",
      "Parler uniquement du diplôme visé, jamais de ce qu'on veut apprendre en entreprise.",
    ],
    template: 'moderne',
    templateWhy:
      "Un en-tête large où le rythme et les dates tiennent en évidence, avant le détail du parcours.",
  },
  {
    slug: 'reconversion',
    metaTitle: 'CV de reconversion professionnelle : valoriser un changement de voie',
    metaDescription:
      'CV reconversion : comment relier son ancien métier au nouveau, quoi garder, quoi couper. Formulations d’exemple et modèle à remplir en ligne.',
    h1: 'CV de reconversion : faire du passé un argument',
    intro:
      "Le réflexe, en reconversion, est de cacher l'ancien métier comme une faute. C'est l'erreur : le recruteur verra les dates de toute façon, et un parcours dissimulé inquiète plus qu'il ne rassure. Le travail consiste à montrer ce que l'ancien métier vous a donné et que les candidats issus de la filière classique n'ont pas.",
    principle: {
      title: 'Un CV par compétences, pas par chronologie',
      body: "Une liste chronologique met en avant ce qui vous éloigne du poste. Une organisation par compétences met en avant ce qui vous en rapproche. Regroupez vos acquis par domaine utile au nouveau métier, puis donnez la chronologie ensuite, plus brièvement.",
    },
    structure: [
      {
        title: '1. Un titre au futur, pas au passé',
        body: "Le titre annonce le métier visé, jamais l'ancien. C'est le premier signal que la reconversion est engagée et non envisagée.",
      },
      {
        title: '2. Une accroche qui assume et relie',
        body: "Deux ou trois lignes qui nomment l'ancien métier, la formation suivie, et surtout le fil qui les relie. Un recruteur retient un parcours cohérent, pas un virage inexpliqué.",
      },
      {
        title: '3. Les compétences transférables, en évidence',
        body: "Gestion de la relation client, encadrement, gestion de budget, rigueur réglementaire, résistance à la pression : ces acquis ne s'apprennent pas en formation et vous les avez déjà.",
      },
      {
        title: '4. La formation récente et les preuves concrètes',
        body: "Certification obtenue, stage d'immersion, projet personnel, premiers travaux réalisés. Ils démontrent que le changement est déjà en cours, pas seulement souhaité.",
      },
    ],
    wording: [
      {
        context: 'Une accroche qui relie les deux métiers',
        example:
          "Douze ans d'encadrement en restauration, aujourd'hui développeur web après une formation de 9 mois. J'ai passé une décennie à tenir des délais serrés avec une équipe sous pression : c'est exactement ce que je retrouve dans la conduite d'un projet technique.",
      },
      {
        context: 'Une compétence transférable, formulée pour le nouveau métier',
        example:
          "Gestion de la relation client difficile — 8 ans en service après-vente, traitement quotidien de réclamations et de clients mécontents en face à face.",
      },
      {
        context: 'La preuve que le changement est engagé',
        example:
          "Titre professionnel de développeur web obtenu en juin 2026. Trois applications personnelles publiées depuis, dont une utilisée par 200 personnes.",
      },
    ],
    mistakes: [
      "Effacer l'ancien métier du CV : le trou chronologique attire l'attention bien plus que le métier lui-même.",
      "Présenter la reconversion comme une fuite — « lassé de mon secteur » — plutôt que comme un choix vers quelque chose.",
      "Conserver le vocabulaire de l'ancien métier, qui rend les compétences illisibles pour le nouveau recruteur.",
    ],
    template: 'colonne',
    templateWhy:
      "La colonne latérale regroupe les compétences transférables et la formation récente, laissant la colonne principale raconter le parcours dans l'ordre.",
  },
  {
    slug: 'retour-emploi',
    metaTitle: 'Trou dans le CV : comment présenter une interruption',
    metaDescription:
      'Comment expliquer une interruption sur un CV — chômage, parentalité, maladie, aidant familial. Formulations honnêtes et modèle à remplir.',
    h1: 'Une interruption dans le parcours : l’expliquer plutôt que la masquer',
    intro:
      "Une période sans emploi inquiète surtout quand elle n'est pas expliquée : le recruteur comble le silence par ses propres hypothèses, généralement moins favorables que la réalité. Une ligne sobre suffit le plus souvent à désamorcer la question. Aucun conseil de cette page ne consiste à falsifier une date : c'est vérifiable, et une omission découverte pèse plus lourd que le motif qu'elle cachait.",
    principle: {
      title: 'Nommer, en une ligne, sans se justifier',
      body: "Une interruption assumée en une ligne factuelle occupe moins de place dans la tête du lecteur qu'un blanc inexpliqué. Vous n'avez ni à détailler votre vie privée, ni à vous excuser : un motif et une période suffisent, et la loi ne vous oblige à rien de plus.",
    },
    structure: [
      {
        title: '1. Garder l’ordre chronologique',
        body: "Réorganiser le CV pour dissimuler une période produit une lecture confuse, et un recruteur habitué repère l'intention. Gardez l'ordre, et traitez la période comme les autres.",
      },
      {
        title: '2. Une ligne dédiée, au bon endroit',
        body: "À sa place chronologique, avec ses dates, un intitulé neutre et, si vous le souhaitez, ce que vous en avez fait. Elle cesse alors d'être un trou pour devenir une étape.",
      },
      {
        title: '3. Ce que la période a produit',
        body: "Formation suivie, bénévolat, remplacement ponctuel, certification passée, projet mené : mentionnez ce qui existe. S'il n'y a rien, la ligne factuelle seule fait le travail — inutile d'inventer.",
      },
      {
        title: '4. Une accroche tournée vers maintenant',
        body: "Le recruteur veut surtout savoir où vous en êtes aujourd'hui. Une accroche qui annonce votre disponibilité et votre cible replace la conversation au présent.",
      },
    ],
    wording: [
      {
        context: 'Une interruption familiale',
        example: "2023 – 2025 — Interruption d'activité pour raisons familiales. Disponible depuis janvier 2026.",
      },
      {
        context: 'Une recherche d’emploi mise à profit',
        example:
          "2024 – 2025 — Recherche d'emploi active. Formation « Gestion de la paie » suivie et validée (105 h), bénévolat au secours populaire deux demi-journées par semaine.",
      },
      {
        context: 'Une interruption pour raison de santé, sans détail médical',
        example:
          "2024 – 2025 — Interruption pour raisons de santé, aujourd'hui résolue. Reprise à temps plein possible immédiatement.",
      },
    ],
    mistakes: [
      "Ne mentionner que les années, sans les mois, pour estomper une coupure : la manœuvre est connue et éveille la méfiance.",
      "Détailler un motif médical ou personnel au-delà du nécessaire : vous n'y êtes pas tenu, et cela déplace la conversation.",
      "Laisser la période sans aucune mention en espérant qu'elle passe inaperçue : c'est justement ce qui déclenche la question en entretien, sans préparation.",
    ],
    template: 'classique',
    templateWhy:
      "Une chronologie claire et sans artifice : le meilleur moyen de montrer qu'il n'y a rien à dissimuler.",
  },
  {
    slug: 'senior',
    metaTitle: 'CV senior après 50 ans : quelle longueur, quelles dates',
    metaDescription:
      'CV senior : quelle profondeur d’historique montrer, faut-il dater ses diplômes, comment répondre aux préjugés d’âge. Exemples et modèle à remplir.',
    h1: 'CV après 50 ans : la sélection plutôt que l’exhaustivité',
    intro:
      "Un parcours de trente ans ne tient pas en deux pages, et n'a pas à y tenir. Le réflexe de tout mentionner produit un document où l'essentiel se noie, et où les premières lignes parlent d'un métier exercé il y a vingt-cinq ans. La compétence à démontrer ici est la capacité de sélectionner.",
    principle: {
      title: 'Quinze ans détaillés, le reste en résumé',
      body: "Détaillez les quinze dernières années, celles qui intéressent le poste. Regroupez le reste en deux lignes — « 1996-2008 : postes de technicien puis de chef d'équipe, secteur automobile ». Rien n'est caché, tout est hiérarchisé.",
    },
    structure: [
      {
        title: '1. Une accroche qui annonce l’apport, pas la durée',
        body: "« Trente ans d'expérience » se lit parfois comme un coût. « Responsable maintenance ayant réduit de moitié les arrêts de production sur trois sites » se lit comme un gain. Dites ce que vous apportez.",
      },
      {
        title: '2. Les postes récents, développés',
        body: "Les trois ou quatre derniers, avec résultats chiffrés. C'est là que se joue la décision, pas dans le début de carrière.",
      },
      {
        title: '3. Le début de carrière, condensé',
        body: "Deux lignes suffisent pour couvrir quinze ans anciens. La chronologie reste complète, la lecture reste rapide.",
      },
      {
        title: '4. Les signes d’actualité',
        body: "Formation récente, outil numérique maîtrisé, certification renouvelée. C'est la réponse la plus efficace au préjugé sur l'adaptabilité, parce qu'elle est factuelle et non déclarative.",
      },
    ],
    wording: [
      {
        context: 'Condenser un début de carrière',
        example:
          "1997 – 2010 — Technicien puis chef d'équipe maintenance, secteur agroalimentaire (3 employeurs successifs).",
      },
      {
        context: 'Une accroche centrée sur l’apport',
        example:
          "Responsable maintenance de sites industriels. J'ai divisé par deux les arrêts non planifiés sur deux usines en trois ans, et formé quatorze techniciens au diagnostic de premier niveau.",
      },
      {
        context: 'Montrer que la pratique est à jour',
        example:
          "Certification en gestion de maintenance assistée par ordinateur obtenue en 2025. Pilotage du passage de l'atelier au suivi numérique des interventions.",
      },
    ],
    mistakes: [
      "Détailler chaque poste depuis 1990, ce qui produit quatre pages dont les recruteurs ne liront que la première.",
      "Retirer les dates des diplômes en espérant masquer l'âge : le calcul se fait en une seconde à partir de l'expérience, et l'omission se remarque.",
      "Se présenter par sa durée de carrière plutôt que par ses résultats récents.",
    ],
    template: 'minimal',
    templateWhy:
      "Les dates en marge rendent la chronologie lisible d'un regard, ce qui permet de condenser le début de carrière sans donner l'impression d'un raccourci.",
  },
]

export function situationBySlug(slug: string): SituationPage | undefined {
  return SITUATION_PAGES.find((page) => page.slug === slug)
}
