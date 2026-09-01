import type { ComponentType } from 'react'
import type { TemplateId } from '../../../types'
import type { TemplateProps } from './parts'
import { Moderne } from './Moderne'
import { Classique } from './Classique'
import { Colonne } from './Colonne'
import { Minimal } from './Minimal'
import { Creatif } from './Creatif'

export const TEMPLATES: {
  id: TemplateId
  name: string
  description: string
  Component: ComponentType<TemplateProps>
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
]

export function templateById(id: TemplateId) {
  return TEMPLATES.find((item) => item.id === id) ?? TEMPLATES[0]
}
