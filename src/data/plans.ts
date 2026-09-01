/**
 * Formules de location d'accès. La durée est stockée en heures : c'est la seule
 * grandeur dont dépend le calcul d'expiration, le reste est de l'affichage.
 */
export type PlanId = 'jour' | 'semaine' | 'mois'

export type Plan = {
  id: PlanId
  name: string
  price: string
  /** Prix ramené à la journée, pour rendre la comparaison honnête. */
  perDay: string
  hours: number
  tagline: string
  features: string[]
  highlight?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'jour',
    name: 'Forfait journalier',
    price: '2,90 €',
    perDay: '2,90 € la journée',
    hours: 24,
    tagline: 'Une candidature à envoyer aujourd’hui',
    features: [
      'Téléchargements PDF illimités pendant 24 h',
      'Les 5 modèles et toutes les couleurs',
      'Sans reconduction : l’accès s’arrête tout seul',
    ],
    highlight: true,
  },
  {
    id: 'semaine',
    name: 'Forfait 7 jours',
    price: '7,90 €',
    perDay: '1,13 € par jour',
    hours: 24 * 7,
    tagline: 'Une série de candidatures à préparer',
    features: [
      'Téléchargements PDF illimités pendant 7 jours',
      'Les 5 modèles et toutes les couleurs',
      'Sans reconduction : l’accès s’arrête tout seul',
    ],
  },
  {
    id: 'mois',
    name: 'Forfait 30 jours',
    price: '19,90 €',
    perDay: '0,66 € par jour',
    hours: 24 * 30,
    tagline: 'Une recherche d’emploi qui s’installe',
    features: [
      'Téléchargements PDF illimités pendant 30 jours',
      'Les 5 modèles et toutes les couleurs',
      'Sans reconduction : l’accès s’arrête tout seul',
    ],
  },
]

export function planById(id: PlanId): Plan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[0]
}
