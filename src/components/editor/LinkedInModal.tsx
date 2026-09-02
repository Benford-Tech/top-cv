import { useRef, useState } from 'react'
import type { Resume } from '../../types'
import type { LinkedInImport } from '../../lib/linkedin'
import { isEmptyImport, readLinkedInExport } from '../../lib/linkedin'
import { Button } from '../ui/controls'
import { Check, Close, LinkedIn, Upload } from '../ui/icons'

type SectionKey = 'experiences' | 'education' | 'skills' | 'languages' | 'recommendations'

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'experiences', label: 'Expériences' },
  { key: 'education', label: 'Formations' },
  { key: 'skills', label: 'Compétences' },
  { key: 'languages', label: 'Langues' },
  { key: 'recommendations', label: 'Recommandations reçues' },
]

export function LinkedInModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean
  onClose: () => void
  onImport: (data: LinkedInImport, chosen: SectionKey[], mode: 'replace' | 'append') => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<LinkedInImport | null>(null)
  const [chosen, setChosen] = useState<SectionKey[]>(SECTIONS.map((item) => item.key))
  const [mode, setMode] = useState<'replace' | 'append'>('replace')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    try {
      const parsed = await readLinkedInExport(Array.from(files))
      if (isEmptyImport(parsed)) {
        setData(parsed)
        setError(
          "Aucune donnée exploitable n'a été trouvée. Vérifiez qu'il s'agit bien de l'archive « Obtenir une copie de vos données » de LinkedIn.",
        )
      } else {
        setData(parsed)
      }
    } catch {
      setError("Ce fichier n'a pas pu être ouvert. Attendu : l'archive ZIP de LinkedIn, ou ses fichiers CSV.")
      setData(null)
    } finally {
      setBusy(false)
    }
  }

  function toggle(key: SectionKey) {
    setChosen((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]))
  }

  function counted(key: SectionKey): number {
    return data ? (data[key] as Resume['experiences']).length : 0
  }

  const total = data ? SECTIONS.reduce((sum, item) => sum + counted(item.key), 0) : 0

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Importer depuis LinkedIn"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <header className="flex items-start gap-3 border-b border-slate-200 px-6 py-5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-[#0a66c2] text-white">
            <LinkedIn className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">Importer depuis LinkedIn</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              LinkedIn n’ouvre ni les expériences ni les recommandations à son API : on passe donc
              par l’export de données, que vous seul pouvez demander.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="grid h-8 w-8 flex-none place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Close />
          </button>
        </header>

        <div className="space-y-4 px-6 py-5">
          <ol className="space-y-1.5 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            <li>
              <strong className="font-medium text-slate-800">1.</strong> Sur LinkedIn :
              Préférences et confidentialité → Confidentialité des données →{' '}
              <em>Obtenir une copie de vos données</em>.
            </li>
            <li>
              <strong className="font-medium text-slate-800">2.</strong> Choisissez l’archive
              complète, puis attendez le courriel de LinkedIn (quelques minutes à 24 h).
            </li>
            <li>
              <strong className="font-medium text-slate-800">3.</strong> Déposez ici le ZIP reçu —
              il est lu dans votre navigateur, rien n’est envoyé nulle part.
            </li>
          </ol>

          <input
            ref={input}
            type="file"
            accept=".zip,.csv"
            multiple
            className="hidden"
            onChange={(event) => void handleFiles(event.target.files)}
          />
          <Button variant="ghost" onClick={() => input.current?.click()} disabled={busy}>
            <Upload className="h-4 w-4" />
            {busy ? 'Lecture…' : 'Choisir l’archive ZIP ou des fichiers CSV'}
          </Button>

          {error ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {error}
            </p>
          ) : null}

          {data && total > 0 ? (
            <>
              <div className="space-y-1.5">
                {SECTIONS.map((section) => {
                  const count = counted(section.key)
                  const active = chosen.includes(section.key)
                  return (
                    <label
                      key={section.key}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                        count === 0
                          ? 'border-slate-100 bg-slate-50 text-slate-400'
                          : active
                            ? 'border-blue-300 bg-blue-50 text-slate-800'
                            : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300"
                        checked={active && count > 0}
                        disabled={count === 0}
                        onChange={() => toggle(section.key)}
                      />
                      <span className="flex-1">{section.label}</span>
                      <span className="text-xs">
                        {count === 0 ? 'rien trouvé' : `${count} élément${count > 1 ? 's' : ''}`}
                      </span>
                    </label>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ['replace', 'Remplacer les sections choisies'],
                    ['append', 'Ajouter à la suite de l’existant'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      mode === value
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {data.filesIgnored.length > 0 ? (
                <details className="text-xs text-slate-500">
                  <summary className="cursor-pointer">
                    {data.filesUsed.length} fichier{data.filesUsed.length > 1 ? 's' : ''} exploité
                    {data.filesUsed.length > 1 ? 's' : ''}, {data.filesIgnored.length} ignoré
                    {data.filesIgnored.length > 1 ? 's' : ''}
                  </summary>
                  <p className="mt-1 break-words">
                    Exploités : {data.filesUsed.join(', ') || 'aucun'}.
                  </p>
                </details>
              ) : null}
            </>
          ) : null}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-xs text-slate-500">
            L’archive est lue localement. Relisez toujours ce qui a été importé : LinkedIn ne
            distingue pas les niveaux de compétence, tous arrivent à 4 sur 5.
          </p>
          <Button
            variant="primary"
            disabled={!data || total === 0 || chosen.length === 0}
            onClick={() => {
              if (data) onImport(data, chosen, mode)
            }}
          >
            <Check className="h-4 w-4" /> Importer
          </Button>
        </footer>
      </div>
    </div>
  )
}
