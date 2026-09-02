import type { LinkedInImport } from './linkedin'
import { uid } from './id'

/**
 * Lecture du PDF que LinkedIn produit via « Enregistrer au format PDF ».
 *
 * C'est la voie gratuite immediate : contrairement a l'archive de donnees, qui
 * peut mettre jusqu'a 24 h a arriver par courriel, ce fichier se telecharge en
 * deux clics depuis son propre profil. En revanche LinkedIn n'y met pas les
 * recommandations, et la mise en forme n'est pas un format documente :
 * l'analyse ci-dessous est donc heuristique et tolerante. L'ecran d'import
 * affiche le decompte de ce qui a ete reconnu, pour qu'un document atypique se
 * voie au lieu d'etre avale en silence.
 */

/** Intitules de section, dans les deux langues d'export les plus courantes. */
const HEADINGS: Record<string, string[]> = {
  summary: ['summary', 'resume', 'a propos', 'about'],
  experience: ['experience', 'experience professionnelle'],
  education: ['education', 'formation', 'etudes'],
  skills: ['top skills', 'skills', 'competences', 'competences principales'],
  languages: ['languages', 'langues'],
  certifications: ['certifications', 'licenses & certifications'],
  contact: ['contact'],
}

/** Compare sans accents ni casse : les exports varient sur les deux. */
function normalise(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function headingFor(line: string): string | null {
  const clean = normalise(line)
  if (clean.length > 40) return null
  for (const [key, labels] of Object.entries(HEADINGS)) {
    if (labels.includes(clean)) return key
  }
  return null
}

const MONTHS: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
  janvier: '01', fevrier: '02', mars: '03', avril: '04', mai: '05', juin: '06',
  juillet: '07', aout: '08', septembre: '09', octobre: '10', novembre: '11', decembre: '12',
}

const PRESENT = /^(present|aujourd hui|actuel|a ce jour|en cours)$/

/** « March 2021 » ou « mars 2021 » vers la valeur d'un `<input type="month">`. */
function parseMoment(value: string): string {
  const text = normalise(value).replace(/[.,]/g, '')
  const withMonth = /^([a-z]+) (\d{4})$/.exec(text)
  if (withMonth) {
    const month = MONTHS[withMonth[1]]
    return month ? `${withMonth[2]}-${month}` : withMonth[2]
  }
  const yearOnly = /^(\d{4})$/.exec(text)
  return yearOnly ? yearOnly[1] : ''
}

type Range = { start: string; end: string; current: boolean }

/**
 * Reconnait une ligne de dates : « March 2021 - Present », « 2016 - 2018 »,
 * suivie eventuellement d'une duree entre parentheses que l'on ignore.
 */
function parseRange(line: string): Range | null {
  const text = line.replace(/\([^)]*\)/g, '').trim()
  const parts = text.split(/\s[-\u2013\u2014]\s/)
  if (parts.length !== 2) return null

  const start = parseMoment(parts[0])
  if (!start) return null

  const endRaw = normalise(parts[1]).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
  if (PRESENT.test(endRaw)) return { start, end: '', current: true }

  const end = parseMoment(parts[1])
  return end ? { start, end, current: false } : null
}

type Entry = { head: string[]; body: string[]; range: Range }

/**
 * Decoupe une section en entrees. Chaque entree suit la meme disposition :
 *
 *     Entreprise
 *     Intitule du poste
 *     March 2021 - Present
 *     Lyon, France
 *     description...
 *
 * Les lignes de dates servent donc d'ancres : l'en-tete d'une entree est
 * constitue des lignes qui la precedent immediatement, et son corps s'arrete
 * la ou commence l'en-tete de la suivante. Rattacher naivement tout ce qui
 * suit une date a l'entree en cours ferait disparaitre l'entreprise et le
 * poste de l'entree d'apres.
 */
const HEAD_SIZE = 2

function splitEntries(lines: string[]): Entry[] {
  const anchors: number[] = []
  lines.forEach((line, index) => {
    if (parseRange(line)) anchors.push(index)
  })

  return anchors.map((anchor, position) => {
    const previous = position === 0 ? 0 : anchors[position - 1] + 1
    const head = lines.slice(Math.max(previous, anchor - HEAD_SIZE), anchor)

    const next = anchors[position + 1]
    const bodyEnd =
      next === undefined ? lines.length : Math.max(anchor + 1, next - HEAD_SIZE)
    const body = lines.slice(anchor + 1, bodyEnd)

    return { head, body, range: parseRange(lines[anchor])! }
  })
}

