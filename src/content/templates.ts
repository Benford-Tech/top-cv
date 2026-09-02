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
]

export function templateCopy(id: TemplateId): TemplateCopy | undefined {
  return TEMPLATE_COPY.find((item) => item.id === id)
}
