import { useState, type ReactNode } from 'react'
import { ChevronDown } from '../ui/icons'

export function SectionCard({
  title,
  onTitleChange,
  subtitle,
  children,
  defaultOpen = true,
}: {
  title: string
  onTitleChange?: (value: string) => void
  subtitle?: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="grid h-6 w-6 flex-none place-items-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? '' : '-rotate-90'}`} />
        </button>

        <div className="min-w-0 flex-1">
          {onTitleChange ? (
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              aria-label="Titre de la section"
              className="w-full truncate rounded border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold text-slate-900 outline-none transition hover:border-slate-200 focus:border-blue-400 focus:bg-white"
            />
          ) : (
            <h2 className="truncate px-1 text-sm font-semibold text-slate-900">{title}</h2>
          )}
          {subtitle ? <p className="px-1 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
      </div>

      {open ? <div className="space-y-4 border-t border-slate-100 px-4 py-4">{children}</div> : null}
    </section>
  )
}
