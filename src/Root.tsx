import { useCallback, useEffect, useState } from 'react'
import App from './App'
import { Landing } from './Landing'

const EDITOR_PATH = '/editeur'

/**
 * Aiguillage minimal entre la page d'accueil et l'éditeur. Deux vues seulement :
 * une bibliothèque de routage complète coûterait plus qu'elle ne rapporte ici.
 * `vercel.json` renvoie les chemins inconnus vers index.html, ce qui rend
 * /editeur partageable et rechargeable.
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

  if (path.startsWith(EDITOR_PATH)) {
    return <App initialAuthOpen={openAuth} />
  }

  return <Landing onStart={() => goToEditor(false)} onSignIn={() => goToEditor(true)} />
}
