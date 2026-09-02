import Stripe from 'stripe'
import { authenticate, config, json, notConfigured, unauthorized } from './_lib/auth'
import { priceConfig } from './_lib/price'

export const runtime = 'nodejs'

/**
 * Ouvre une session de paiement Stripe pour un CV donné. Le paiement est à
 * l'unité : il débloque définitivement le téléchargement de ce CV, y compris
 * après modification.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const { url: supabaseUrl, anonKey } = config()
  if (!supabaseUrl || !anonKey) return notConfigured()

  // L'identité d'abord : un appelant anonyme n'a pas à apprendre comment le
  // déploiement est configuré.
  const session = await authenticate(request)
  if (!session) return unauthorized()

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return json(
      {
        error: 'not_configured',
        message: 'Le paiement n’est pas configuré sur ce déploiement (STRIPE_SECRET_KEY).',
      },
      501,
    )
  }

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return json({ error: 'bad_request', message: 'Identifiant de CV manquant.' }, 400)

  // La lecture passe par le client de l'utilisateur : RLS garantit qu'on ne
  // peut pas ouvrir un paiement pour le CV de quelqu'un d'autre.
  const { data: resume, error } = await session.client
    .from('resumes')
    .select('id, title, paid')
    .eq('id', id)
    .maybeSingle()
  if (error) return json({ error: 'db_error', message: error.message }, 500)
  if (!resume) return json({ error: 'not_found' }, 404)
  if (resume.paid) return json({ error: 'already_paid', message: 'Ce CV est déjà débloqué.' }, 409)

  const stripe = new Stripe(secret)
  const origin = request.headers.get('origin') ?? new URL(request.url).origin
  const priceId = process.env.STRIPE_PRICE_ID
  const price = priceConfig()

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${origin}/?paiement=ok&cv=${resume.id}`,
    cancel_url: `${origin}/?paiement=annule&cv=${resume.id}`,
    client_reference_id: resume.id,
    // Le webhook n'a que ces métadonnées pour savoir quel CV débloquer :
    // elles sont posées ici, côté serveur, et jamais fournies par le client.
    metadata: { resume_id: resume.id, user_id: session.userId },
    line_items: [
      priceId
        ? { price: priceId, quantity: 1 }
        : {
            quantity: 1,
            price_data: {
              currency: price.currency,
              unit_amount: price.amount,
              product_data: { name: `Téléchargement PDF — ${resume.title}` },
            },
          },
    ],
  })

  return json({ url: checkout.url }, 200)
}
