import { useMemo, useState } from 'react'
import { SUGGESTIONS } from '../../data/suggestions'
import { Button } from '../ui/controls'
import { Check, Close, Sparkles } from '../ui/icons'

/** Métier retenu d'une ouverture à l'autre pendant la session. */
let lastJobId = SUGGESTIONS[0].id

export function SuggestionPicker({
  kind,
  onPick,
  label = 'Suggestions',
}: {
  kind: 'summary' | 'bullets'
  onPick: (text: string) => void
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [jobId, setJobId] = useState(lastJobId)
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<string[]>([])

  const group = SUGGESTIONS.find((item) => item.id === jobId) ?? SUGGESTIONS[0]

  const phrases = useMemo(() => {
    const source = kind === 'summary' ? group.summary : group.bullets
    const needle = query.trim().toLowerCase()
    return needle ? source.filter((phrase) => phrase.toLowerCase().includes(needle)) : source
  }, [group, kind, query])

  function choose(phrase: string) {
    onPick(phrase)
    setPicked((prev) => [...prev, phrase])
  }

  function selectJob(id: string) {
    lastJobId = id
    setJobId(id)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPicked([])
          setOpen(true)
        }}
        className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Bibliothèque de formulations"
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <header className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900">
                  {kind === 'summary' ? 'Phrases d’accroche' : 'Formulations pour vos missions'}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Cliquez pour insérer, puis remplacez les « X » par vos propres chiffres.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <Close />
              </button>
            </header>

            <div className="space-y-3 border-b border-slate-100 px-5 py-3">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectJob(item.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      item.id === jobId
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.job}
                  </button>
                ))}
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filtrer les formulations…"
                className="field-input"
              />
            </div>

            <ul className="flex-1 overflow-y-auto px-5 py-3">
              {phrases.length === 0 ? (
                <li className="py-6 text-center text-sm text-slate-400">
                  Aucune formulation ne correspond à ce filtre.
                </li>
              ) : (
                phrases.map((phrase) => {
                  const used = picked.includes(phrase)
                  return (
                    <li key={phrase}>
                      <button
                        type="button"
                        onClick={() => choose(phrase)}
                        className={`mb-1.5 flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                          used
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <span className="mt-0.5 flex-none text-slate-400">
                          {used ? <Check className="h-4 w-4 text-emerald-600" /> : '+'}
                        </span>
                        <span>{phrase}</span>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>

            <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs text-slate-500">
                {picked.length > 0
                  ? `${picked.length} formulation${picked.length > 1 ? 's' : ''} insérée${
                      picked.length > 1 ? 's' : ''
                    }`
                  : 'Aucune insertion pour le moment'}
              </p>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Terminé
              </Button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  )
}
