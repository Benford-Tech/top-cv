/**
 * Reconstruction du texte d'un PDF en lignes et en paragraphes.
 *
 * Un PDF ne contient ni lignes ni colonnes : seulement des fragments posés à
 * des coordonnées. Les regrouper sur la seule position verticale, comme le
 * faisait le lecteur précédent, revient à lire un CV en deux colonnes de
 * travers — les fragments de gauche et de droite qui partagent une hauteur se
 * collent bout à bout. Et un paragraphe replié sur cinq lignes en donne cinq,
 * coupées en pleine phrase.
 *
 * D'où trois passes : lignes (position verticale), colonnes (bande verticale
 * vide traversant la page), puis recollage des replis.
 */

export type TextItem = {
  str: string
  /** Coin gauche du fragment. */
  x: number
  /** Ligne de base ; croît vers le haut, comme dans le format PDF. */
  y: number
  width: number
  height: number
}

type Line = { text: string; x: number; right: number; y: number; height: number }

/** Deux fragments appartiennent à la même ligne si leurs bases se touchent. */
function groupIntoLines(items: TextItem[]): Line[] {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x)
  const lines: Line[] = []
  let current: TextItem[] = []

  const flush = () => {
    if (current.length === 0) return
    const ordered = [...current].sort((a, b) => a.x - b.x)
    let text = ''
    let previous: TextItem | null = null
    for (const item of ordered) {
      // Un blanc typographique est une position, pas un caractère : on le
      // rétablit quand deux fragments ne se touchent pas.
      if (previous) {
        const gap = item.x - (previous.x + previous.width)
        if (gap > Math.max(1, previous.height * 0.2)) text += ' '
      }
      text += item.str
      previous = item
    }
    const last = ordered[ordered.length - 1]
    lines.push({
      text: text.replace(/\s+/g, ' ').trim(),
      x: ordered[0].x,
      right: last.x + last.width,
      y: ordered[0].y,
      height: Math.max(...ordered.map((item) => item.height)) || 10,
    })
    current = []
  }

  for (const item of sorted) {
    if (current.length === 0) {
      current.push(item)
      continue
    }
    const reference = current[0]
    const tolerance = Math.max(2, Math.min(reference.height, item.height) * 0.5)
    if (Math.abs(item.y - reference.y) <= tolerance) current.push(item)
    else {
      flush()
      current.push(item)
    }
  }
  flush()

  return lines.filter((line) => line.text.length > 0)
}

/**
 * Cherche une gouttière : une bande verticale que rien ne traverse, assez
 * large et assez centrée pour séparer deux colonnes.
 *
 * Le calcul porte sur les fragments, jamais sur des lignes déjà constituées :
 * une ligne assemblée sur la seule hauteur enjambe les deux colonnes, et plus
 * aucune coupure ne paraît libre. C'est ce raisonnement à l'envers qui donnait
 * « Parties prenantes en France, US et Chine Développement commercial ».
 *
 * Rend l'abscisse de coupure, ou `null` si la page se lit d'un seul tenant.
 */
function findGutter(items: TextItem[], pageWidth: number): number | null {
  // Sous une douzaine de fragments, la page est une couverture ou un en-tête
  // isolé : y chercher des colonnes ferait plus de dégâts que de bien.
  if (items.length < 12) return null

  const left = Math.min(...items.map((item) => item.x))
  const right = Math.max(...items.map((item) => item.x + item.width))
  const span = right - left
  if (span < pageWidth * 0.4) return null

  const step = Math.max(1, span / 200)
  let best: { at: number; width: number } | null = null

  for (let at = left + span * 0.2; at <= left + span * 0.8; at += step) {
    if (items.some((item) => item.x < at && item.x + item.width > at)) continue

    const before = items.filter((item) => item.x + item.width <= at)
    const after = items.filter((item) => item.x >= at)
    // Une vraie colonne porte une part substantielle du texte ; en deçà,
    // c'est une marge, une pastille de date ou un filet décoratif.
    if (before.length < items.length * 0.15 || after.length < items.length * 0.15) continue

    const gap =
      Math.min(...after.map((item) => item.x)) -
      Math.max(...before.map((item) => item.x + item.width))
    if (gap < pageWidth * 0.02) continue
    if (!best || gap > best.width) best = { at, width: gap }
  }

  return best ? best.at : null
}

const BULLET = /^[-•·*▪◦‣–—]\s*/
/**
 * Coordonnées : une adresse, un téléphone, un profil. Ces lignes vivent seules
 * même quand la précédente paraît inachevée — sans quoi le titre du CV et la
 * ligne de contact se retrouvent soudés en une seule.
 */
const CONTACT = /@|\b(?:https?:|www\.|linkedin\.com)|(?:\D*\d){7}/
/** Fin de phrase, de titre ou d'énumération : la ligne suivante repart. */
const CLOSES = /[.!?:;)\]]$/

/**
 * Recolle les lignes d'un même paragraphe.
 *
 * Une ligne qui commence en minuscule, sans puce, après une ligne qui ne se
 * termine par aucune ponctuation forte, est la suite de la précédente. C'est
 * le cas de tous les replis d'une puce longue, que le lecteur précédent
 * livrait en morceaux — « … plan d'action…) » puis « Construire la » puis
 * « stratégie d'un nouveau modèle ».
 */
function joinWrapped(lines: string[]): string[] {
  const joined: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    const previous = joined[joined.length - 1]
    // Une ligne qui se termine sur un séparateur est manifestement inachevée,
    // quelle que soit la casse de la suivante : « … | Conduite du changement |»
    // appelle « Parties prenantes en France, US et Chine ».
    const dangling = previous !== undefined && /[|,;/–—-]$/.test(previous)
    const continues =
      previous !== undefined &&
      !BULLET.test(line) &&
      !CONTACT.test(line) &&
      !CLOSES.test(previous) &&
      previous.length > 25 &&
      // Sinon, une majuscule ou un chiffre en tête ouvre presque toujours
      // autre chose — un intitulé, une date, une rubrique.
      (dangling || /^[a-zà-ÿ(«"']/.test(line))

    if (continues) joined[joined.length - 1] = `${previous} ${line}`
    else joined.push(line)
  }

  return joined
}

/** Mentions déposées par les banques de modèles, jamais par le candidat. */
export const TEMPLATE_CREDIT =
  /^(this template was created by|template (created|designed) by|created by|designed by|conçu par|modèle (créé|conçu) par)\b|^(slidesgo|freepik|canva|storyset|flaticon|envato|slidescarnival)\b/i

/**
 * Assemble le texte lisible d'une page à partir de ses fragments.
 *
 * `pageWidth` sert à juger la largeur d'une gouttière ; passer la largeur du
 * `viewport` de la page.
 */
export function readPageText(items: TextItem[], pageWidth: number): string[] {
  const useful = items.filter((item) => item.str.trim().length > 0)
  if (useful.length === 0) return []

  const gutter = findGutter(useful, pageWidth)

  // Chaque colonne est assemblée pour elle-même, puis lue de gauche à droite :
  // c'est l'ordre de lecture, et le seul qui ne mêle pas deux rubriques.
  const lines = gutter
    ? [
        ...groupIntoLines(useful.filter((item) => item.x + item.width <= gutter)),
        ...groupIntoLines(useful.filter((item) => item.x >= gutter)),
      ]
    : groupIntoLines(useful)

  return joinWrapped(
    lines.map((line) => line.text).filter((text) => !TEMPLATE_CREDIT.test(text.trim())),
  )
}
