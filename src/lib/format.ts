const MONTHS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
]

/** Rend une valeur `<input type="month">` (« 2021-03 ») ou une année seule. */
export function formatDate(value: string): string {
  if (!value) return ''
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return value
  const month = MONTHS[Number(match[2]) - 1]
  return month ? `${month} ${match[1]}` : match[1]
}

export function formatRange(start: string, end: string, current: boolean): string {
  const from = formatDate(start)
  const to = current ? "aujourd'hui" : formatDate(end)
  if (from && to) return `${from} — ${to}`
  return from || to
}

/** Découpe une description multiligne en puces, en retirant les tirets déjà saisis. */
export function toBullets(description: string): string[] {
  return description
    .split('\n')
    .map((line) => line.replace(/^\s*[-•–]\s*/, '').trim())
    .filter(Boolean)
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/** Nom de fichier sûr pour l'export JSON, dérivé du nom saisi. */
export function slugify(value: string, fallback: string): string {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}
