import type { PlanId } from '../data/plans'
import { planById } from '../data/plans'

const KEY = 'cv-studio:access:v1'

export type Access = {
  planId: PlanId
  /** Horodatage d'expiration, en millisecondes epoch. */
  expiresAt: number
  startedAt: number
}

/**
 * L'accès n'est vérifié que dans le navigateur : il n'y a ni compte ni serveur.
 * C'est suffisant pour matérialiser la location dans l'interface, mais ce n'est
 * pas une protection — quiconque ouvre les outils de développement peut la
 * lever. Un vrai encaissement demanderait de valider l'abonnement côté serveur.
 */
export function loadAccess(): Access | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<Access>
    if (typeof data.expiresAt !== 'number' || !data.planId) return null
    return {
      planId: data.planId,
      expiresAt: data.expiresAt,
      startedAt: typeof data.startedAt === 'number' ? data.startedAt : data.expiresAt,
    }
  } catch {
    return null
  }
}

function save(access: Access | null): void {
  try {
    if (access) localStorage.setItem(KEY, JSON.stringify(access))
    else localStorage.removeItem(KEY)
  } catch {
    /* navigation privée ou quota : la location vaut alors pour l'onglet courant */
  }
}

export function isActive(access: Access | null, now = Date.now()): boolean {
  return access !== null && access.expiresAt > now
}

/**
 * Démarre une location. Souscrire alors qu'un forfait court encore ajoute la
 * durée à la fin de l'accès en cours plutôt que de l'écraser : le temps déjà
 * payé n'est jamais perdu.
 */
export function activate(planId: PlanId, current: Access | null, now = Date.now()): Access {
  const plan = planById(planId)
  const from = isActive(current, now) ? current!.expiresAt : now
  const access: Access = {
    planId,
    startedAt: isActive(current, now) ? current!.startedAt : now,
    expiresAt: from + plan.hours * 3600_000,
  }
  save(access)
  return access
}

export function clearAccess(): void {
  save(null)
}

/** « 23 h 41 min », « 6 j 3 h » — la précision décroît quand il reste du temps. */
export function formatRemaining(ms: number): string {
  if (ms <= 0) return 'expiré'
  const minutes = Math.floor(ms / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days >= 1) return `${days} j ${hours % 24} h`
  if (hours >= 1) return `${hours} h ${minutes % 60} min`
  return `${Math.max(1, minutes)} min`
}

export function formatExpiry(expiresAt: number): string {
  return new Date(expiresAt).toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}
