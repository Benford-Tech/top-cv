import { renderToString } from 'react-dom/server'
import { renderForPath } from './AppRoutes'

/**
 * Rendu des pages publiques à la compilation.
 *
 * Sans cela, le HTML livré serait une coquille vide : les robots des réseaux
 * sociaux — LinkedIn, WhatsApp, Facebook, Slack — n'exécutent pas JavaScript et
 * ne verraient rien à partager, et un moteur de recherche doit alors exécuter
 * le script pour découvrir le contenu, ce qu'il fait plus tard et moins
 * fiablement. Le contenu est ici figé dans le fichier ; React reprend la main
 * par hydratation au chargement.
 */
export function renderRoute(path: string): string {
  return renderToString(
    renderForPath(path, { onStart: () => undefined, onSignIn: () => undefined }),
  )
}

export { ROUTES, SITE_TITLE, SITE_DESCRIPTION } from './routes'
export { FAQ } from './content/faq'
