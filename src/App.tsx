import { useCallback, useEffect, useState } from 'react'
import { useResume } from './lib/useResume'
import { useAuth, bearer } from './lib/useAuth'
import { useCloudResume } from './lib/useCloudResume'
import { slugify } from './lib/format'
import { parseResumeFile } from './lib/storage'
import { describeFailure, describeNetworkFailure, readJson } from './lib/http'
import { Toolbar } from './components/Toolbar'
import { AuthPanel } from './components/AuthPanel'
import { UnlockModal, type Price } from './components/UnlockModal'
import { EditorPanel } from './components/editor/EditorPanel'
import { DesignPanel } from './components/editor/DesignPanel'
import { ResumePreview } from './components/preview/ResumePreview'

type Tab = 'contenu' | 'design'

export default function App({ initialAuthOpen = false }: { initialAuthOpen?: boolean }) {
  const store = useResume()
  const { resume, setResume, updateSettings, reset, loadSample } = store
  const auth = useAuth()
  const cloud = useCloudResume(auth.session, resume, setResume)

  const [tab, setTab] = useState<Tab>('contenu')
  const [pageCount, setPageCount] = useState(1)
  const [mobileView, setMobileView] = useState<'editeur' | 'apercu'>('editeur')
  const [authOpen, setAuthOpen] = useState(initialAuthOpen)
  const [authReason, setAuthReason] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  // Le tarif n'est pas connu du client : il arrive avec le refus du serveur,
  // ce qui garantit que le montant annoncé est celui qui sera facturé.
  const [price, setPrice] = useState<Price | null>(null)

  const fileName = slugify(
    `${resume.personal.firstName} ${resume.personal.lastName}`.trim(),
    'mon-cv',
  )

  // Retour depuis Stripe : le webhook a pu débloquer le CV entre-temps.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('paiement')) return
    if (params.get('paiement') === 'ok') {
      setMessage('Paiement enregistré. Le téléchargement est débloqué.')
      void cloud.refresh()
    } else {
      setMessage('Paiement annulé.')
    }
    window.history.replaceState({}, '', window.location.pathname)
  }, [cloud])

  function requireAccount(reason: string) {
    setAuthReason(reason)
    setAuthOpen(true)
  }

  /**
   * Unique voie de téléchargement. Le PDF est fabriqué par le serveur et n'est
   * remis qu'à un compte dont le CV est payé : le navigateur ne sait plus
   * produire le document, l'impression de la page ayant été neutralisée.
   */
  const handleDownload = useCallback(async () => {
    if (!auth.session) {
      requireAccount('Créez un compte pour enregistrer puis télécharger votre CV.')
      return
    }
    if (!cloud.resumeId) {
      setMessage('CV pas encore synchronisé, réessayez dans un instant.')
      return
    }

    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/cv/pdf?id=${cloud.resumeId}`, {
        headers: bearer(auth.session),
      })

      if (response.status === 402) {
        // Pas encore payé : on annonce le montant et on laisse la main.
        const payload = await readJson<{ amount?: number; currency?: string }>(response)
        setPrice({ amount: payload?.amount ?? 0, currency: payload?.currency ?? 'eur' })
        return
      }

      if (!response.ok) {
        setMessage(describeFailure(response, await readJson(response), 'Le téléchargement a échoué.'))
        return
      }

      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `CV-${fileName}.pdf`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch {
      setMessage(describeNetworkFailure('Le téléchargement a échoué.'))
    } finally {
      setBusy(false)
    }
  }, [auth.session, cloud.resumeId, fileName])

  /** Départ vers Stripe, une fois le montant vu et accepté. */
  const handleCheckout = useCallback(async () => {
    if (!auth.session || !cloud.resumeId) return
    setBusy(true)
    try {
      const checkout = await fetch(`/api/checkout?id=${cloud.resumeId}`, {
        method: 'POST',
        headers: bearer(auth.session),
      })
      const payload = await readJson<{ url?: string; message?: string }>(checkout)
      if (checkout.ok && payload?.url) {
        window.location.href = payload.url
        return
      }
      setPrice(null)
      setMessage(describeFailure(checkout, payload, 'Le paiement n’a pas pu être ouvert.'))
    } catch {
      setPrice(null)
      setMessage(describeNetworkFailure('Le paiement n’a pas pu être ouvert.'))
    } finally {
      setBusy(false)
    }
  }, [auth.session, cloud.resumeId])

  /**
   * Export des données brutes. Réservé au titulaire du compte : c'est sa
   * sauvegarde personnelle, pas une échappatoire au paiement — un JSON n'est
   * pas un CV mis en page.
   */
  const handleExport = useCallback(() => {
    if (!auth.session) {
      requireAccount('Connectez-vous pour exporter vos données.')
      return
    }
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `cv-${fileName}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }, [resume, fileName, auth.session])

  /** Restaure un CV exporté ; la synchronisation le renvoie ensuite au compte. */
  const handleImport = useCallback(
    async (file: File) => {
      const parsed = parseResumeFile(await file.text())
      if (parsed) setResume(parsed)
      else setMessage('Ce fichier n’est pas un CV exporté depuis CV Studio.')
    },
    [setResume],
  )

  return (
    <div className="app-shell flex h-full flex-col">
      <AuthPanel
        open={authOpen}
        reason={authReason}
        onClose={() => setAuthOpen(false)}
        onSignIn={async (email, password) => {
          const error = await auth.signIn(email, password)
          if (!error) setAuthOpen(false)
          return error
        }}
        onSignUp={auth.signUp}
      />

      <UnlockModal
        open={price !== null}
        price={price}
        busy={busy}
        onConfirm={() => void handleCheckout()}
        onClose={() => setPrice(null)}
      />

      <Toolbar
        pageCount={pageCount}
        email={auth.email}
        saving={cloud.saving}
        paid={cloud.paid}
        busy={busy}
        onDownload={() => void handleDownload()}
        onExport={handleExport}
        onImport={(file) => void handleImport(file)}
        onSample={loadSample}
        onReset={reset}
        onSignIn={() => requireAccount('Connectez-vous pour retrouver vos CV.')}
        onSignOut={() => void auth.signOut()}
      />

      {message ? (
        <p className="no-print border-b border-slate-200 bg-blue-50 px-4 py-2 text-sm text-blue-900">
          {message}
        </p>
      ) : null}
      {cloud.error ? (
        <p className="no-print border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {cloud.error}
        </p>
      ) : null}

      <div className="no-print flex gap-1 border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
        {(['editeur', 'apercu'] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setMobileView(view)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              mobileView === view ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {view === 'editeur' ? 'Éditeur' : 'Aperçu'}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          className={`editor-pane no-print w-full flex-col overflow-y-auto border-r border-slate-200 bg-slate-50 lg:flex lg:w-[46%] lg:max-w-[620px] ${
            mobileView === 'editeur' ? 'flex' : 'hidden'
          }`}
        >
          <div className="sticky top-0 z-10 flex gap-1 border-b border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur">
            {(['contenu', 'design'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  tab === item
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item === 'contenu' ? 'Contenu' : 'Mise en forme'}
              </button>
            ))}
          </div>

          <div className="px-4 py-4">
            {tab === 'contenu' ? (
              <EditorPanel store={store} />
            ) : (
              <DesignPanel settings={resume.settings} onChange={updateSettings} />
            )}
          </div>
        </div>

        <div
          className={`preview-pane min-w-0 flex-1 ${
            mobileView === 'apercu' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResumePreview resume={resume} onPageCount={setPageCount} watermark={!cloud.paid} />
        </div>
      </div>
    </div>
  )
}
