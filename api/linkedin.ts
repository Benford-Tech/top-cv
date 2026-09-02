import { mapProviderProfile } from '../src/lib/linkedinProfile'

/**
 * Récupération d'un profil LinkedIn à partir de son URL.
 *
 * Pourquoi une fonction serveur plutôt qu'un appel depuis le navigateur :
 * LinkedIn et les fournisseurs de données n'émettent pas d'en-têtes CORS, et
 * une clé d'API n'a rien à faire dans un bundle public. Tout passe donc ici.
 *
 * Aucun fournisseur n'est codé en dur : l'endpoint et la clé se déclarent en
 * variables d'environnement, ce qui permet d'en changer sans toucher au code —
 * utile dans un marché où les acteurs disparaissent (Proxycurl, longtemps la
 * référence, a fermé en juillet 2026 après une action en justice de LinkedIn).
 */
export const config = { runtime: 'nodejs' }

const PROFILE_URL = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[^/?#\s]+\/?$/i

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export default async function handler(request: Request): Promise<Response> {
  const target = new URL(request.url).searchParams.get('url')?.trim() ?? ''

  if (!target) {
    return json({ error: 'Indiquez l’URL d’un profil LinkedIn.' }, 400)
  }

  // On n'accepte qu'une URL de profil : ce point d'entrée ne doit pas servir
  // de relais vers une adresse arbitraire.
  if (!PROFILE_URL.test(target)) {
    return json(
      {
        error:
          'URL non reconnue. Attendu : une adresse de profil du type https://www.linkedin.com/in/identifiant.',
      },
      400,
    )
  }

  const endpoint = process.env.LINKEDIN_API_URL
  const key = process.env.LINKEDIN_API_KEY

  if (!endpoint || !key) {
    // 501 et non 500 : le service est absent, pas en panne. L'interface
    // bascule alors sur l'import d'archive, qui ne dépend de personne.
    return json(
      {
        error: 'not_configured',
        message:
          'Aucun fournisseur de données LinkedIn n’est configuré sur ce déploiement. Utilisez l’import de l’archive LinkedIn, ou renseignez LINKEDIN_API_URL et LINKEDIN_API_KEY.',
      },
      501,
    )
  }

  const param = process.env.LINKEDIN_API_PARAM || 'linkedin_profile_url'
  // Certains fournisseurs attendent la clé en paramètre d'URL plutôt qu'en
  // en-tête. Les deux conventions sont courantes : on prend en charge l'une ou
  // l'autre selon la variable renseignée.
  const keyParam = process.env.LINKEDIN_API_KEY_PARAM
  const authHeader = process.env.LINKEDIN_API_AUTH_HEADER || 'Authorization'
  const authPrefix = process.env.LINKEDIN_API_AUTH_PREFIX ?? 'Bearer '

  const providerUrl = new URL(endpoint)
  providerUrl.searchParams.set(param, target)
  if (keyParam) providerUrl.searchParams.set(keyParam, key)

  const abort = new AbortController()
  const timeout = setTimeout(() => abort.abort(), 15_000)

  try {
    const response = await fetch(providerUrl, {
      headers: keyParam
        ? { accept: 'application/json' }
        : { [authHeader]: `${authPrefix}${key}`, accept: 'application/json' },
      signal: abort.signal,
    })

    if (!response.ok) {
      // Le corps de la réponse du fournisseur peut contenir la clé ou des
      // détails d'infrastructure : on ne renvoie que le code.
      return json(
        {
          error: 'provider_error',
          message: `Le fournisseur a répondu ${response.status}. Profil introuvable, privé, ou quota dépassé.`,
        },
        response.status === 404 ? 404 : 502,
      )
    }

    const payload = (await response.json()) as Record<string, unknown>
    const profile = mapProviderProfile(payload)

    return json(profile, 200)
  } catch (error) {
    const aborted = error instanceof Error && error.name === 'AbortError'
    return json(
      {
        error: aborted ? 'timeout' : 'network_error',
        message: aborted
          ? 'Le fournisseur n’a pas répondu dans le délai imparti.'
          : 'Le fournisseur n’a pas pu être joint.',
      },
      504,
    )
  } finally {
    clearTimeout(timeout)
  }
}
