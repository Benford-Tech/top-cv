import type { ReactNode } from 'react'
import { IconButton } from '../ui/controls'
import { ArrowDown, ArrowUp, Trash } from '../ui/icons'

export function EntryCard({
  title,
  meta,
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  title: string
  meta?: string
  index: number
  count: number
  onMove: (delta: number) => void
  onRemove: () => void
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-3 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">
            {title || <span className="text-slate-400">Nouvelle entrée</span>}
          </p>
          {meta ? <p className="truncate text-xs text-slate-500">{meta}</p> : null}
        </div>
        <div className="flex flex-none gap-1">
          <IconButton label="Monter" onClick={() => onMove(-1)} disabled={index === 0}>
            <ArrowUp className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            label="Descendre"
            onClick={() => onMove(1)}
            disabled={index === count - 1}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton label="Supprimer" onClick={onRemove}>
            <Trash className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
