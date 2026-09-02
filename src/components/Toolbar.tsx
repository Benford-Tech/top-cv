import { useRef } from 'react'
import { Button } from './ui/controls'
import { Check, Download, Lock, Printer, Reset, Sparkles, Upload } from './ui/icons'

export function Toolbar({
  pageCount,
  email,
  saving,
  paid,
  busy,
  onDownload,
  onExport,
  onImport,
  onSample,
  onReset,
  onSignIn,
  onSignOut,
}: {
  pageCount: number
  email: string | null
  saving: boolean
  paid: boolean
  busy: boolean
  onDownload: () => void
  onExport: () => void
  onImport: (file: File) => void
  onSample: () => void
  onReset: () => void
  onSignIn: () => void
  onSignOut: () => void
}) {
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <header className="no-print flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          CV
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">CV Studio</p>
          <p className="text-[11px] text-slate-400">
            {pageCount} page{pageCount > 1 ? 's' : ''}
            {email ? (saving ? ' · enregistrement…' : ' · enregistré') : ' · brouillon local'}
          </p>
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {email ? (
          <>
            {paid ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800">
                <Check className="h-3.5 w-3.5" /> CV débloqué
              </span>
            ) : null}
            <button
              type="button"
              onClick={onSignOut}
              title={email}
              className="max-w-[160px] truncate rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
            >
              {email} · quitter
            </button>
          </>
        ) : (
          <Button variant="ghost" onClick={onSignIn}>
            Se connecter
          </Button>
        )}

        <Button variant="subtle" onClick={onSample} title="Remplir avec un CV d’exemple">
          <Sparkles className="h-4 w-4" /> Exemple
        </Button>
        <Button
          variant="subtle"
          onClick={() => {
            if (window.confirm('Effacer tout le contenu du CV ? Cette action est définitive.')) {
              onReset()
            }
          }}
        >
          <Reset className="h-4 w-4" /> Vider
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onImport(file)
            event.target.value = ''
          }}
        />
        <Button
          variant="ghost"
          onClick={() => fileInput.current?.click()}
          title="Reprendre un CV exporté"
        >
          <Upload className="h-4 w-4" /> Importer
        </Button>
        <Button variant="ghost" onClick={onExport} title="Sauvegarder vos données au format JSON">
          <Download className="h-4 w-4" /> Mes données
        </Button>

        <Button variant="primary" onClick={onDownload} disabled={busy}>
          {paid ? <Printer className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {busy ? 'Préparation…' : paid ? 'Télécharger le PDF' : 'Débloquer le PDF'}
        </Button>
      </div>
    </header>
  )
}
