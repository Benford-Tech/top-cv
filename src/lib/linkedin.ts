import { unzipSync, strFromU8 } from 'fflate'
import type { Education, Experience, Language, Recommendation, Skill } from '../types'
import { uid } from './id'
import { pick, toRecords, type CsvRow } from './csv'

/**
 * Lecture de l'export de données LinkedIn (« Obtenir une copie de vos
 * données »). LinkedIn n'expose ni les expériences ni les recommandations par
 * son API publique — l'archive que chaque membre peut télécharger est la seule
 * source complète, et elle n'engage que l'utilisateur lui-même.
 *
 * Les intitulés de colonnes et de fichiers varient selon la version de
 * l'export et la langue du compte : tout est donc comparé de façon souple, et
 * l'écran d'import affiche ce qui a réellement été reconnu pour qu'un décalage
 * se voie au lieu de passer inaperçu.
 */
export type LinkedInImport = {
  firstName: string
  lastName: string
  /** Renseignée seulement quand l'import vient d'une URL de profil. */
  linkedinUrl: string
  headline: string
  summary: string
  city: string
  email: string
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  recommendations: Recommendation[]
  /** Noms des fichiers de l'archive effectivement exploités. */
  filesUsed: string[]
  /** Fichiers présents mais non reconnus, pour diagnostiquer un export atypique. */
  filesIgnored: string[]
}

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  janv: '01', fev: '02', mars: '03', avr: '04', mai: '05', juin: '06',
  juil: '07', aout: '08', sept: '09', octo: '10', nove: '11', dece: '12',
}

/**
 * « Mar 2021 » ou « 2021 » vers la valeur attendue par `<input type="month">`.
 * Une année seule est conservée telle quelle : les champs de formation
 * l'acceptent, et inventer un mois serait une donnée fausse.
 */
