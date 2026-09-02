import { renderToString } from 'react-dom/server'
import { Landing } from './Landing'

/**
 * Rendu de la page d'accueil à la compilation.
 *
 * Sans cela, le HTML livré est une coquille vide : les robots des réseaux
 * sociaux — LinkedIn, WhatsApp, Facebook, Slack — n'exécutent pas JavaScript et
 * ne voient donc rien à partager. Le contenu est ici figé dans le fichier, et
 * React reprend la main par hydratation au chargement.
 */
export function renderLanding(): string {
  return renderToString(<Landing onStart={() => undefined} onSignIn={() => undefined} />)
}
