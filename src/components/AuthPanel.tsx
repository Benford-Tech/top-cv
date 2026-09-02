import { useState } from 'react'
import { isConfigured } from '../lib/supabase'
import { Button, Field, TextInput } from './ui/controls'
import { Close } from './ui/icons'

export function AuthPanel({
  open,
  onClose,
  onSignIn,
  onSignUp,
  reason,
}: {
  open: boolean
  onClose: () => void
  onSignIn: (email: string, password: string) => Promise<string | null>
  onSignUp: (email: string, password: string) => Promise<string | null>
  reason?: string
}) {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!open) return null

  async function submit() {
    setBusy(true)
    setError(null)
    setNotice(null)
    const message = mode === 'in' ? await onSignIn(email, password) : await onSignUp(email, password)
    if (message) setError(message)
    else if (mode === 'up') {
      setNotice('Compte créé. Si la confirmation par e-mail est activée, validez le lien reçu.')
    }
    setBusy(false)
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compte"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">
              {mode === 'in' ? 'Se connecter' : 'Créer un compte'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {reason ?? 'Votre CV est enregistré sur votre compte.'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="grid h-8 w-8 flex-none place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"
          >
            <Close />
          </button>
        </header>

        <div className="space-y-3 px-5 py-4">
          {!isConfigured ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Les comptes ne sont pas configurés sur ce déploiement (VITE_SUPABASE_URL et
              VITE_SUPABASE_ANON_KEY).
            </p>
          ) : null}

          <Field label="Adresse e-mail">
            <TextInput
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vous@example.com"
            />
          </Field>
          <Field label="Mot de passe" hint={mode === 'up' ? '8 caractères minimum' : undefined}>
            <TextInput
              type="password"
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void submit()
              }}
            />
          </Field>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              {notice}
            </p>
          ) : null}

          <Button
            variant="primary"
            onClick={() => void submit()}
            disabled={busy || !isConfigured || !email || password.length < 8}
          >
            {busy ? 'Un instant…' : mode === 'in' ? 'Se connecter' : 'Créer le compte'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'in' ? 'up' : 'in')
              setError(null)
              setNotice(null)
            }}
            className="block w-full text-center text-xs text-blue-600 hover:underline"
          >
            {mode === 'in' ? 'Pas encore de compte ? En créer un' : 'J’ai déjà un compte'}
          </button>
        </div>
      </div>
    </div>
  )
}
