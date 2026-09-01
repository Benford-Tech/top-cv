/** Identifiant court et stable pour les entrées répétables (expériences, formations…). */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}
