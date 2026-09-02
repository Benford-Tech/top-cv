import type { TemplateId } from '../types'

/**
 * Fiches éditoriales par métier. Chacune sert une page indexable : le contenu
 * doit donc être réellement distinct d'une fiche à l'autre. Des pages
 * quasi identiques seraient traitées comme du contenu dupliqué et
 * desserviraient l'ensemble du site.
 *
 * `suggestionId` relie la fiche à la bibliothèque de formulations déjà
 * embarquée dans l'éditeur : les exemples affichés sont ceux que l'utilisateur
 * retrouvera en rédigeant.
 */
export type JobPage = {
  slug: string
  suggestionId: string
  /** Titre de l'onglet et du résultat de recherche. */
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  /** Ce qu'un recruteur de ce métier cherche en premier. */
  priorities: { title: string; body: string }[]
  /** Erreurs propres à ce métier, pas des banalités transposables. */
  mistakes: string[]
  template: TemplateId
  templateWhy: string
}

export const JOB_PAGES: JobPage[] = [
  {
    slug: 'developpeur',
    suggestionId: 'dev',
    metaTitle: 'Exemple de CV développeur : structure, contenu et modèle',
    metaDescription:
      'Comment structurer un CV de développeur : mettre les technologies au bon endroit, chiffrer ses réalisations, présenter ses projets. Exemples de formulations et modèle à remplir.',
    h1: 'CV de développeur : ce qui fait la différence',
    intro:
      "Un CV de développeur est lu deux fois : d'abord par un outil de tri qui cherche des mots-clés techniques, ensuite par un pair qui veut comprendre ce que vous avez construit. Il doit satisfaire les deux, ce qui suppose des technologies nommées explicitement et des réalisations décrites par leur effet, pas par leur intitulé.",
    priorities: [
      {
        title: 'Les technologies, nommées telles quelles',
        body: "Écrivez « PostgreSQL », pas « bases de données relationnelles ». Les filtres cherchent des chaînes exactes, et un pair reconnaît immédiatement un environnement de travail. Distinguez ce que vous maîtrisez de ce que vous avez côtoyé : un recruteur technique le vérifiera en entretien.",
      },
      {
        title: 'La taille et l’effet, pas la mission',
        body: "« Développement du back-office » ne dit rien. « Refonte du back-office utilisé par 200 conseillers, temps de traitement d'un dossier ramené de 12 à 4 minutes » situe l'échelle et le résultat.",
      },
      {
        title: 'Ce que vous avez porté seul',
        body: "Dans une équipe, la contribution individuelle se perd. Précisez ce dont vous étiez responsable : une brique, une migration, une mise en production, l'accompagnement de juniors.",
      },
    ],
    mistakes: [
      "Lister trente technologies sur une échelle en étoiles : personne ne sait ce que valent quatre étoiles sur cinq en Kubernetes.",
      "Détailler les projets d'école au même niveau que l'expérience professionnelle après trois ans de métier.",
      "Omettre le lien vers le dépôt de code ou le portfolio, alors que c'est la première chose qu'un pair ira voir.",
    ],
    template: 'moderne',
    templateWhy:
      "Une colonne unique, des titres nets : le texte reste facile à analyser pour les outils de tri, qui trébuchent souvent sur les mises en page à deux colonnes.",
  },
  {
    slug: 'commercial',
    suggestionId: 'commercial',
    metaTitle: 'Exemple de CV commercial : chiffres, portefeuille et modèle',
    metaDescription:
      'Un CV commercial se juge sur les chiffres : objectifs atteints, chiffre d’affaires, portefeuille. Comment les présenter, quelles erreurs éviter, et un modèle à remplir.',
    h1: 'CV commercial : le chiffre avant le discours',
    intro:
      "C'est le métier où le CV est le plus vite jugé, et selon un critère unique : avez-vous vendu, combien, et à qui. Un CV commercial sans chiffres est lu comme un aveu. À l'inverse, trois lignes chiffrées valent une page de description de poste.",
    priorities: [
      {
        title: 'Le pourcentage d’objectif atteint',
        body: "C'est la donnée que votre futur directeur commercial cherche en premier. Indiquez-la par exercice : « 118 % de l'objectif en 2024, 104 % en 2023 ». Une progression régulière vaut mieux qu'un pic isolé.",
      },
      {
        title: 'La nature du portefeuille',
        body: "Vendre un abonnement à 40 € par mois et un contrat à 400 000 € ne sont pas le même métier. Précisez le montant moyen, le type de clients, la longueur du cycle de vente et si vous chassiez ou cultiviez.",
      },
      {
        title: 'Le secteur',
        body: "Un recruteur cherche souvent quelqu'un qui connaît déjà ses interlocuteurs. Nommez les secteurs où vous avez vendu : industrie, santé, collectivités, éditeurs de logiciels.",
      },
    ],
    mistakes: [
      "Écrire « dépassement régulier des objectifs » sans un seul pourcentage : c'est la formule qui décrédibilise tout le reste.",
      "Confondre chiffre d'affaires généré et chiffre d'affaires de l'entreprise ; un recruteur fera la différence en entretien.",
      "Passer sous silence les outils de gestion de la relation client utilisés, alors que c'est un critère de tri fréquent.",
    ],
    template: 'moderne',
    templateWhy:
      "Les dates alignées à droite et les puces courtes laissent les chiffres ressortir dès le premier coup d'œil.",
  },
  {
    slug: 'marketing',
    suggestionId: 'marketing',
    metaTitle: 'Exemple de CV marketing : budgets, canaux et résultats',
    metaDescription:
      'Comment prouver son impact sur un CV marketing : budgets pilotés, retour sur investissement, croissance d’audience. Formulations d’exemple et modèle à remplir.',
    h1: 'CV marketing : prouver l’impact, pas l’activité',
    intro:
      "Le marketing souffre d'un vocabulaire qui permet de beaucoup dire sans rien prouver. « Pilotage de la stratégie digitale » peut désigner une campagne à 2 000 € comme un budget à sept chiffres. Le CV qui convainc est celui qui remplace ces formules par des ordres de grandeur.",
    priorities: [
      {
        title: 'Le budget que vous avez tenu',
        body: "C'est l'indicateur de responsabilité le plus lisible. Un budget média annuel de 300 000 € raconte votre niveau plus sûrement qu'un intitulé de poste.",
      },
      {
        title: 'Le retour, pas seulement le volume',
        body: "Gagner des abonnés ne signifie rien seul. Reliez chaque chiffre à un effet : coût par acquisition, retour sur investissement publicitaire, part du chiffre d'affaires issue du canal.",
      },
      {
        title: 'Les canaux réellement pratiqués',
        body: "Référencement naturel, publicité payante, courriel, contenu, relations presse : dites lesquels vous avez opérés vous-même et lesquels vous avez pilotés via une agence. Ce sont deux compétences distinctes.",
      },
    ],
    mistakes: [
      "Empiler les noms d'outils sans jamais dire ce qu'ils ont produit.",
      "Revendiquer une croissance sans préciser la base de départ : passer de 100 à 300 abonnés n'est pas « +200 % d'audience » au sens où un recruteur l'entendra.",
      "Mélanger les résultats de l'équipe et les vôtres sans distinguer votre part.",
    ],
    template: 'creatif',
    templateWhy:
      "Un en-tête affirmé montre un sens du soin visuel, que ce métier valorise, tout en gardant un corps de page sobre et lisible.",
  },
  {
    slug: 'chef-de-projet',
    suggestionId: 'gestion',
    metaTitle: 'Exemple de CV chef de projet : périmètre, budget et méthodes',
    metaDescription:
      'Un CV de chef de projet se lit au périmètre : budget, taille d’équipe, nombre de projets menés. Comment le présenter, et un modèle à remplir.',
    h1: 'CV de chef de projet : montrer le périmètre',
    intro:
      "« Chef de projet » recouvre des réalités qui vont du suivi d'un site vitrine au pilotage d'un programme à plusieurs millions. Tout l'enjeu du CV est de lever cette ambiguïté dès les premières lignes, sinon le lecteur suppose le bas de la fourchette.",
    priorities: [
      {
        title: 'Budget, durée, taille d’équipe',
        body: "Ce triplet situe immédiatement votre niveau. Donnez-le pour vos deux ou trois projets les plus significatifs plutôt que d'énumérer tout ce que vous avez suivi.",
      },
      {
        title: 'Votre autorité réelle',
        body: "Encadriez-vous hiérarchiquement, ou coordonniez-vous des personnes qui ne vous étaient pas rattachées ? La seconde situation est plus difficile et mérite d'être nommée : elle démontre une capacité d'influence.",
      },
      {
        title: 'Les méthodes, sans jargon creux',
        body: "Dire « agile » ne suffit plus. Précisez le cadre, votre rôle dans les rituels, et ce que vous avez fait quand la méthode ne suffisait pas — c'est là que se juge un chef de projet.",
      },
    ],
    mistakes: [
      "Décrire la méthodologie plutôt que ce que le projet a produit pour l'entreprise.",
      "Taire les projets difficiles : un projet redressé ou arrêté à temps est une meilleure preuve de compétence qu'une série de livraisons sans accroc.",
      "Lister les certifications avant l'expérience quand on a déjà plusieurs années de métier.",
    ],
    template: 'colonne',
    templateWhy:
      "La colonne latérale regroupe outils et certifications, ce qui libère la colonne principale pour le récit des projets.",
  },
  {
    slug: 'ressources-humaines',
    suggestionId: 'rh',
    metaTitle: 'Exemple de CV ressources humaines : recrutement, paie, formation',
    metaDescription:
      'CV RH : comment présenter volumes de recrutement, périmètre administratif et sujets sociaux. Exemples de formulations et modèle à remplir.',
    h1: 'CV ressources humaines : le périmètre avant le titre',
    intro:
      "Un intitulé RH ne dit presque rien : « chargé de mission RH » peut couvrir uniquement le recrutement, ou la paie, la formation et les relations sociales à la fois. Votre CV est lu par des gens du métier qui savent que ces spécialités s'apprennent séparément — soyez explicite.",
    priorities: [
      {
        title: 'Les volumes',
        body: "Nombre de recrutements par an, effectif géré, nombre de bulletins de paie, budget de formation. Ce sont les repères qui permettent de comparer deux candidatures.",
      },
      {
        title: 'Le type de profils recrutés',
        body: "Recruter des opérateurs en intérim et des ingénieurs en tension sont deux métiers. Précisez les familles de postes, les canaux utilisés et vos délais moyens de recrutement.",
      },
      {
        title: 'Le contexte social',
        body: "Présence de représentants du personnel, accords négociés, plan de sauvegarde de l'emploi, croissance rapide : le contexte explique la difficulté réelle du poste et vaut souvent plus que l'intitulé.",
      },
    ],
    mistakes: [
      "Rester dans le vocabulaire de la « fonction support » sans jamais donner un chiffre.",
      "Négliger les outils : logiciel de paie, système de suivi des candidatures et plateforme de gestion des talents sont des critères de tri courants.",
      "Écrire un CV négligé quand on juge ceux des autres toute la journée — c'est le métier où la faute se pardonne le moins.",
    ],
    template: 'classique',
    templateWhy:
      "Une mise en page sobre et centrée, attendue dans un métier où l'on apprécie la lisibilité avant l'originalité.",
  },
  {
    slug: 'relation-client',
    suggestionId: 'client',
    metaTitle: 'Exemple de CV relation client et support : volumes et satisfaction',
    metaDescription:
      'CV conseiller clientèle ou support : comment chiffrer volumes traités, taux de résolution et satisfaction. Formulations d’exemple et modèle à remplir.',
    h1: 'CV relation client : les indicateurs parlent pour vous',
    intro:
      "C'est un métier intégralement mesuré : volume traité, délai de réponse, résolution au premier contact, satisfaction. Ces chiffres existent dans vos outils, et peu de candidats pensent à les reprendre. Les citer vous distingue immédiatement.",
    priorities: [
      {
        title: 'Volume et canal',
        body: "Cent appels par jour, quarante courriels ou dix dossiers complexes ne demandent ni le même rythme ni les mêmes qualités. Précisez le canal autant que le volume.",
      },
      {
        title: 'La satisfaction mesurée',
        body: "Note moyenne, taux de recommandation, résolution au premier contact : reprenez les indicateurs de votre service, en indiquant la base sur laquelle ils sont calculés.",
      },
      {
        title: 'La difficulté traitée',
        body: "Traiter des réclamations, gérer des clients en colère, désamorcer une résiliation : nommez ces situations. Elles distinguent un conseiller aguerri d'un débutant.",
      },
    ],
    mistakes: [
      "S'en tenir aux qualités personnelles — « à l'écoute », « patient » — que tout le monde revendique et que personne ne prouve.",
      "Oublier les langues pratiquées au téléphone, souvent décisives dans les centres de relation client.",
      "Ne pas mentionner les outils de ticketing, qui conditionnent la rapidité de prise de poste.",
    ],
    template: 'moderne',
    templateWhy:
      "Les jauges de compétence conviennent bien aux langues et aux outils, très regardés dans ce métier.",
  },
  {
    slug: 'comptable',
    suggestionId: 'compta',
    metaTitle: 'Exemple de CV comptable : portefeuille, clôtures et logiciels',
    metaDescription:
      'CV comptable ou contrôleur de gestion : nombre de dossiers, autonomie jusqu’au bilan, logiciels maîtrisés. Exemples de formulations et modèle à remplir.',
    h1: 'CV comptable : dire jusqu’où va votre autonomie',
    intro:
      "En comptabilité, la question qui décide de l'entretien est simple : jusqu'où allez-vous seul ? De la saisie à la liasse fiscale, chaque palier correspond à un niveau de poste et de rémunération. Un CV qui reste flou là-dessus se fait ranger au palier le plus bas.",
    priorities: [
      {
        title: 'Votre point d’arrêt dans la chaîne',
        body: "Saisie, rapprochements, déclarations de taxe, situations intermédiaires, bilan, liasse fiscale : dites explicitement jusqu'où vous intervenez sans supervision.",
      },
      {
        title: 'Le portefeuille ou le périmètre',
        body: "En cabinet, le nombre et la taille des dossiers. En entreprise, le chiffre d'affaires géré, le nombre d'entités et si la consolidation fait partie du travail.",
      },
      {
        title: 'Les logiciels, précisément',
        body: "Sage, Cegid, SAP ou un logiciel interne : c'est un critère de tri direct, car il conditionne le temps d'adaptation. Indiquez aussi votre niveau réel sur tableur, souvent testé.",
      },
    ],
    mistakes: [
      "Écrire « comptabilité générale » sans préciser le périmètre, ce qui oblige le recruteur à supposer le minimum.",
      "Omettre les périodes de clôture menées, alors que la capacité à tenir ces pics est exactement ce qu'on recherche.",
      "Laisser passer une faute de frappe dans un chiffre : dans ce métier, c'est disqualifiant.",
    ],
    template: 'classique',
    templateWhy:
      "Une présentation traditionnelle, sans fantaisie graphique, en phase avec les attentes des cabinets et des directions financières.",
  },
  {
    slug: 'infirmier',
    suggestionId: 'sante',
    metaTitle: 'Exemple de CV infirmier et soignant : services, actes et diplômes',
    metaDescription:
      'CV infirmier ou aide-soignant : comment présenter services fréquentés, actes techniques et diplômes. Formulations d’exemple et modèle à remplir.',
    h1: 'CV soignant : le service dit tout',
    intro:
      "Dans le soin, le CV se lit d'abord par les services traversés. Réanimation, bloc, urgences, gériatrie, psychiatrie : chacun suppose des gestes, un rythme et une charge émotionnelle différents. Un cadre de santé sait exactement ce que chaque ligne implique.",
    priorities: [
      {
        title: 'Les services et leur taille',
        body: "Nommez le service, le nombre de lits et le type d'établissement. Un service de vingt lits en centre hospitalier n'a rien à voir avec une unité de six lits en clinique.",
      },
      {
        title: 'Les diplômes et les dates',
        body: "Diplôme d'État, spécialisations, formations obligatoires à jour : ces éléments sont vérifiés, doivent être exacts et figurer haut dans la page.",
      },
      {
        title: 'Les actes techniques pratiqués',
        body: "Poses de voies, dialyse, surveillance de matériel spécifique : ces mentions permettent d'évaluer votre autonomie immédiate dans le service visé.",
      },
    ],
    mistakes: [
      "Rester dans le vocabulaire général du soin sans jamais nommer les services ni les actes.",
      "Passer sous silence l'expérience en intérim, alors qu'elle démontre une capacité d'adaptation rapide très recherchée.",
      "Négliger les disponibilités — nuits, week-ends, horaires décalés — qui conditionnent souvent l'embauche.",
    ],
    template: 'classique',
    templateWhy:
      "Une structure claire et sans effet, adaptée aux établissements de santé où les dossiers sont nombreux et lus vite.",
  },
  {
    slug: 'formateur',
    suggestionId: 'enseignement',
    metaTitle: 'Exemple de CV formateur et enseignant : publics, volumes et résultats',
    metaDescription:
      'CV formateur ou enseignant : publics accompagnés, heures animées, taux de réussite, conception pédagogique. Exemples et modèle à remplir.',
    h1: 'CV de formateur : le public avant la matière',
    intro:
      "Enseigner à des adultes en reconversion, à des apprentis ou à des cadres en entreprise ne demande pas les mêmes ressorts. Un CV de formateur qui ne dit que la matière enseignée laisse de côté ce qui intéresse le plus un responsable pédagogique : à qui vous savez parler.",
    priorities: [
      {
        title: 'Les publics accompagnés',
        body: "Âge, niveau initial, contexte — demandeurs d'emploi, salariés en formation continue, étudiants en alternance. C'est le premier critère de sélection.",
      },
      {
        title: 'Le volume et le format',
        body: "Heures animées par an, taille des groupes, présentiel ou distanciel. Ces éléments situent votre expérience réelle bien mieux qu'un nombre d'années.",
      },
      {
        title: 'Ce que vous avez conçu',
        body: "Animer un module existant et bâtir un parcours complet sont deux compétences distinctes. Si vous avez rédigé référentiels, séquences ou évaluations, dites-le : c'est plus rare et mieux valorisé.",
      },
    ],
    mistakes: [
      "Énumérer les matières sans jamais indiquer les publics ni les volumes.",
      "Oublier les résultats : taux de réussite aux certifications et évaluations des sessions sont disponibles et rarement cités.",
      "Négliger l'expérience de terrain dans le métier enseigné, qui fonde pourtant la légitimité auprès des apprenants.",
    ],
    template: 'minimal',
    templateWhy:
      "Beaucoup d'air et des dates en marge : une lecture posée, qui convient à un parcours fait de missions nombreuses.",
  },
  {
    slug: 'logistique',
    suggestionId: 'logistique',
    metaTitle: 'Exemple de CV logistique : flux, équipes et indicateurs',
    metaDescription:
      'CV logistique ou production : volumes traités, taille d’entrepôt, encadrement, taux de service et sécurité. Formulations d’exemple et modèle à remplir.',
    h1: 'CV logistique : les flux et les hommes',
    intro:
      "La logistique se juge sur deux échelles simultanées : le volume que vous faites passer, et le nombre de personnes que vous faites travailler. Un CV qui ne donne ni l'un ni l'autre oblige le recruteur à deviner, et il devine toujours à la baisse.",
    priorities: [
      {
        title: 'Le volume et la surface',
        body: "Colis ou palettes par jour, mètres carrés d'entrepôt, nombre de références gérées. Ces chiffres situent immédiatement l'échelle de vos responsabilités.",
      },
      {
        title: 'L’encadrement réel',
        body: "Nombre d'opérateurs, organisation en équipes postées, gestion des saisonniers. Encadrer trente personnes en trois-huit est une compétence en soi.",
      },
      {
        title: 'Les indicateurs tenus',
        body: "Taux de service, écarts d'inventaire, taux de fréquence des accidents, productivité par heure. Ce sont les mots du métier, et ils sont recherchés tels quels.",
      },
    ],
    mistakes: [
      "Décrire les tâches quotidiennes plutôt que les résultats obtenus sur les indicateurs.",
      "Omettre les certificats de conduite d'engins et habilitations, qui sont des conditions d'accès à certains postes.",
      "Passer sous silence les logiciels de gestion d'entrepôt, alors qu'ils déterminent le temps de prise de poste.",
    ],
    template: 'moderne',
    templateWhy:
      "Une colonne unique et des puces courtes, faciles à parcourir quand le recruteur cherche des indicateurs précis.",
  },
  {
    slug: 'restauration',
    suggestionId: 'restauration',
    metaTitle: 'Exemple de CV restauration et hôtellerie : couverts, postes, saisons',
    metaDescription:
      'CV restauration : nombre de couverts, type d’établissement, postes tenus et saisons. Exemples de formulations et modèle à remplir.',
    h1: 'CV restauration : le type d’établissement fait foi',
    intro:
      "Servir cent couverts en brasserie et quarante en gastronomique demandent des rythmes et des exigences opposés. C'est la première chose qu'un chef ou un directeur regarde : votre CV doit la donner sans qu'il ait à la chercher.",
    priorities: [
      {
        title: 'Couverts et type de maison',
        body: "Nombre de couverts par service, catégorie d'établissement, taille de la brigade. Ce triplet raconte votre expérience mieux qu'une liste de tâches.",
      },
      {
        title: 'Les postes réellement tenus',
        body: "Commis, chef de partie, chef de rang, second : nommez les postes et leur durée. La progression compte autant que le niveau atteint.",
      },
      {
        title: 'Les saisons et la disponibilité',
        body: "Saisons enchaînées, extras, coupures acceptées : dans un secteur en tension de recrutement, la disponibilité est un argument à mettre en avant, pas à cacher.",
      },
    ],
    mistakes: [
      "Aligner les employeurs sans jamais indiquer le nombre de couverts ni le type de cuisine.",
      "Présenter les contrats courts comme un défaut alors que la saisonnalité est la norme du secteur.",
      "Oublier les normes d'hygiène et les formations associées, exigées à l'embauche.",
    ],
    template: 'minimal',
    templateWhy:
      "Une présentation dépouillée qui laisse respirer un parcours composé de nombreux postes et saisons.",
  },
]

export function jobBySlug(slug: string): JobPage | undefined {
  return JOB_PAGES.find((page) => page.slug === slug)
}
