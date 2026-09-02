import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Root } from './Root'
import './index.css'

const container = document.getElementById('root')!
const tree = (
  <StrictMode>
    <Root />
  </StrictMode>
)

/**
 * La page d'accueil est écrite dans le fichier à la compilation : on l'hydrate
 * au lieu de la reconstruire, pour que le contenu déjà affiché ne clignote pas.
 * Les autres chemins reçoivent ce même HTML par la réécriture Vercel, mais
 * doivent rendre autre chose : on repart alors d'un conteneur vide.
 */
// Toutes les pages publiques sont écrites dans le fichier à la compilation :
// elles s'hydratent. Seul l'éditeur, qui reçoit le HTML d'une autre page par la
// réécriture, doit repartir d'un conteneur vide.
const isPrerendered = !window.location.pathname.startsWith('/editeur')

if (isPrerendered && container.firstChild) {
  hydrateRoot(container, tree)
} else {
  container.innerHTML = ''
  createRoot(container).render(tree)
}
