import { JOB_PAGES } from './content/jobs'
import { SITUATION_PAGES } from './content/situations'
import { TEMPLATE_COPY } from './content/templates'

export const SITE_TITLE = 'CV Studio — créez un CV professionnel et téléchargez-le en PDF'
export const SITE_DESCRIPTION =
  'Éditeur de CV en ligne : aperçu A4 en temps réel, 5 modèles, import de votre profil LinkedIn (recommandations comprises) et export PDF au texte réel, lisible par les logiciels de tri des recruteurs.'

export type RouteMeta = {
  path: string
  title: string
  description: string
  /** Poids relatif dans le plan du site. */
  priority: number
}

/**
 * Table des pages indexables. Elle sert à la fois au rendu côté navigateur, au
 * prérendu à la compilation et au plan du site : une seule liste à tenir, donc
 * aucune page publiée sans métadonnées ni oubliée du sitemap.
 */
export const ROUTES: RouteMeta[] = [
  { path: '/', title: SITE_TITLE, description: SITE_DESCRIPTION, priority: 1 },
  ...JOB_PAGES.map((job) => ({
    path: `/cv/${job.slug}`,
    title: job.metaTitle,
    description: job.metaDescription,
    priority: 0.8,
  })),
  ...SITUATION_PAGES.map((situation) => ({
    path: `/cv/${situation.slug}`,
    title: situation.metaTitle,
    description: situation.metaDescription,
    priority: 0.8,
  })),
  ...TEMPLATE_COPY.map((template) => ({
    path: `/modeles/${template.id}`,
    title: template.metaTitle,
    description: template.metaDescription,
    priority: 0.7,
  })),
]

export type Match =
  | { kind: 'landing' }
  | { kind: 'editor' }
  | { kind: 'job'; slug: string }
  | { kind: 'template'; id: string }

export function matchRoute(pathname: string): Match {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path.startsWith('/editeur')) return { kind: 'editor' }
  const job = /^\/cv\/([a-z0-9-]+)$/.exec(path)
  if (job) return { kind: 'job', slug: job[1] }
  const template = /^\/modeles\/([a-z0-9-]+)$/.exec(path)
  if (template) return { kind: 'template', id: template[1] }
  return { kind: 'landing' }
}
