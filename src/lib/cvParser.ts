import type { LinkedInImport } from './linkedin'
import { uid } from './id'
import { TEMPLATE_CREDIT } from './pdfText'

/**
 * Analyse d'un CV existant, quel que soit son origine : document Word, ou PDF
 * qui ne vient pas de LinkedIn.
 *
 * Contrairement a l'export LinkedIn, un CV n'a aucune structure garantie :
 * chacun invente ses intitules, son ordre et sa disposition. L'analyse ne peut
 * donc etre que du meilleur effort. Elle vise ce qui fait gagner le plus de
 * temps a la ressaisie — identite, coordonnees, blocs d'experience et de
 * formation reperes par leurs dates, competences et langues — et l'ecran
 * d'import montre ce qui a ete reconnu pour que l'utilisateur corrige le reste.
 */

type Section =
  | 'header'
  | 'profile'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'other'

/** Intitules de rubriques rencontres sur les CV francais et anglais. */
const HEADINGS: [Section, string[]][] = [
  ['profile', ['profil', 'a propos', 'resume', 'presentation', 'objectif', 'accroche', 'summary', 'about', 'profile', 'objective']],
  ['experience', ['experience', 'experiences', 'experience professionnelle', 'experiences professionnelles', 'parcours professionnel', 'parcours', 'emplois', 'work experience', 'employment', 'professional experience']],
  ['education', ['formation', 'formations', 'etudes', 'diplomes', 'parcours academique', 'scolarite', 'education', 'academic background']],
  ['skills', ['competences', 'competence', 'competences techniques', 'savoir faire', 'skills', 'technical skills', 'core skills']],
  ['languages', ['langues', 'languages', 'language']],
  ['other', ['centres d interet', 'centre d interet', 'loisirs', 'interets', 'hobbies', 'interests', 'certifications', 'references', 'divers']],
]

