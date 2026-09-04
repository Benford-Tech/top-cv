import { useEffect, useRef, useState } from 'react'
import {
  RedactionError,
  redactionAvailable,
  streamRedaction,
  type RedactionIntent,
  type RedactionKind,
} from '../../lib/redaction'
import { Button } from '../ui/controls'
import { Close, Sparkles } from '../ui/icons'

const INTENTS: { key: RedactionIntent; label: string; hint: string; needsText: boolean }[] = [
  {
    key: 'improve',
    label: 'Améliorer',
    hint: 'Plus clair, plus direct, à longueur comparable',
    needsText: true,
  },
  {
    key: 'shorten',
    label: 'Raccourcir',
    hint: 'Même substance, moins de mots',
    needsText: true,
  },
  {
    key: 'quantify',
    label: 'Mettre les résultats en avant',
    hint: 'Les chiffres manquants restent [entre crochets] à compléter',
    needsText: true,
  },
  {
    key: 'write',
    label: 'Rédiger une première version',
    hint: 'À partir du poste et de l’employeur saisis',
    needsText: false,
  },
]

/**
 * Aide à la rédaction adossée à un champ du CV.
 *
 * Deux principes de fonctionnement : le texte proposé n'écrase jamais le champ
 * de lui-même — il s'affiche à côté, et c'est l'utilisateur qui remplace ou
 * ajoute ; et l'ensemble disparaît si le déploiement n'a pas de clé, plutôt
 * que d'offrir un bouton qui échouera. Les suggestions écrites d'avance
 * restent disponibles dans tous les cas.
 */
export function RedactionAssistant({
  kind,
  token,
  current,
  role,
  company,
  onReplace,
  onAppend,
}: {
  kind: RedactionKind
  token: string | null
  current: string
  role?: string
  company?: string
  onReplace: (text: string) => void
  onAppend: (text: string) => void
}) {
  const [available, setAvailable] = useState(false)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const abort = useRef<AbortController | null>(null)

  useEffect(() => {
    let alive = true
    void redactionAvailable().then((yes) => {
      if (alive) setAvailable(yes)
    })
    return () => {
      alive = false
    }
  }, [])

  // Une réécriture en cours n'a plus d'objet si le composant s'en va.
  useEffect(() => () => abort.current?.abort(), [])

  if (!available) return null

  const hasText = current.trim().length > 0

  async function run(intent: RedactionIntent) {
    abort.current?.abort()
    const controller = new AbortController()
    abort.current = controller

    setBusy(true)
    setError('')
    setDraft('')
    try {
      await streamRedaction(
        { kind, intent, text: current, role, company },
        { token, onText: setDraft, signal: controller.signal },
      )
    } catch (failure) {
      if (failure instanceof DOMException && failure.name === 'AbortError') return
      setDraft('')
      setError(
        failure instanceof RedactionError
          ? failure.message
          : 'La réécriture n’a pas abouti. Réessayez dans un instant.',
      )
    } finally {
      if (abort.current === controller) setBusy(false)
    }
  }

  function close() {
    abort.current?.abort()
    setOpen(false)
    setDraft('')
    setError('')
    setBusy(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
      >
        <Sparkles className="h-3.5 w-3.5" /> Aide à la rédaction
      </button>
    )
  }

  return (
    <div className="mt-2 w-full rounded-lg border border-violet-200 bg-violet-50/50 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-violet-900">
          <Sparkles className="mr-1 inline h-3.5 w-3.5" />
          Aide à la rédaction
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Fermer l’aide à la rédaction"
          className="text-violet-400 transition hover:text-violet-700"
        >
          <Close className="h-4 w-4" />
        </button>
      </div>

      {!token ? (
        // Dit avant le clic ce que « Débloquer le PDF » dit déjà ailleurs :
        // l'aide passe par un compte, parce qu'elle coûte à chaque appel.
        <p className="mt-2 text-xs text-violet-800">
          L’aide à la rédaction demande un compte : elle appelle un modèle facturé à
          l’usage. Connectez-vous en haut de la page. Les suggestions toutes faites, elles,
          restent accessibles sans compte.
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {INTENTS.map((intent) => {
          const blocked = !token || (intent.needsText && !hasText)
          return (
            <button
              key={intent.key}
              type="button"
              disabled={busy || blocked}
              title={
                !token
                  ? 'Connectez-vous pour utiliser l’aide à la rédaction'
                  : blocked
                    ? 'Écrivez d’abord quelques mots'
                    : intent.hint
              }
              onClick={() => void run(intent.key)}
              className="rounded-md border border-violet-200 bg-white px-2 py-1 text-xs font-medium text-violet-800 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {intent.label}
            </button>
          )
        })}
      </div>

      {busy && !draft ? (
        <p className="mt-2 text-xs text-violet-700">Rédaction en cours…</p>
      ) : null}

      {draft ? (
        <>
          <p className="mt-3 whitespace-pre-wrap rounded-md border border-violet-200 bg-white p-2 text-sm text-slate-800">
            {draft}
          </p>
          <p className="mt-1.5 text-[11px] text-violet-800">
            Relisez avant d’appliquer : rien n’est ajouté à votre CV sans votre accord.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button
              variant="primary"
              disabled={busy}
              onClick={() => {
                onReplace(draft.trim())
                close()
              }}
            >
              Remplacer
            </Button>
            <Button
              disabled={busy}
              onClick={() => {
                onAppend(draft.trim())
                close()
              }}
            >
              Ajouter à la suite
            </Button>
          </div>
        </>
      ) : null}

      {error ? (
        <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
          {error}
        </p>
      ) : null}
    </div>
  )
}
