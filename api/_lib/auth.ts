import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export function config() {
  return {
    url: process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '',
    anonKey: process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  }
}

export function notConfigured(): Response {
  return json(
    {
      error: 'not_configured',
      message:
        'Supabase n’est pas configuré sur ce déploiement (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY).',
    },
    501,
  )
}

/**
 * Client agissant avec les droits de service : contourne RLS. Réservé au
 * webhook de paiement, seul endroit légitime pour accorder un téléchargement.
 */
export function serviceClient(): SupabaseClient | null {
  const { url, serviceKey } = config()
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

export type Authenticated = { userId: string; client: SupabaseClient }

/**
 * Vérifie le jeton porté par la requête auprès de Supabase et renvoie un client
 * agissant au nom de cet utilisateur : toutes ses requêtes restent soumises aux
 * politiques RLS, ce qui évite d'avoir à répéter les contrôles de propriété.
 */
export async function authenticate(request: Request): Promise<Authenticated | null> {
  const { url, anonKey } = config()
  if (!url || !anonKey) return null

  const header = request.headers.get('authorization') ?? ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token) return null

  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data, error } = await client.auth.getUser()
  if (error || !data.user) return null

  return { userId: data.user.id, client }
}

export function unauthorized(): Response {
  return json({ error: 'unauthorized', message: 'Connectez-vous pour continuer.' }, 401)
}
