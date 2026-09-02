/**
 * Lecteur CSV conforme à RFC 4180 : les exports LinkedIn contiennent des
 * descriptions de poste multilignes et des guillemets échappés à l'intérieur
 * des champs, qu'un simple `split(',')` casserait.
 */
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  let index = 0

  const endField = () => {
    row.push(field)
    field = ''
  }
  const endRow = () => {
    endField()
    // Une ligne vide en fin de fichier n'est pas une donnée.
    if (row.length > 1 || row[0] !== '') rows.push(row)
    row = []
  }

  while (index < text.length) {
    const char = text[index]

    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"'
          index += 2
          continue
        }
        quoted = false
        index += 1
        continue
      }
      field += char
      index += 1
      continue
    }

    if (char === '"') {
      quoted = true
      index += 1
      continue
    }
    if (char === ',') {
      endField()
      index += 1
      continue
    }
    if (char === '\r') {
      index += 1
      continue
    }
    if (char === '\n') {
      endRow()
      index += 1
      continue
    }
    field += char
    index += 1
  }

  if (field !== '' || row.length > 0) endRow()
  return rows
}

export type CsvRow = Record<string, string>

/**
 * Transforme un CSV en enregistrements indexés par en-tête normalisé
 * (minuscules, sans accents ni ponctuation) : les intitulés de colonnes
 * varient d'une version d'export à l'autre, la comparaison doit être souple.
 */
export function toRecords(input: string): CsvRow[] {
  const rows = parseCsv(input)
  if (rows.length < 2) return []
  const headers = rows[0].map(normalizeKey)
  return rows.slice(1).map((cells) => {
    const record: CsvRow = {}
    headers.forEach((header, position) => {
      record[header] = (cells[position] ?? '').trim()
    })
    return record
  })
}

export function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

/** Premier champ non vide parmi plusieurs intitulés possibles. */
export function pick(row: CsvRow, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[normalizeKey(key)]
    if (value) return value
  }
  return ''
}
