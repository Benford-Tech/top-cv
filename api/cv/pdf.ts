import type { Resume } from '../../src/types'
import { authenticate, config, json, notConfigured, unauthorized } from '../_lib/auth'
import { renderResumeHtml } from '../_lib/renderResume'
import { renderPdf } from '../_lib/pdf'
import { priceConfig } from '../_lib/price'

export const runtime = 'nodejs'
// Chromium démarre lentement à froid et le rendu d'un CV long prend quelques
// secondes : la limite par défaut de 10 s est trop courte.
export const maxDuration = 60

/**
 * Unique voie d'obtention du CV en PDF.
 *
 * Le document est fabriqué ici, à partir des données stockées en base, et n'est
 * remis qu'à un utilisateur authentifié dont le CV a été payé. Rien de tout
 * cela n'est contournable depuis le navigateur : l'aperçu à l'écran est
 * filigrané et l'impression y est neutralisée.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405)

  const { url, anonKey } = config()
  if (!url || !anonKey) return notConfigured()

  const session = await authenticate(request)
  if (!session) return unauthorized()

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return json({ error: 'bad_request', message: 'Identifiant de CV manquant.' }, 400)

  // RLS s'applique : un identifiant volé ne donne rien s'il n'appartient pas
  // à l'utilisateur authentifié.
  const { data, error } = await session.client
    .from('resumes')
    .select('id, title, data, paid')
    .eq('id', id)
    .maybeSingle()

  if (error) return json({ error: 'db_error', message: error.message }, 500)
  if (!data) return json({ error: 'not_found' }, 404)

  if (!data.paid) {
    // Le montant accompagne le refus : l'interface peut l'annoncer avant
    // d'envoyer qui que ce soit vers le paiement, et il vient de la même
    // source que celui facturé.
    const price = priceConfig()
    return json(
      {
        error: 'payment_required',
        message: 'Ce CV n’a pas encore été débloqué.',
        resumeId: data.id,
        amount: price.amount,
        currency: price.currency,
      },
      402,
    )
  }

  const resume = data.data as Resume
  const pdf = await renderPdf(renderResumeHtml(resume))
  const name =
    [resume.personal?.firstName, resume.personal?.lastName].filter(Boolean).join('-') || 'cv'

  return new Response(pdf as BodyInit, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="CV-${encodeURIComponent(name)}.pdf"`,
      // Un CV est une donnée personnelle : il ne doit être mis en cache ni par
      // le navigateur ni par le CDN.
      'cache-control': 'private, no-store',
    },
  })
}
