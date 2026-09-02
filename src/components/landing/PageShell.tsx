import type { ReactNode } from 'react'

/** En-tête et pied de page communs aux pages de contenu. */
export function PageShell({
  children,
  onStart,
  breadcrumb,
}: {
  children: ReactNode
  onStart: () => void
  breadcrumb: { label: string; href?: string }[]
}) {
  return (
    <div className="min-h-full bg-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-3">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              CV
            </span>
            <span className="text-sm font-semibold text-slate-900">CV Studio</span>
          </a>
          <button
            type="button"
            onClick={onStart}
            className="ml-auto rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Créer mon CV
          </button>
        </div>
      </header>

      <nav aria-label="Fil d’Ariane" className="mx-auto max-w-4xl px-5 pt-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          {breadcrumb.map((item, index) => (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true">›</span> : null}
              {item.href ? (
                <a href={item.href} className="hover:text-slate-800 hover:underline">
                  {item.label}
                </a>
              ) : (
                <span className="text-slate-700">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {children}

      <footer className="mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 px-5 py-8 text-xs text-slate-500">
          <a href="/" className="font-medium text-slate-700 hover:underline">
            CV Studio
          </a>
          <a href="/#modeles" className="hover:text-slate-800">
            Modèles
          </a>
          <span className="ml-auto">
            Sans lien avec LinkedIn Corporation. LinkedIn est une marque de son propriétaire.
          </span>
        </div>
      </footer>
    </div>
  )
}
