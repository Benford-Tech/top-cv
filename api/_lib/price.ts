/**
 * Tarif du téléchargement. Défini côté serveur uniquement : le montant affiché
 * à l'utilisateur et celui facturé par Stripe viennent de la même source, ils
 * ne peuvent donc pas diverger.
 */
export function priceConfig() {
  return {
    amount: Number(process.env.CV_PRICE_CENTS ?? 490),
    currency: (process.env.CV_PRICE_CURRENCY ?? 'eur').toLowerCase(),
  }
}
