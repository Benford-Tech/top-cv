import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Resume } from '../types'
import { bearer } from './useAuth'

type Row = { id: string; title: string; data?: Resume; paid: boolean; updated_at: string }

/**
 * Relie le CV en cours d'édition au compte de l'utilisateur.
 *
 * Le CV vit désormais en base : c'est indispensable pour que le serveur puisse
 * en fabriquer le PDF sans rien recevoir du navigateur, et donc pour que le
 * droit de télécharger soit vérifiable.
 */
export function useCloudResume(
  session: Session | null,
  resume: Resume,
  onLoaded: (resume: Resume) => void,
) {
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Tant que le CV distant n'est pas chargé, on ne renvoie rien : sans ce
  // garde-fou, le premier rendu écraserait le CV enregistré par un CV vide.
  const ready = useRef(false)

  const title = `${resume.personal.firstName} ${resume.personal.lastName}`.trim() || 'Mon CV'

  const refresh = useCallback(async () => {
    if (!session || !resumeId) return
    const response = await fetch(`/api/resumes?id=${resumeId}`, { headers: bearer(session) })
    if (!response.ok) return
    const row = (await response.json()) as Row
    setPaid(row.paid)
  }, [session, resumeId])

  // Ouverture de session : on récupère le CV existant, ou on en crée un.
  useEffect(() => {
    let cancelled = false
    if (!session) {
      ready.current = false
      setResumeId(null)
      setPaid(false)
      return
    }

    ;(async () => {
      try {
        const list = await fetch('/api/resumes', { headers: bearer(session) })
        if (!list.ok) throw new Error(String(list.status))
        const { resumes } = (await list.json()) as { resumes: Row[] }

        if (resumes.length > 0) {
          const row = resumes[0]
          const one = await fetch(`/api/resumes?id=${row.id}`, { headers: bearer(session) })
          const full = (await one.json()) as Row
          if (cancelled) return
          setResumeId(full.id)
          setPaid(full.paid)
          if (full.data) onLoaded(full.data)
        } else {
          const created = await fetch('/api/resumes', {
            method: 'POST',
            headers: { ...bearer(session), 'content-type': 'application/json' },
            body: JSON.stringify({ title, data: resume }),
          })
          if (!created.ok) throw new Error(String(created.status))
          const row = (await created.json()) as Row
          if (cancelled) return
          setResumeId(row.id)
          setPaid(row.paid)
        }
        ready.current = true
        setError(null)
      } catch {
        if (!cancelled) setError('Synchronisation impossible pour le moment.')
      }
    })()

    return () => {
      cancelled = true
    }
    // Volontairement lié à la seule session : le CV courant ne doit pas
    // relancer un chargement à chaque frappe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // Enregistrement différé des modifications.
  useEffect(() => {
    if (!session || !resumeId || !ready.current) return
    setSaving(true)
    const timer = window.setTimeout(async () => {
      try {
        await fetch(`/api/resumes?id=${resumeId}`, {
          method: 'PUT',
          headers: { ...bearer(session), 'content-type': 'application/json' },
          body: JSON.stringify({ title, data: resume }),
        })
        setError(null)
      } catch {
        setError('Modifications non enregistrées.')
      } finally {
        setSaving(false)
      }
    }, 900)
    return () => window.clearTimeout(timer)
  }, [resume, session, resumeId, title])

  return { resumeId, paid, saving, error, refresh, setPaid }
}
