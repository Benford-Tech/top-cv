/**
 * Lecture défensive des réponses de l'API.
 *
 * Une erreur ne revient pas toujours en JSON : une adresse non déployée rend la
 * page 404 de l'hébergeur, une fonction qui plante rend une page d'erreur HTML.
 * Analyser le corps avant d'avoir vérifié le statut fait alors échouer la
 * lecture, et l'échec se confond avec une absence de réseau — ce qui masque la
 * panne réelle derrière un message rassurant.
 */
export async function readJson<T = Record<string, unknown>>(
  response: Response,
): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

/** Message d'erreur nommant la cause réelle plutôt qu'une supposition. */
export function describeFailure(
  response: Response,
  payload: { message?: string } | null,
  fallback: string,
): string {
  // Le serveur a expliqué lui-même : c'est toujours la meilleure information.
  if (payload?.message) return payload.message

  if (response.status === 404) {
    return `Ce service n’est pas déployé sur ce site (404). En développement local, lancez « npm run dev » : les fonctions y sont servies. ${fallback}`
  }
  if (response.status === 401 || response.status === 403) {
    return 'Votre session a expiré. Reconnectez-vous puis réessayez.'
  }
  if (response.status >= 500) {
    return `Le service a rencontré une erreur (${response.status}). Réessayez dans un instant. ${fallback}`
  }
  return `La requête a échoué (${response.status}). ${fallback}`
}

/** Message pour un échec réseau, quand aucune réponse n'est parvenue. */
export function describeNetworkFailure(fallback: string): string {
  return `Le service n’a pas pu être joint : vérifiez votre connexion. ${fallback}`
}