export function parseLinkedInDate(value: string): string {
  const raw = value.trim()
  if (!raw) return ''

  const isoMatch = /^(\d{4})-(\d{2})/.exec(raw)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}`

  const yearOnly = /^(\d{4})$/.exec(raw)
  if (yearOnly) return yearOnly[1]

  const textual = /^([A-Za-zÀ-ÿ]+)\.?\s+(\d{4})$/.exec(raw)
  if (textual) {
    const key = textual[1]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const month =
      MONTHS[key.slice(0, 4)] ?? MONTHS[key.slice(0, 3)] ?? MONTHS[key.slice(0, 2)]
    if (month) return `${textual[2]}-${month}`
    return textual[2]
  }

  return raw
}

/** LinkedIn ne note pas de niveau : tout arrive à 4/5, à ajuster ensuite. */
const DEFAULT_SKILL_LEVEL = 4

const PROFICIENCY: Record<string, string> = {
  nativeorbilingual: 'Langue maternelle',
  fullprofessional: 'Courant',
  professionalworking: 'Professionnel',
  limitedworking: 'Intermédiaire',
  elementary: 'Notions',
}

function readProficiency(value: string): string {
  const key = value.toLowerCase().replace(/[^a-z]/g, '')
  return PROFICIENCY[key] ?? value
}

function mapPositions(rows: CsvRow[]): Experience[] {
  return rows
    .map((row) => {
      const end = pick(row, 'Finished On', 'End Date', 'Date de fin')
      return {
        id: uid(),
        position: pick(row, 'Title', 'Intitulé du poste', 'Poste'),
        company: pick(row, 'Company Name', 'Company', 'Entreprise'),
        city: pick(row, 'Location', 'Lieu'),
        start: parseLinkedInDate(pick(row, 'Started On', 'Start Date', 'Date de début')),
        end: parseLinkedInDate(end),
        // LinkedIn laisse la date de fin vide pour un poste en cours.
        current: end.trim() === '',
        description: pick(row, 'Description'),
      }
    })
    .filter((item) => item.position || item.company)
}

function mapEducation(rows: CsvRow[]): Education[] {
  return rows
    .map((row) => ({
      id: uid(),
      degree: pick(row, 'Degree Name', 'Degree', 'Diplôme'),
      school: pick(row, 'School Name', 'School', 'Établissement'),
      city: '',
      start: parseLinkedInDate(pick(row, 'Start Date', 'Started On', 'Date de début')),
      end: parseLinkedInDate(pick(row, 'End Date', 'Finished On', 'Date de fin')),
      description: [pick(row, 'Notes'), pick(row, 'Activities')].filter(Boolean).join(' — '),
    }))
    .filter((item) => item.degree || item.school)
}

function mapSkills(rows: CsvRow[]): Skill[] {
  return rows
    .map((row) => ({
      id: uid(),
      name: pick(row, 'Name', 'Skill', 'Compétence'),
      level: DEFAULT_SKILL_LEVEL,
    }))
    .filter((item) => item.name)
}

function mapLanguages(rows: CsvRow[]): Language[] {
  return rows
    .map((row) => ({
      id: uid(),
      name: pick(row, 'Name', 'Language', 'Langue'),
      level: readProficiency(pick(row, 'Proficiency', 'Niveau')),
    }))
    .filter((item) => item.name)
}

function mapRecommendations(rows: CsvRow[]): Recommendation[] {
  return rows
    .filter((row) => {
      // Une recommandation non visible sur le profil ne doit pas atterrir sur un CV.
      const status = pick(row, 'Status', 'Statut').toUpperCase()
      return status === '' || status === 'VISIBLE'
    })
    .map((row) => ({
      id: uid(),
      author: [pick(row, 'First Name', 'Prénom'), pick(row, 'Last Name', 'Nom')]
        .filter(Boolean)
        .join(' '),
      role: [pick(row, 'Job Title', 'Poste'), pick(row, 'Company', 'Entreprise')]
        .filter(Boolean)
        .join(', '),
      text: pick(row, 'Text', 'Texte', 'Recommendation'),
    }))
    .filter((item) => item.text || item.author)
}

/** Reconnaît un fichier de l'archive quel que soit son dossier ou sa casse. */
function matches(path: string, ...names: string[]): boolean {
  const base = path.split('/').pop()?.toLowerCase().replace(/\.csv$/, '') ?? ''
  return names.some((name) => base === name || base.replace(/[_\s]/g, '') === name)
}

const EMPTY: LinkedInImport = {
  firstName: '',
  lastName: '',
  linkedinUrl: '',
  headline: '',
  summary: '',
  city: '',
  email: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  recommendations: [],
  filesUsed: [],
  filesIgnored: [],
}

/** Construit l'import à partir des fichiers CSV décodés de l'archive. */
export function readLinkedInFiles(files: Record<string, string>): LinkedInImport {
  const result: LinkedInImport = { ...EMPTY, filesUsed: [], filesIgnored: [] }

  for (const [path, content] of Object.entries(files)) {
    const rows = () => toRecords(content)
    let used = true

    if (matches(path, 'positions')) result.experiences = mapPositions(rows())
    else if (matches(path, 'education')) result.education = mapEducation(rows())
    else if (matches(path, 'skills')) result.skills = mapSkills(rows())
    else if (matches(path, 'languages')) result.languages = mapLanguages(rows())
    else if (matches(path, 'recommendationsreceived', 'recommendations_received'))
      result.recommendations = mapRecommendations(rows())
    else if (matches(path, 'profile')) {
      const row = rows()[0]
      if (row) {
        result.firstName = pick(row, 'First Name', 'Prénom')
        result.lastName = pick(row, 'Last Name', 'Nom')
        result.headline = pick(row, 'Headline', 'Titre')
        result.summary = pick(row, 'Summary', 'Résumé')
        result.city = pick(row, 'Geo Location', 'Location', 'Address', 'Adresse')
      } else used = false
    } else if (matches(path, 'emailaddresses', 'email addresses')) {
      const rowsRead = rows()
      const primary =
        rowsRead.find((row) => pick(row, 'Primary').toLowerCase().startsWith('yes')) ??
        rowsRead[0]
      result.email = primary ? pick(primary, 'Email Address', 'Adresse e-mail') : ''
    } else used = false

    if (used) result.filesUsed.push(path)
    else result.filesIgnored.push(path)
  }

  return result
}

export function isEmptyImport(data: LinkedInImport): boolean {
  return (
    data.experiences.length === 0 &&
    data.education.length === 0 &&
    data.skills.length === 0 &&
    data.languages.length === 0 &&
    data.recommendations.length === 0 &&
    !data.headline &&
    !data.summary &&
    !data.firstName
  )
}

/**
 * Point d'entrée unique de l'import : archive ZIP LinkedIn, CSV qui en sont
 * extraits, PDF de profil LinkedIn, mais aussi CV existant au format Word ou
 * PDF ordinaire — ces deux derniers passant par une analyse générique, faute
 * de structure garantie.
 */
export async function readLinkedInExport(fileList: File[]): Promise<LinkedInImport> {
  const contents: Record<string, string> = {}

  // Le PDF « Enregistrer au format PDF » suit une tout autre structure : il est
  // traité par son propre lecteur, chargé à la demande pour ne pas alourdir le
  // bundle de ceux qui déposent une archive.
  const pdf = fileList.find((file) => file.name.toLowerCase().endsWith('.pdf'))
  if (pdf) {
    const { readLinkedInPdf } = await import('./linkedinPdf')
    return readLinkedInPdf(pdf)
  }

  // Un CV existant sous Word : le document est lu puis analysé par le lecteur
  // générique, faute de structure garantie dans ce format.
  const word = fileList.find((file) => file.name.toLowerCase().endsWith('.docx'))
  if (word) {
    const [{ readDocxLines }, { parseResumeLines }] = await Promise.all([
      import('./docx'),
      import('./cvParser'),
    ])
    const parsed = parseResumeLines(await readDocxLines(word))
    parsed.filesUsed = [word.name]
    return parsed
  }

  // Le format .doc, antérieur à 2007, est un binaire propriétaire illisible
  // dans un navigateur : mieux vaut le dire que d'échouer sans explication.
  const legacy = fileList.find((file) => /\.docx?$/i.test(file.name))
  if (legacy) {
    throw new Error(
      'Le format .doc (Word 97-2003) ne peut pas être lu ici. Ouvrez le document et enregistrez-le en .docx, ou exportez-le en PDF.',
    )
  }

  for (const file of fileList) {
    if (file.name.toLowerCase().endsWith('.zip')) {
      const archive = unzipSync(new Uint8Array(await file.arrayBuffer()))
      for (const [path, bytes] of Object.entries(archive)) {
        if (path.toLowerCase().endsWith('.csv')) contents[path] = strFromU8(bytes)
      }
    } else if (file.name.toLowerCase().endsWith('.csv')) {
      contents[file.name] = await file.text()
    }
  }

  return readLinkedInFiles(contents)
}
