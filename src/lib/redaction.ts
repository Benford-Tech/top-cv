/**
 * Aide à la rédaction, côté navigateur.
 *
 * Le texte arrive au fil de l'eau : `onText` reçoit le passage complet à
 * chaque fragment, pour que l'appelant se contente de l'afficher.
 */

export type RedactionIntent = 'improve' | 'shorten' | 'quantify' | 'write'
export type RedactionKind = 'summary' | 'bullets'

export type RedactionRequest = {
  kind: RedactionKind
  intent: RedactionIntent
  text: string
  role?: string
  company?: string
}

export class RedactionError extends Error {
  /** `not_configured` fait disparaître l'aide de l'interface, sans erreur. */
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

async function describe(response: Response): Promise<RedactionError> {
  const fallback = `Le service de rédaction a répondu ${response.status}.`
  try {
    const payload = (await response.json()) as { error?: string; message?: string }
    return new RedactionError(payload.error ?? 'error', payload.message || fallback)
  } catch {
    return new RedactionError('error', fallback)
  }
}

export async function streamRedaction(
  request: RedactionRequest,
  options: {
    token: string | null
    onText: (text: string) => void
    signal?: AbortSignal
  },
): Promise<string> {
  if (!options.token) {
    throw new RedactionError('unauthorized', 'Connectez-vous pour utiliser l’aide à la rédaction.')
  }

  let response: Response
  try {
    response = await fetch('/api/redaction', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${options.token}`,
      },
      body: JSON.stringify(request),
      signal: options.signal,
    })
  } catch (failure) {
    if (failure instanceof DOMException && failure.name === 'AbortError') throw failure
    throw new RedactionError(
      'network',
      'Le service de rédaction est injoignable. Sur un déploiement sans fonction serveur, il n’existe pas.',
    )
  }

  // Le statut d'abord : le corps d'une erreur est du JSON, celui d'un succès
  // est du texte brut.
  if (!response.ok || !response.body) throw await describe(response)

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let text = ''

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      options.onText(text)
    }
  } finally {
    reader.releaseLock()
  }

  return text.trim()
}

/**
 * Disponibilité du service, demandée une seule fois par session : sans clé
 * configurée, l'interface n'a pas à proposer un bouton qui échouera.
 */
let availability: Promise<boolean> | null = null

export function redactionAvailable(): Promise<boolean> {
  availability ??= fetch('/api/redaction', { method: 'POST' })
    // 501 est le seul refus qui signifie « ce déploiement n'a pas ce service ».
    // 401 signifie l'inverse : il existe, il demande un compte.
    .then((response) => response.status !== 501 && response.status !== 404)
    .catch(() => false)
  return availability
}
