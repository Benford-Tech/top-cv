import { unzipSync, strFromU8 } from 'fflate'

/**
 * Extraction du texte d'un document Word (.docx).
 *
 * Un .docx est une archive ZIP dont `word/document.xml` porte le contenu :
 * fflate, deja embarque pour l'archive LinkedIn, suffit donc a l'ouvrir, sans
 * ajouter de dependance. On ne cherche pas a restituer la mise en forme, mais
 * l'ordre et le decoupage en paragraphes, seuls elements exploitables pour
 * reconnaitre la structure d'un CV.
 */

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(parseInt(code.slice(2), 16))
    }
    if (code.startsWith('#')) return String.fromCodePoint(Number(code.slice(1)))
    return ENTITIES[code.toLowerCase()] ?? whole
  })
}

/** Rend les paragraphes du document, dans l'ordre, vides exclus. */
export function extractDocxParagraphs(xml: string): string[] {
  return xml
    .split(/<w:p[\s>]/)
    .slice(1)
    .map((block) => {
      // Tabulations et sauts de ligne internes deviennent des espaces : ils
      // separent souvent une date de l'intitule sur la meme ligne.
      const spaced = block
        .replace(/<w:tab\s*\/?>/g, ' ')
        .replace(/<w:br\s*\/?>/g, ' ')
        .replace(/<\/w:p>[\s\S]*$/, '')
      const runs = [...spaced.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((match) => match[1])
      return decodeEntities(runs.join('')).replace(/\s+/g, ' ').trim()
    })
    .filter(Boolean)
}

export async function readDocxLines(file: File): Promise<string[]> {
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()))

  // Word range toujours le corps ici ; en-tetes et pieds de page vivent dans
  // d'autres fichiers, sans interet pour un CV.
  const body = archive['word/document.xml']
  if (!body) {
    throw new Error("Ce fichier n'est pas un document Word (.docx) exploitable.")
  }

  return extractDocxParagraphs(strFromU8(body))
}
