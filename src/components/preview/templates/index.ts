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
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Deux colonnes de contenu, corps réduit : tient sur une page.',
    Component: Compact,
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
  },
  {
    id: 'ats',
    name: 'ATS',
    description: 'Sans couleur ni icône, pensé pour les logiciels de tri.',
    Component: Ats,
  },
]

export function templateById(id: TemplateId) {
  return TEMPLATES.find((item) => item.id === id) ?? TEMPLATES[0]
}
