import type { LinkedInImport } from './linkedin'
import { uid } from './id'

/**
 * Normalise la réponse d'un fournisseur de données LinkedIn vers la forme déjà
 * utilisée par l'import d'archive. Les fournisseurs ne partagent aucun schéma :
 * on accepte donc plusieurs noms de champs pour la même information, et tout ce
 * qui manque reste vide plutôt que d'être inventé.
 */
type Json = Record<string, unknown>

function asArray(value: unknown): Json[] {
  return Array.isArray(value) ? (value.filter((item) => item && typeof item === 'object') as Json[]) : []
}

function str(source: Json | undefined, ...keys: string[]): string {
  if (!source) return ''
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number') return String(value)
  }
  return ''
}

function firstArray(source: Json, ...keys: string[]): Json[] {
  for (const key of keys) {
    const list = asArray(source[key])
    if (list.length > 0) return list
  }
  return []
}

/**
 * Accepte aussi bien `{ year, month }` que « 2021-03 » ou « Mar 2021 »,
 * et rend la valeur attendue par `<input type="month">`.
 */
export function readDate(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'object') {
    const parts = value as Json
    const year = Number(parts.year)
    const month = Number(parts.month)
    if (!Number.isFinite(year) || year <= 0) return ''
    if (!Number.isFinite(month) || month <= 0) return String(year)
    return `${year}-${String(month).padStart(2, '0')}`
  }
  const text = String(value).trim()
  const iso = /^(\d{4})-(\d{2})/.exec(text)
  if (iso) return `${iso[1]}-${iso[2]}`
  const year = /^(\d{4})$/.exec(text)
  if (year) return year[1]
  return text
}

function joinLocation(entry: Json): string {
  const single = str(entry, 'location', 'lieu')
  if (single) return single
  return [str(entry, 'city'), str(entry, 'state', 'region'), str(entry, 'country_full_name', 'country')]
    .filter(Boolean)
    .join(', ')
}

export function mapProviderProfile(payload: Json): LinkedInImport {
  // Certains fournisseurs enveloppent le profil dans `data`, `person` ou `profile`.
  const root =
    (payload.data as Json) ?? (payload.person as Json) ?? (payload.profile as Json) ?? payload

  const experiences = firstArray(root, 'experiences', 'experience', 'positions').map((entry) => {
    const end = readDate(entry.ends_at ?? entry.end_date ?? entry.endDate ?? entry.finished_on)
    return {
      id: uid(),
      position: str(entry, 'title', 'job_title', 'position'),
      company: str(entry, 'company', 'company_name', 'organisation', 'organization'),
      city: joinLocation(entry),
      start: readDate(entry.starts_at ?? entry.start_date ?? entry.startDate ?? entry.started_on),
      end,
      // Pas de date de fin, ou un indicateur explicite : poste en cours.
      current: end === '' || entry.is_current === true || entry.current === true,
      description: str(entry, 'description', 'summary'),
    }
  })

  const education = firstArray(root, 'education', 'educations', 'schools').map((entry) => ({
    id: uid(),
    degree: [str(entry, 'degree_name', 'degree'), str(entry, 'field_of_study', 'field')]
      .filter(Boolean)
      .join(' — '),
    school: str(entry, 'school', 'school_name', 'institution'),
    city: joinLocation(entry),
    start: readDate(entry.starts_at ?? entry.start_date ?? entry.startDate),
    end: readDate(entry.ends_at ?? entry.end_date ?? entry.endDate),
    description: str(entry, 'description', 'activities_and_societies', 'activities'),
  }))

  // Les compétences arrivent soit en chaînes, soit en objets.
  const rawSkills = Array.isArray(root.skills) ? root.skills : []
  const skills = rawSkills
    .map((entry) =>
      typeof entry === 'string' ? entry.trim() : str(entry as Json, 'name', 'skill', 'title'),
    )
    .filter(Boolean)
    .map((name) => ({ id: uid(), name, level: 4 }))

  const rawLanguages = Array.isArray(root.languages) ? root.languages : []
  const languages = rawLanguages
    .map((entry) =>
      typeof entry === 'string'
        ? { name: entry.trim(), level: '' }
        : {
            name: str(entry as Json, 'name', 'language'),
            level: str(entry as Json, 'proficiency', 'level'),
          },
    )
    .filter((item) => item.name)
    .map((item) => ({ id: uid(), ...item }))

  // Les recommandations sont tantôt des chaînes brutes, tantôt structurées.
  const rawRecommendations = Array.isArray(root.recommendations) ? root.recommendations : []
  const recommendations = rawRecommendations
    .map((entry) => {
      if (typeof entry === 'string') {
        return { id: uid(), author: '', role: '', text: entry.trim() }
      }
      const item = entry as Json
      return {
        id: uid(),
        author: str(item, 'author', 'first_name', 'name', 'recommender'),
        role: [str(item, 'job_title', 'title', 'headline'), str(item, 'company')]
          .filter(Boolean)
          .join(', '),
        text: str(item, 'text', 'recommendation', 'body', 'description'),
      }
    })
    .filter((item) => item.text || item.author)

  const fullName = str(root, 'full_name', 'fullName', 'name')
  const [derivedFirst, ...derivedRest] = fullName.split(' ')

  return {
    firstName: str(root, 'first_name', 'firstName', 'given_name') || derivedFirst || '',
    lastName: str(root, 'last_name', 'lastName', 'family_name') || derivedRest.join(' '),
    linkedinUrl: str(root, 'profile_url', 'public_identifier', 'linkedin_url', 'url'),
    headline: str(root, 'headline', 'occupation', 'title'),
    summary: str(root, 'summary', 'about', 'description'),
    city: joinLocation(root),
    email: str(root, 'email', 'personal_email'),
    experiences,
    education,
    skills,
    languages,
    recommendations,
    filesUsed: [],
    filesIgnored: [],
  }
}
