import { useRef } from 'react'
import { Button } from './ui/controls'
import { Download, Printer, Reset, Sparkles, Upload } from './ui/icons'

export function Toolbar({
  pageCount,
  savedAt,
  onPrint,
  onExport,
  onImport,
  onSample,
  onReset,
}: {
  pageCount: number
  savedAt: Date | null
  onPrint: () => void
  onExport: () => void
  onImport: (file: File) => void
  onSample: () => void
  onReset: () => void
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
            {pageCount} page{pageCount > 1 ? 's' : ''} ·{' '}
            {savedAt
              ? `enregistré à ${savedAt.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : 'enregistrement automatique'}
          </p>
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
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
        <Button variant="ghost" onClick={() => fileInput.current?.click()} title="Reprendre un CV enregistré">
          <Upload className="h-4 w-4" /> Importer
        </Button>
        <Button variant="ghost" onClick={onExport} title="Sauvegarder les données du CV">
          <Download className="h-4 w-4" /> Exporter
        </Button>
        <Button variant="primary" onClick={onPrint}>
          <Printer className="h-4 w-4" /> Télécharger en PDF
        </Button>
      </div>
    </header>
  )
}
