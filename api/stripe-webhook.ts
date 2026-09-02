import Stripe from 'stripe'
import { json, serviceClient } from './_lib/auth'

export const runtime = 'nodejs'

/**
 * Seul chemin par lequel un CV devient téléchargeable. Il n'est jamais appelé
 * par le navigateur : Stripe le contacte directement, et la signature prouve
 * l'origine du message.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const secret = process.env.STRIPE_SECRET_KEY
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !signingSecret) {
    return json({ error: 'not_configured' }, 501)
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return json({ error: 'missing_signature' }, 400)

  const stripe = new Stripe(secret)
  // La signature se vérifie sur le corps brut : `text()` le rend tel quel,
  // sans passer par un analyseur JSON qui en changerait un octet.
  const raw = await request.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, signingSecret)
  } catch {
    // Sans signature valide, la requête est ignorée : c'est ce contrôle qui
    // empêche n'importe qui de s'accorder un téléchargement en appelant l'URL.
    return json({ error: 'invalid_signature' }, 400)
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ received: true, ignored: event.type }, 200)
  }

  const checkout = event.data.object as Stripe.Checkout.Session
  if (checkout.payment_status !== 'paid') {
    return json({ received: true, ignored: 'unpaid' }, 200)
  }

  const resumeId = checkout.metadata?.resume_id ?? checkout.client_reference_id
  if (!resumeId) return json({ error: 'missing_resume' }, 400)

  const admin = serviceClient()
  if (!admin) return json({ error: 'not_configured' }, 501)

  const { error } = await admin
    .from('resumes')
    .update({
      paid: true,
      paid_at: new Date().toISOString(),
      stripe_session_id: checkout.id,
    })
    .eq('id', resumeId)

  if (error) {
    // Renvoyer une erreur laisse Stripe réessayer : mieux vaut une nouvelle
    // tentative qu'un paiement encaissé sans déblocage.
    return json({ error: 'db_error', message: error.message }, 500)
  }

  return json({ received: true }, 200)
}