function normalise(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Une rubrique dont l'intitule ne figure pas dans la liste ci-dessus.
 *
 * Sans cette reconnaissance, « EXTRA-CURRICULUM » et tout ce qui le suit
 * s'ajoutaient aux competences, jauge comprise. Un CV comporte toujours des
 * rubriques qu'aucune liste ne prevoit ; ce qu'il faut reconnaitre, c'est
 * qu'une rubrique commence, pas laquelle.
 *
 * Prudence assumee : capitales, plusieurs mots, ni chiffre ni virgule ni
 * barre oblique. Un intitule de rubrique est presque toujours de cette forme,
 * et une competence isolee — « SQL », « HTML/CSS » — presque jamais. Le prix
 * de l'erreur reste une competence perdue au lieu d'une rubriquee entiere
 * deversee dans une autre.
 */
function looksLikeHeading(line: string): boolean {
  if (line.length < 6 || line.length > 45) return false
  if (/[\d,/]/.test(line)) return false
  if (!/[\s-]/.test(line.trim())) return false
  return line === line.toUpperCase() && /[A-ZÀ-Þ]/.test(line)
}

function headingFor(line: string): Section | null {
  if (line.length > 45) return null
  const clean = normalise(line)
  if (!clean) return null
  for (const [section, labels] of HEADINGS) {
    if (labels.includes(clean)) return section
  }
  return looksLikeHeading(line) ? 'other' : null
}

const MONTHS: Record<string, string> = {
  janvier: '01', fevrier: '02', mars: '03', avril: '04', mai: '05', juin: '06',
  juillet: '07', aout: '08', septembre: '09', octobre: '10', novembre: '11', decembre: '12',
  janv: '01', fevr: '02', avr: '04', juil: '07', sept: '09', oct: '10', nov: '11', dec: '12',
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
  jan: '01', feb: '02', mar: '03', apr: '04', jun: '06', jul: '07', aug: '08',
}

/**
 * Uniformise les caracteres que Word substitue en cours de frappe.
 *
 * La correction automatique remplace l'apostrophe droite par une courbe :
 * « Aujourd’hui » ne repondait donc a aucun motif ecrit avec « aujourd'hui »,
 * et une experience en cours disparaissait entierement de l'import. Les espaces
 * insecables, eux, cassaient les separations sur l'espace.
 */
function tidy(line: string): string {
  return line
    .replace(/[\u2018\u2019\u201b\u02bc]/g, "'")
    .replace(/[\u00a0\u202f\u2007\u2009]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const ACCENTS: Record<string, string> = {
  a: 'aàâä', e: 'eéèêë', i: 'iîï', o: 'oôö', u: 'uùûü', c: 'cç',
}

/** « fevrier » -> « f[eéèêë]vri[eéèêë]r » : le mois s'ecrit accentue sur un CV. */
function accentTolerant(word: string): string {
  return [...word].map((letter) => (ACCENTS[letter] ? `[${ACCENTS[letter]}]` : letter)).join('')
}

/**
 * Alternative des noms de mois, du plus long au plus court pour que
 * « septembre » l'emporte sur « sept ».
 */
const MONTH_PATTERN = Object.keys(MONTHS)
  .sort((a, b) => b.length - a.length)
  .map(accentTolerant)
  .join('|')

const NOW = /^(aujourd hui|present|actuel|actuelle|en cours|a ce jour|now|current)$/

/** Rend « 2021-03 » pour un mois, « 2021 » pour une annee seule, sinon ''. */
function moment(value: string): string {
  const text = normalise(value)
  if (!text) return ''

  const slash = /^(\d{1,2}) (\d{4})$/.exec(text)
  if (slash) return `${slash[2]}-${slash[1].padStart(2, '0')}`

  const named = /^([a-z]+) (\d{4})$/.exec(text)
  if (named) {
    const month = MONTHS[named[1]]
    return month ? `${named[2]}-${month}` : named[2]
  }

  const year = /^(\d{4})$/.exec(text)
  return year ? year[1] : ''
}

export type DateRange = { start: string; end: string; current: boolean; rest: string }

/**
 * Cherche une plage de dates n'importe ou dans la ligne et rend ce qui reste.
 *
 * Les deux dispositions courantes sont couvertes : la date sur sa propre ligne
 * (« mars 2021 - aujourd'hui »), et la date en tete de ligne suivie de
 * l'intitule (« 2019 - 2022 : Chef de projet, Acme »), frequente sur les CV
 * rediges sous Word.
 */
export function findRange(line: string): DateRange | null {
  // Le nom de mois est valide contre la table, jamais pris pour un mot
  // quelconque : « Acme 2019 » se lisait sinon comme une date, et l'employeur
  // partait avec elle.
  const token = String.raw`(?:\d{1,2}[/.]\d{4}|(?:${MONTH_PATTERN})\.?\s+\d{4}|\d{4})`
  const tail = String.raw`(?:${token}|aujourd'hui|pr[ée]sent|actuel(?:le)?|en cours|[àa] ce jour|now|current|present)`
  const pattern = new RegExp(
    String.raw`(?:depuis\s+(${token}))|(${token})\s*(?:[-–—]|\bau?\b|\bto\b)\s*(${tail})`,
    'i',
  )
  // `tidy` ici aussi : la fonction est exportee et sert au lecteur de PDF, qui
  // ne passe pas forcement par `parseResumeLines`. Une apostrophe courbe ne
  // doit pas dependre de qui appelle.
  const match = pattern.exec(tidy(line))
  if (!match) return null

  // Seuls les separateurs de bordure sautent. Les retirer partout, comme
  // auparavant, effacait le tiret sur lequel « Chef de projet — Acme » se
  // coupe en intitule et employeur.
  const rest = tidy(line)
    .replace(match[0], ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s:|,;·–—-]+/, '')
    .replace(/[\s:|,;·–—-]+$/, '')
    .trim()

  // « Depuis 2021 » : un seul repere, poste en cours.
  if (match[1]) {
    const start = moment(match[1].replace(/[/.]/g, ' '))
    return start ? { start, end: '', current: true, rest } : null
  }

  const start = moment(match[2].replace(/[/.]/g, ' '))
  if (!start) return null

  const endRaw = match[3]
  if (NOW.test(normalise(endRaw))) return { start, end: '', current: true, rest }

  const end = moment(endRaw.replace(/[/.]/g, ' '))
  return end ? { start, end, current: false, rest } : null
}

/**
 * Coupe « Chef de projet chez Acme » ou « Master de gestion, Universite Lyon 2 »
 * en intitule et employeur. La virgule ne demande pas d'espace avant elle : sur
 * un CV elle est collee au mot precedent.
 */
function splitRole(text: string): { position: string; company: string } {
  const cut = /\s+(?:chez|at|@)\s+|\s*[—–|]\s+|,\s+/.exec(text)
  if (!cut) return { position: text.trim(), company: '' }
  return {
    position: text.slice(0, cut.index).trim(),
    company: text.slice(cut.index + cut[0].length).trim(),
  }
}

/** Formats francais et internationaux : +33 6 12 34 56 78, 06.12.34.56.78, (0)6… */
const PHONE = /(?:\+|00)?\d[\d\s().-]{8,18}\d/

/** Une ligne de descriptif, jamais un intitule de poste. */
const BULLET = /^[-•·*▪◦–—]\s/

/** Formes juridiques : « Acme, Inc. » n'est pas une entreprise a Inc. */
const LEGAL = /^(inc|llc|ltd|sa|sas|sasu|sarl|eurl|gmbh|ag|bv|nv|spa|srl|plc|corp|co|group|groupe|company|cie)\.?$/i

/**
 * Detache la ville collee a l'employeur (« Groupe Verlaine, Lyon »).
 *
 * Prudent par construction : un seul segment, apres la derniere virgule, court,
 * capitalise, sans chiffre et sans forme juridique. Au moindre doute la chaine
 * reste entiere — une ville manquante se corrige d'un coup d'oeil, un employeur
 * ampute non.
 */
export function splitCity(value: string): { value: string; city: string } {
  const at = value.lastIndexOf(',')
  if (at < 0) return { value, city: '' }

  const head = value.slice(0, at).trim()
  const tail = value.slice(at + 1).trim()
  if (!head || !tail) return { value, city: '' }
  if (tail.length > 30 || /\d/.test(tail)) return { value, city: '' }
  if (!/^[A-ZÀ-Þ]/.test(tail)) return { value, city: '' }

  const words = tail.split(/\s+/)
  if (words.length > 3 || words.some((word) => LEGAL.test(word))) return { value, city: '' }

  return { value: head, city: tail }
}

const LIST_SEPARATOR = /\s*[,;·•|]\s*/

const EMPTY: LinkedInImport = {
  firstName: '', lastName: '', linkedinUrl: '', headline: '', summary: '', city: '', email: '', phone: '',
  experiences: [], education: [], skills: [], languages: [], recommendations: [],
  filesUsed: [], filesIgnored: [],
}

export function parseResumeLines(input: string[]): LinkedInImport {
  // Les mentions des banques de modeles (« This template was created by
  // Slidesgo ») sont ecartees avant toute analyse : posees en tete de page,
  // elles etaient prises pour le nom du candidat.
  const lines = input.map(tidy).filter((line) => line && !TEMPLATE_CREDIT.test(line))

  const result: LinkedInImport = {
    ...EMPTY,
    experiences: [], education: [], skills: [], languages: [], recommendations: [],
    filesUsed: [], filesIgnored: [],
  }

  // --- Coordonnees, cherchees dans tout le document -------------------------
  const whole = lines.join('\n')
  const email = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.exec(whole)
  if (email) result.email = email[0]
  const profile = /(?:www\.)?linkedin\.com\/in\/[\w-]+/i.exec(whole)
  if (profile) result.linkedinUrl = profile[0]

  // --- Decoupage en rubriques ----------------------------------------------
  const sections = new Map<Section, string[]>()
  let current: Section = 'header'
  for (const line of lines) {
    const heading = headingFor(line)
    if (heading) {
      current = heading
      if (!sections.has(current)) sections.set(current, [])
      continue
    }
    if (!sections.has(current)) sections.set(current, [])
    sections.get(current)!.push(line)
  }

  // --- Identite : premieres lignes avant toute rubrique ---------------------
  const header = sections.get('header') ?? []
  const nameLine = header.find(
    (line) => /^[^\d@]{3,60}$/.test(line) && line.split(' ').length <= 5,
  )
  if (nameLine) {
    const [first, ...rest] = nameLine.split(' ')
    result.firstName = first
    result.lastName = rest.join(' ')
    const after = header[header.indexOf(nameLine) + 1]
    if (after && !/@|\d{4}/.test(after) && after.length < 80) result.headline = after
  }
  // Une adresse postale complete n'est pas une ville : le champ du CV attend
  // « Lyon », pas « 12 rue des Lilas, 69003 Lyon ».
  const address = header.find(
    (line) => /\b\d{5}\b/.test(line) || (line.includes(',') && line.length < 50),
  )
  if (address) {
    const postal = /\b\d{5}\b\s+([^,;|]+)/.exec(address)
    result.city = postal ? postal[1].trim() : address
  }

  // Le telephone ne figure pas dans un export LinkedIn ; sur un CV, si. Cherche
  // dans le seul en-tete, ou il vit, et exige assez de chiffres pour ne pas
  // confondre avec une annee ou un montant.
  for (const line of header) {
    const found = PHONE.exec(line)
    if (found && (found[0].match(/\d/g) ?? []).length >= 9) {
      result.phone = found[0].trim()
      break
    }
  }

  const profileLines = sections.get('profile')
  if (profileLines?.length) result.summary = profileLines.join(' ')

  // --- Experiences et formations, ancrees sur les dates ---------------------
  type Entry = {
    /** Ce que portait la ligne de dates, une fois la date retiree. */
    dated: string
    /** Lignes situees au-dessus de la date, la plus proche en dernier. */
    above: string[]
    body: string[]
    range: DateRange
  }

  function collect(section: Section): Entry[] {
    const source = sections.get(section) ?? []
    const entries: Entry[] = []
    let buffer: string[] = []

    for (const [index, line] of source.entries()) {
      const range = findRange(line)
      if (!range) {
        const last = entries[entries.length - 1]
        // Une ligne ordinaire suivie d'une ligne de dates annonce l'entrée
        // suivante, ce n'est pas la fin du descriptif de la précédente :
        // « Consultante junior » puis « ACCENTURE, Paris | sept. 2016 … ».
        // Sans ce regard en avant, l'intitulé du poste suivant se retrouvait
        // noyé dans la description du précédent, qui gardait le nom de
        // l'employeur pour intitulé.
        const next = source[index + 1]
        if (!BULLET.test(line) && next && findRange(next)) {
          buffer.push(line)
          continue
        }
        // Une date seule sur sa ligne, l'intitule juste en dessous : c'est la
        // disposition la plus repandue sous Word. Tant que l'entree ouverte
        // n'a rien pour se nommer, la premiere ligne qui suit en tient lieu —
        // sauf une puce, qui appartient toujours au descriptif.
        if (last && !last.dated && last.above.length === 0 && !BULLET.test(line)) {
          last.above.push(line)
          continue
        }
        if (last && buffer.length === 0) {
          last.body.push(line)
          continue
        }
        buffer.push(line)
        continue
      }
      entries.push({ dated: range.rest, above: buffer, body: [], range })
      buffer = []
    }
    return entries
  }

  /**
   * Repartit intitule et employeur entre la ligne de dates et celles qui la
   * precedent.
   *
   * Quand les deux existent — « Consultante en strategie » au-dessus de
   * « WAVESTONE - Consulting ... | fevr. 2018 - mars 2021 » —, la ligne du
   * dessus est l'intitule et la ligne datee porte l'employeur. Les prendre
   * toutes deux depuis la ligne datee, comme auparavant, faisait de
   * « WAVESTONE » le poste et jetait le vrai intitule.
   */
  function nameEntry(entry: Entry): { title: string; org: string } {
    const closest = entry.above[entry.above.length - 1] ?? ''

    if (entry.dated && closest) {
      // Sur la ligne datee, seul le premier segment nomme l'employeur : le
      // reste le decrit (« WAVESTONE - Consulting en management »).
      const { position } = splitRole(entry.dated)
      return { title: closest, org: position || entry.dated }
    }

    const { position, company } = splitRole(entry.dated || closest)
    return { title: position, org: company || entry.above[0] || '' }
  }

  for (const entry of collect('experience')) {
    const { title, org } = nameEntry(entry)
    const employer = splitCity(org)
    result.experiences.push({
      id: uid(),
      position: title,
      company: employer.value,
      city: employer.city,
      start: entry.range.start,
      end: entry.range.end,
      current: entry.range.current,
      description: entry.body.join('\n'),
    })
  }

  for (const entry of collect('education')) {
    const { title, org } = nameEntry(entry)
    const school = splitCity(org)
    result.education.push({
      id: uid(),
      degree: title,
      school: school.value,
      city: school.city,
      start: entry.range.start,
      end: entry.range.end,
      description: entry.body.join('\n'),
    })
  }

  // --- Competences et langues ----------------------------------------------
  for (const line of sections.get('skills') ?? []) {
    for (const chunk of line.replace(/^[-•·]\s*/, '').split(LIST_SEPARATOR)) {
      // « HTML/CSS/JS » enumere trois competences ; « Gestion de projet /
      // programme » n'en nomme qu'une. La barre oblique ne separe donc que
      // lorsqu'elle est collee, sans espace autour.
      const pieces = /\s/.test(chunk.trim()) ? [chunk] : chunk.split('/')
      for (const piece of pieces) {
        const clean = piece.trim()
        if (clean && clean.length < 60) result.skills.push({ id: uid(), name: clean, level: 4 })
      }
    }
  }

  for (const line of sections.get('languages') ?? []) {
    for (const chunk of line.split(/\s*[;·•|]\s*/)) {
      const clean = chunk.replace(/^[-•·]\s*/, '').trim()
      if (!clean) continue
      // Trois ecritures courantes : « Anglais : courant », « Anglais (C1) »,
      // « Anglais - courant ». Le niveau est tout ce qui suit, parentheses
      // englobantes retirees seulement si elles encadrent l'ensemble.
      const colon = /^([^:]+):\s*(.+)$/.exec(clean)
      const paren = /^(.+?)\s*\((.+)\)$/.exec(clean)
      const dash = /^(.+?)\s+[-–—]\s+(.+)$/.exec(clean)
      const found = colon ?? paren ?? dash
      if (found) result.languages.push({ id: uid(), name: found[1].trim(), level: found[2].trim() })
      else result.languages.push({ id: uid(), name: clean, level: '' })
    }
  }

  return result
}
