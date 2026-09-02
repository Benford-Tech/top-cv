import type { ReactNode } from 'react'
import { matchRoute } from './routes'
import { jobBySlug } from './content/jobs'
import { templateCopy } from './content/templates'
import type { TemplateId } from './types'
import { Landing } from './Landing'
import { JobPageView } from './pages/JobPageView'
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

  if (match.kind === 'job') {
    const job = jobBySlug(match.slug)
    if (job) return <JobPageView job={job} onStart={handlers.onStart} />
  }

  if (match.kind === 'template') {
    const copy = templateCopy(match.id as TemplateId)
    if (copy) return <TemplatePageView copy={copy} onStart={handlers.onStart} />
  }

  return <Landing onStart={handlers.onStart} onSignIn={handlers.onSignIn} />
}
