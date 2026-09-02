import { useCallback, useEffect, useState } from 'react'
import App from './App'
import { renderForPath } from './AppRoutes'
import { matchRoute } from './routes'

const EDITOR_PATH = '/editeur'

/**
 * Aiguillage entre les pages publiques et l'éditeur.
 *
 * Les liens entre pages de contenu sont de vrais liens : chaque adresse
 * correspond à un fichier HTML complet produit à la compilation, une navigation
 * classique sert donc immédiatement la bonne page. Seul le passage à l'éditeur
 * se fait sans rechargement, pour ne pas perdre l'état de saisie.
 */
export function Root() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [openAuth, setOpenAuth] = useState(false)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goToEditor = useCallback((withAuth: boolean) => {
    window.history.pushState({}, '', EDITOR_PATH)
    setOpenAuth(withAuth)
    setPath(EDITOR_PATH)
    window.scrollTo(0, 0)
  }, [])

  if (matchRoute(path).kind === 'editor') {
    return <App initialAuthOpen={openAuth} />
  }

  return renderForPath(path, {
    onStart: () => goToEditor(false),
    onSignIn: () => goToEditor(true),
  })
}
