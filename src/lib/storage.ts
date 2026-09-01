import type { Resume } from '../types'
import { EMPTY_RESUME } from '../data/defaults'

const KEY = 'cv-studio:resume:v1'

/**
 * Fusionne le contenu stocké avec le CV vide : une sauvegarde écrite par une
 * version antérieure (champ ou section absents) reste exploitable.
 */
function hydrate(raw: unknown): Resume | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Partial<Resume>
  return {
    ...EMPTY_RESUME,
    ...data,
    personal: { ...EMPTY_RESUME.personal, ...data.personal },
    labels: { ...EMPTY_RESUME.labels, ...data.labels },
    settings: { ...EMPTY_RESUME.settings, ...data.settings },
    experiences: data.experiences ?? [],
    education: data.education ?? [],
    skills: data.skills ?? [],
    languages: data.languages ?? [],
    summary: data.summary ?? '',
  }
}

export function loadResume(): Resume | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? hydrate(JSON.parse(raw)) : null
  } catch {
    // Navigation privée, quota atteint ou JSON corrompu : on repart d'un CV neuf.
    return null
  }
}

export function saveResume(resume: Resume): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(resume))
  } catch {
    // Sauvegarde impossible : l'éditeur reste utilisable, seul l'auto-enregistrement est perdu.
  }
}

export function clearResume(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* rien à faire */
  }
}

export function parseResumeFile(text: string): Resume | null {
  try {
    return hydrate(JSON.parse(text))
  } catch {
    return null
  }
}
