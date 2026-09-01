import type { PlanId } from '../data/plans'
import { PLANS } from '../data/plans'
import type { Access } from '../lib/access'
import { formatExpiry, formatRemaining } from '../lib/access'
import { Button } from './ui/controls'
import { Check, Clock, Close } from './ui/icons'

export function PaywallModal({
  open,
  onClose,
  onChoose,
  access,
  isActive,
  remainingMs,
}: {
  open: boolean
  onClose: () => void
  onChoose: (planId: PlanId) => void
  access: Access | null
  isActive: boolean
  remainingMs: number
}) {
  if (!open) return null

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Louer un accès au téléchargement"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-4xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <header className="flex items-start gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {isActive ? 'Prolonger votre accès' : 'Débloquer le téléchargement PDF'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isActive
                ? `Accès actif encore ${formatRemaining(remainingMs)}. Une nouvelle formule s’ajoute à la fin de la période en cours.`
                : 'La rédaction et l’aperçu restent libres. Le téléchargement se loue pour une durée choisie, sans reconduction.'}
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

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              data-plan={plan.id}
              className={`relative flex flex-col rounded-xl border-2 p-4 transition ${
                plan.highlight
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.highlight ? (
                <span className="absolute -top-2.5 left-4 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                  Le plus court
                </span>
              ) : null}

              <h3 className="text-sm font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{plan.tagline}</p>

              <p className="mt-3 text-2xl font-bold text-slate-900">{plan.price}</p>
              <p className="text-xs text-slate-400">{plan.perDay}</p>

              <ul className="mt-4 flex-1 space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-1.5 text-xs text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <Button
                  variant={plan.highlight ? 'primary' : 'ghost'}
                  onClick={() => onChoose(plan.id)}
                >
                  {isActive ? 'Ajouter cette durée' : 'Louer cet accès'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <footer className="space-y-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          {isActive && access ? (
            <p className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5" />
              Votre accès prend fin le {formatExpiry(access.expiresAt)}.
            </p>
          ) : null}
          <p className="text-xs text-slate-500">
            Vos données ne quittent jamais votre navigateur : l’export JSON reste gratuit, y
            compris sans accès actif, pour que vous puissiez toujours récupérer votre CV.
          </p>
          <p className="text-xs font-medium text-amber-700">
            Démonstration : aucun paiement n’est encaissé et l’accès n’est vérifié que dans ce
            navigateur.
          </p>
        </footer>
      </div>
    </div>
  )
}
