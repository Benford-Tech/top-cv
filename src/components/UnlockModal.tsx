import { Button } from './ui/controls'
import { Check, Close, Lock } from './ui/icons'

export type Price = { amount: number; currency: string }

/** Met le montant sous les yeux de l'utilisateur avant tout départ vers Stripe. */
export function formatPrice({ amount, currency }: Price): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function UnlockModal({
  open,
  price,
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean
  price: Price | null
  busy: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  if (!open || !price) return null

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Débloquer le téléchargement"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start gap-3 border-b border-slate-200 px-6 py-5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-blue-50 text-blue-600">
            <Lock className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">Votre CV est prêt</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Débloquez le téléchargement pour obtenir le PDF.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="grid h-8 w-8 flex-none place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"
          >
            <Close />
          </button>
        </header>

        <div className="px-6 py-5">
          <p className="text-4xl font-bold text-slate-900">{formatPrice(price)}</p>
          <p className="text-sm text-slate-500">paiement unique, sans abonnement</p>

          <ul className="mt-5 space-y-2">
            {[
              'PDF A4 au texte sélectionnable, pas une image',
              'Modifications et retéléchargements illimités',
              'Aucune reconduction : rien à résilier',
              'Vos données restent exportables gratuitement',
            ].map((line) => (
              <li key={line} className="flex gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 transition hover:text-slate-800"
          >
            Continuer à modifier
          </button>
          <Button variant="primary" onClick={onConfirm} disabled={busy}>
            {busy ? 'Redirection…' : `Payer ${formatPrice(price)}`}
          </Button>
        </footer>
      </div>
    </div>
  )
}
