import { authenticate, config, json, notConfigured, unauthorized } from './_lib/auth'

export const runtime = 'nodejs'

/** CV de l'utilisateur : liste, création, mise à jour, suppression. */
export default async function handler(request: Request): Promise<Response> {
  const { url, anonKey } = config()
  if (!url || !anonKey) return notConfigured()

  const session = await authenticate(request)
  if (!session) return unauthorized()

  const id = new URL(request.url).searchParams.get('id')

  if (request.method === 'GET') {
    if (id) {
      const { data, error } = await session.client
        .from('resumes')
        .select('id, title, data, paid, paid_at, updated_at')
        .eq('id', id)
        .maybeSingle()
      if (error) return json({ error: 'db_error', message: error.message }, 500)
      if (!data) return json({ error: 'not_found' }, 404)
      return json(data, 200)
    }
    const { data, error } = await session.client
      .from('resumes')
      .select('id, title, paid, updated_at')
      .order('updated_at', { ascending: false })
    if (error) return json({ error: 'db_error', message: error.message }, 500)
    return json({ resumes: data ?? [] }, 200)
  }

  if (request.method === 'POST') {
    const body = (await request.json().catch(() => null)) as
      | { title?: string; data?: unknown }
      | null
    if (!body?.data) return json({ error: 'bad_request', message: 'CV manquant.' }, 400)

    const { data, error } = await session.client
      .from('resumes')
      .insert({ user_id: session.userId, title: body.title ?? 'Mon CV', data: body.data })
      .select('id, title, paid, updated_at')
      .single()
    if (error) return json({ error: 'db_error', message: error.message }, 500)
    return json(data, 201)
  }

  if (request.method === 'PUT') {
    if (!id) return json({ error: 'bad_request', message: 'Identifiant manquant.' }, 400)
    const body = (await request.json().catch(() => null)) as
      | { title?: string; data?: unknown }
      | null
    if (!body?.data) return json({ error: 'bad_request', message: 'CV manquant.' }, 400)

    // Seules `title` et `data` sont écrites ici. Le droit de téléchargement
    // n'est pas modifiable par ce chemin, ni par aucun autre côté client :
    // la base retire au rôle authentifié l'écriture sur les colonnes de paiement.
    const { data, error } = await session.client
      .from('resumes')
      .update({ title: body.title ?? 'Mon CV', data: body.data })
      .eq('id', id)
      .select('id, title, updated_at')
      .maybeSingle()
    if (error) return json({ error: 'db_error', message: error.message }, 500)
    if (!data) return json({ error: 'not_found' }, 404)
    return json(data, 200)
  }

  if (request.method === 'DELETE') {
    if (!id) return json({ error: 'bad_request', message: 'Identifiant manquant.' }, 400)
    const { error } = await session.client.from('resumes').delete().eq('id', id)
    if (error) return json({ error: 'db_error', message: error.message }, 500)
    return new Response(null, { status: 204 })
  }

  return json({ error: 'method_not_allowed' }, 405)
}
