import type { ComponentType } from 'react'
import type { TemplateId } from '../../../types'
import type { TemplateProps } from './parts'
import { Moderne } from './Moderne'
import { Classique } from './Classique'
import { Colonne } from './Colonne'
import { Minimal } from './Minimal'
import { Creatif } from './Creatif'
import { Elegant } from './Elegant'
import { Compact } from './Compact'
import { Technique } from './Technique'
import { Academique } from './Academique'
import { Ats } from './Ats'
import { Portrait } from './Portrait'
import { Ardoise } from './Ardoise'
import { Cartes } from './Cartes'

export const TEMPLATES: {
  id: TemplateId
  name: string
  description: string
  Component: ComponentType<TemplateProps>
  /**
   * Modèles dont la typographie fait partie du dessin : le choix de police du
   * panneau de mise en forme n'y a pas d'effet, et l'interface le dit.
   */
  fixedFont?: string
  /**
   * Raison pour laquelle un modèle n'accueille pas de photo. Renseignée, elle
   * désactive le réglage et l'explique au lieu de le laisser sans effet.
   */
  noPhoto?: string
  /** Idem pour les jauges de niveau de compétence. */
  noSkillLevels?: string
}[] = [
  {
    id: 'moderne',
    name: 'Moderne',
    description: 'Colonne unique, titres colorés — le passe-partout efficace.',
    Component: Moderne,
  },
  {
    id: 'classique',
    name: 'Classique',
    description: 'Centré et sobre, adapté aux secteurs traditionnels.',
    Component: Classique,
    noSkillLevels: 'ce modèle liste les compétences sans jauge',
  },
  {
    id: 'colonne',
    name: 'Deux colonnes',
    description: 'Bandeau latéral coloré pour les contacts et compétences.',
    Component: Colonne,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Beaucoup d’air, dates en marge, très lisible.',
    Component: Minimal,
    noSkillLevels: 'ce modèle présente les compétences en étiquettes, sans jauge',
  },
  {
    id: 'creatif',
    name: 'Créatif',
    description: 'En-tête pleine largeur et frise chronologique.',
    Component: Creatif,
  },
  {
    id: 'elegant',
    name: 'Élégant',
    description: 'Serif, capitales espacées, filets fins — allure imprimée.',
    Component: Elegant,
    fixedFont: 'une serif, qui fait tout son caractère',
    noSkillLevels: 'ce modèle énumère les compétences en ligne, sans jauge',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Deux colonnes de contenu, corps réduit : tient sur une page.',
    Component: Compact,
    noSkillLevels: 'ce modèle liste les compétences sans jauge, faute de place',
  },
  {
    id: 'technique',
    name: 'Technique',
    description: 'Rail de compétences notées, dates en chasse fixe.',
    Component: Technique,
  },
  {
    id: 'academique',
    name: 'Académique',
    description: 'Rubriques numérotées, formation avant expérience.',
    Component: Academique,
    noPhoto: 'la convention académique est un dossier sans portrait',
    noSkillLevels: 'ce modèle énumère les compétences en ligne, sans jauge',
  },
  {
    id: 'ats',
    name: 'ATS',
    description: 'Sans couleur ni icône, pensé pour les logiciels de tri.',
    Component: Ats,
    noPhoto: 'une image est invisible pour un analyseur automatique, et peut lui faire mal découper la page',
    noSkillLevels: 'une jauge n’est pas lisible par un analyseur automatique',
  },
  {
    id: 'portrait',
    name: 'Portrait',
    description: 'Photo ronde dans un bandeau coloré, contacts à côté du nom.',
    Component: Portrait,
  },
  {
    id: 'ardoise',
    name: 'Ardoise',
    description: 'Colonne anthracite pleine hauteur, l’accent en repères.',
    Component: Ardoise,
  },
  {
    id: 'cartes',
    name: 'Cartes',
    description: 'Chaque rubrique dans son cadre, sur fond gris clair.',
    Component: Cartes,
    noSkillLevels: 'ce modèle présente les compétences en étiquettes, sans jauge',
  },
]

export function templateById(id: TemplateId) {
  return TEMPLATES.find((item) => item.id === id) ?? TEMPLATES[0]
}
