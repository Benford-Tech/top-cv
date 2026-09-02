import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Education,
  Experience,
  Language,
  Recommendation,
  Resume,
  Settings,
  Skill,
} from '../types'
import { EMPTY_RESUME, sampleResume } from '../data/defaults'
import { loadResume, saveResume } from './storage'
import { uid } from './id'

export type ListKey =
  | 'experiences'
  | 'education'
  | 'skills'
  | 'languages'
  | 'recommendations'
type ItemOf<K extends ListKey> = Resume[K][number]

const BLANK: { [K in ListKey]: () => ItemOf<K> } = {
  experiences: (): Experience => ({
    id: uid(),
    position: '',
    company: '',
    city: '',
    start: '',
    end: '',
    current: false,
    description: '',
  }),
  education: (): Education => ({
    id: uid(),
    degree: '',
    school: '',
    city: '',
    start: '',
    end: '',
    description: '',
  }),
  skills: (): Skill => ({ id: uid(), name: '', level: 3 }),
  languages: (): Language => ({ id: uid(), name: '', level: '' }),
  recommendations: (): Recommendation => ({ id: uid(), author: '', role: '', text: '' }),
}

/**
 * Source de vérité de l'éditeur. Le CV est enregistré dans le navigateur
 * après une courte pause de frappe, jamais envoyé ailleurs.
 */
export function useResume() {
  const [resume, setResume] = useState<Resume>(() => loadResume() ?? sampleResume())
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const timer = window.setTimeout(() => {
      saveResume(resume)
      setSavedAt(new Date())
    }, 600)
    return () => window.clearTimeout(timer)
  }, [resume])

  const update = useCallback((patch: Partial<Resume>) => {
    setResume((prev) => ({ ...prev, ...patch }))
  }, [])

  const updatePersonal = useCallback((patch: Partial<Resume['personal']>) => {
    setResume((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }))
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setResume((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
  }, [])

  const updateLabel = useCallback((key: keyof Resume['labels'], value: string) => {
    setResume((prev) => ({ ...prev, labels: { ...prev.labels, [key]: value } }))
  }, [])

  const addItem = useCallback(<K extends ListKey>(key: K): string => {
    const item = BLANK[key]() as ItemOf<K>
    setResume((prev) => ({ ...prev, [key]: [...(prev[key] as ItemOf<K>[]), item] }))
    return item.id
  }, [])

  const updateItem = useCallback(
    <K extends ListKey>(key: K, id: string, patch: Partial<ItemOf<K>>) => {
      setResume((prev) => ({
        ...prev,
        [key]: (prev[key] as ItemOf<K>[]).map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      }))
    },
    [],
  )

  const removeItem = useCallback((key: ListKey, id: string) => {
    setResume((prev) => ({
      ...prev,
      [key]: (prev[key] as { id: string }[]).filter((item) => item.id !== id),
    }))
  }, [])

  /** Déplace une entrée d'un cran ; `delta` vaut -1 (monter) ou 1 (descendre). */
  const moveItem = useCallback((key: ListKey, id: string, delta: number) => {
    setResume((prev) => {
      const list = [...(prev[key] as { id: string }[])]
      const from = list.findIndex((item) => item.id === id)
      const to = from + delta
      if (from === -1 || to < 0 || to >= list.length) return prev
      const [moved] = list.splice(from, 1)
      list.splice(to, 0, moved)
      return { ...prev, [key]: list }
    })
  }, [])

  /**
   * Applique un import LinkedIn aux seules sections retenues. En mode « ajouter »
   * les entrées existantes sont conservées : un CV déjà travaillé ne doit pas
   * être écrasé par une archive.
   */
  const applyImport = useCallback(
    (
      incoming: Partial<Pick<Resume, ListKey>> & {
        firstName?: string
        lastName?: string
        linkedinUrl?: string
        headline?: string
        summary?: string
        city?: string
        email?: string
      },
      keys: ListKey[],
      mode: 'replace' | 'append',
    ) => {
      setResume((prev) => {
        const next: Resume = { ...prev }
        for (const key of keys) {
          const list = incoming[key]
          if (!list || list.length === 0) continue
          const merged =
            mode === 'replace' ? list : [...(prev[key] as unknown[]), ...(list as unknown[])]
          ;(next as Record<string, unknown>)[key] = merged
        }
        // Les champs d'identité ne sont remplis que s'ils sont vides : un import
        // ne doit jamais écraser ce que l'utilisateur a saisi lui-même.
        if (incoming.firstName && !prev.personal.firstName) {
          next.personal = { ...next.personal, firstName: incoming.firstName }
        }
        if (incoming.lastName && !prev.personal.lastName) {
          next.personal = { ...next.personal, lastName: incoming.lastName }
        }
        if (incoming.linkedinUrl && !prev.personal.linkedin) {
          next.personal = { ...next.personal, linkedin: incoming.linkedinUrl }
        }
        if (incoming.headline && !prev.personal.title) {
          next.personal = { ...next.personal, title: incoming.headline }
        }
        if (incoming.city && !prev.personal.city) {
          next.personal = { ...next.personal, city: incoming.city }
        }
        if (incoming.email && !prev.personal.email) {
          next.personal = { ...next.personal, email: incoming.email }
        }
        if (incoming.summary && !prev.summary.trim()) {
          next.summary = incoming.summary
        }
        return next
      })
    },
    [],
  )

  const reset = useCallback(() => {
    setResume((prev) => ({ ...EMPTY_RESUME, settings: prev.settings }))
  }, [])

  const loadSample = useCallback(() => {
    setResume((prev) => ({ ...sampleResume(), settings: prev.settings }))
  }, [])

  return {
    resume,
    setResume,
    savedAt,
    update,
    updatePersonal,
    updateSettings,
    updateLabel,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    applyImport,
    reset,
    loadSample,
  }
}
