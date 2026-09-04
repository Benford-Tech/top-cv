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
      const paragraph = block.replace(/<\/w:p>[\s\S]*$/, '')
      // Textes, tabulations et sauts de ligne sont lus dans l'ordre du
      // document : une tabulation separe presque toujours l'intitule de sa
      // date, et elle vit entre deux `<w:t>`, pas dedans. La remplacer avant
      // d'extraire les seuls `<w:t>` la faisait disparaitre, collant la date
      // au dernier mot — « Universite Lyon 22015 - 2017 ».
      //
      // `<w:t(?:\s[^>]*)?>` et non `<w:t[^>]*>` : le second reconnait aussi
      // `<w:tab/>` comme une balise de texte ouvrante et avale le run suivant.
      const pieces = [
        ...paragraph.matchAll(/<w:(?:tab|br)\s*\/?>|<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g),
      ].map((match) => (match[1] === undefined ? ' ' : match[1]))
      return decodeEntities(pieces.join('')).replace(/\s+/g, ' ').trim()
    })
    .filter(Boolean)
}

export async function readDocxLines(file: File): Promise<string[]> {
  let archive: Record<string, Uint8Array>
  try {
    archive = unzipSync(new Uint8Array(await file.arrayBuffer()))
  } catch {
    // fflate remonte « invalid zip data » : exact, mais illisible pour qui
    // depose son CV. Un .docx est toujours une archive — si l'ouverture
    // echoue, le fichier est abime ou porte une extension qui ment.
    throw new Error(
      "Ce fichier ne s'ouvre pas comme un document Word. Il est peut-être abîmé, ou son extension .docx ne correspond pas à son contenu réel.",
    )
  }

  // Word range toujours le corps ici ; en-tetes et pieds de page vivent dans
  // d'autres fichiers, sans interet pour un CV.
  const body = archive['word/document.xml']
  if (!body) {
    throw new Error("Ce fichier n'est pas un document Word (.docx) exploitable.")
  }

  return extractDocxParagraphs(strFromU8(body))
}
