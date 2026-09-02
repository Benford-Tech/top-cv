import type { ReactNode } from 'react'
import { matchRoute } from './routes'
import { jobBySlug } from './content/jobs'
import { situationBySlug } from './content/situations'
import { templateCopy } from './content/templates'
import type { TemplateId } from './types'
import { Landing } from './Landing'
import { JobPageView } from './pages/JobPageView'
import { SituationPageView } from './pages/SituationPageView'
import { TemplatePageView } from './pages/TemplatePageView'

/**
 * Choisit la vue publique correspondant à un chemin. Partagée entre le rendu
 * dans le navigateur et le prérendu à la compilation : les deux ne peuvent donc
 * pas produire des pages différentes pour la même adresse.
 */
export function renderForPath(
  path: string,
  handlers: { onStart: () => void; onSignIn: () => void },
): ReactNode {
  const match = matchRoute(path)

  // Sous /cv/, un identifiant désigne soit un métier, soit une situation de
  // candidature : les deux répondent à la même forme de requête, autant les
  // ranger au même endroit.
  if (match.kind === 'job') {
    const job = jobBySlug(match.slug)
    if (job) return <JobPageView job={job} onStart={handlers.onStart} />

    const situation = situationBySlug(match.slug)
    if (situation) {
      return <SituationPageView situation={situation} onStart={handlers.onStart} />
    }
  }

  if (match.kind === 'template') {
    const copy = templateCopy(match.id as TemplateId)
    if (copy) return <TemplatePageView copy={copy} onStart={handlers.onStart} />
  }

  return <Landing onStart={handlers.onStart} onSignIn={handlers.onSignIn} />
}
