import { useCallback, useState } from 'react'
import { useResume } from './lib/useResume'
import { parseResumeFile } from './lib/storage'
import { slugify } from './lib/format'
import { Toolbar } from './components/Toolbar'
import { EditorPanel } from './components/editor/EditorPanel'
import { DesignPanel } from './components/editor/DesignPanel'
import { ResumePreview } from './components/preview/ResumePreview'

type Tab = 'contenu' | 'design'

export default function App() {
  const store = useResume()
  const { resume, setResume, updateSettings, savedAt, reset, loadSample } = store
  const [tab, setTab] = useState<Tab>('contenu')
  const [pageCount, setPageCount] = useState(1)
  /** Sur mobile les deux panneaux ne tiennent pas côte à côte : on bascule. */
  const [mobileView, setMobileView] = useState<'editeur' | 'apercu'>('editeur')

  const fileName = slugify(
    `${resume.personal.firstName} ${resume.personal.lastName}`.trim(),
    'mon-cv',
  )

  /**
   * L'export passe par la boîte d'impression du navigateur (« Enregistrer au
   * format PDF ») : le texte reste vectoriel, sélectionnable et lisible par les
   * robots de tri des recruteurs, ce qu'une capture en image ne permet pas.
   */
  const handlePrint = useCallback(() => {
    const previous = document.title
    document.title = `CV-${fileName}`
    window.print()
    window.setTimeout(() => {
      document.title = previous
    }, 500)
  }, [fileName])

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cv-${fileName}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [resume, fileName])

  const handleImport = useCallback(
    async (file: File) => {
      const parsed = parseResumeFile(await file.text())
      if (parsed) {
        setResume(parsed)
      } else {
        window.alert("Ce fichier n'est pas un CV exporté depuis CV Studio.")
      }
    },
    [setResume],
  )

  return (
    <div className="app-shell flex h-full flex-col">
      <Toolbar
        pageCount={pageCount}
        savedAt={savedAt}
        onPrint={handlePrint}
        onExport={handleExport}
        onImport={(file) => void handleImport(file)}
        onSample={loadSample}
        onReset={reset}
      />

      {/* Bascule éditeur / aperçu, visible uniquement sur petit écran. */}
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
          <ResumePreview resume={resume} onPageCount={setPageCount} />
        </div>
      </div>
    </div>
  )
}