function sectionise(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {}
  let current = 'header'
  for (const line of lines) {
    const heading = headingFor(line)
    if (heading) {
      current = heading
      sections[current] ??= []
      continue
    }
    sections[current] ??= []
    sections[current].push(line)
  }
  return sections
}

export function parseLinkedInPdfText(text: string): LinkedInImport {
  const lines = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    // Les pieds de page « Page 1 of 3 » fausseraient le decoupage en entrees.
    .filter((line) => line && !/^page \d+ (of|sur) \d+$/i.test(normalise(line)))

  const sections = sectionise(lines)

  const result: LinkedInImport = {
    firstName: '', lastName: '', linkedinUrl: '', headline: '', summary: '', city: '', email: '',
    experiences: [], education: [], skills: [], languages: [], recommendations: [],
    filesUsed: [], filesIgnored: [],
  }

  const header = sections.header ?? []
  if (header[0]) {
    const [first, ...rest] = header[0].split(' ')
    result.firstName = first ?? ''
    result.lastName = rest.join(' ')
  }
  if (header[1]) result.headline = header[1]
  const place = header.slice(2).find((line) => line.includes(',') && line.length < 60)
  if (place) result.city = place

  const email = lines.find((line) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(line))
  if (email) result.email = email
  const profile = lines.find((line) => /linkedin\.com\/in\//i.test(line))
  if (profile) result.linkedinUrl = profile.replace(/^\S*?(www\.linkedin)/i, '$1')

  if (sections.summary) result.summary = sections.summary.join(' ')

  for (const entry of splitEntries(sections.experience ?? [])) {
    const { head } = entry
    const body = [...entry.body]
    // LinkedIn place l'entreprise avant l'intitule du poste ; quand une seule
    // ligne precede la date, c'est le poste.
    const company = head.length >= 2 ? head[0] : ''
    const position = head.length >= 2 ? head[1] : (head[0] ?? '')
    // La premiere ligne suivant la date est souvent le lieu, pas la mission.
    const city = body[0] && body[0].length < 60 && body[0].includes(',') ? body.shift() ?? '' : ''
    result.experiences.push({
      id: uid(),
      position,
      company,
      city,
      start: entry.range.start,
      end: entry.range.end,
      current: entry.range.current,
      description: body.join('\n'),
    })
  }

  for (const entry of splitEntries(sections.education ?? [])) {
    const { head } = entry
    result.education.push({
      id: uid(),
      school: head[0] ?? '',
      degree: head.slice(1).join(' - '),
      city: '',
      start: entry.range.start,
      end: entry.range.end,
      description: '',
    })
  }

  const SEPARATORS = /\s*[\u00b7\u2022|]\s*/
  for (const line of sections.skills ?? []) {
    for (const name of line.split(SEPARATORS)) {
      if (name.trim()) result.skills.push({ id: uid(), name: name.trim(), level: 4 })
    }
  }

  for (const line of sections.languages ?? []) {
    const match = /^(.+?)\s*\(([^)]+)\)\s*$/.exec(line)
    if (match) result.languages.push({ id: uid(), name: match[1].trim(), level: match[2].trim() })
    else result.languages.push({ id: uid(), name: line, level: '' })
  }

  return result
}

/** Extrait le texte du PDF, page par page, dans l'ordre de lecture. */
export async function readLinkedInPdf(file: File): Promise<LinkedInImport> {
  // Chargement a la demande : la bibliotheque pese lourd et ne sert qu'ici.
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  const pages: string[] = []

  for (let index = 1; index <= document.numPages; index += 1) {
    const page = await document.getPage(index)
    const content = await page.getTextContent()
    let text = ''
    let lastY: number | null = null
    for (const item of content.items) {
      if (!('str' in item)) continue
      const y = item.transform[5] as number
      // Le PDF ne contient pas de retours a la ligne, seulement des positions :
      // un saut vertical marque donc une nouvelle ligne.
      if (lastY !== null && Math.abs(y - lastY) > 2) text += '\n'
      text += item.str
      lastY = y
    }
    pages.push(text)
  }

  const parsed = parseLinkedInPdfText(pages.join('\n'))
  parsed.filesUsed = [file.name]
  return parsed
}
