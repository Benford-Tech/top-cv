import { describe, expect, it } from 'vitest'
import { readPageText, type TextItem } from '../pdfText'

/**
 * Les fragments sont décrits comme pdfjs les rend : `y` croît vers le haut,
 * `x` part de la gauche. Une page A4 fait 595 points de large.
 */
const PAGE = 595

function item(str: string, x: number, y: number, width = str.length * 4.5): TextItem {
  return { str, x, y, width, height: 10 }
}

/** Deux colonnes : gauche à x=40, droite à x=350, sur les mêmes hauteurs. */
function twoColumns(): TextItem[] {
  const left: [string, number][] = [
    ['EXPÉRIENCE PROFESSIONNELLE', 700],
    ['Consultante en stratégie et transformation', 680],
    ['WAVESTONE – Consulting | févr. 2018 — mars 2021', 660],
    ['Conduite du changement avec un focus sur le RUN', 640],
    ['dont : audit du modèle de support informatique.', 620],
    ['Consultante junior', 590],
    ['ACCENTURE, Paris | sept. 2016 — janv. 2018', 570],
    ['Cadrage fonctionnel de projets SI bancaires.', 550],
  ]
  const right: [string, number][] = [
    ['COMPÉTENCES', 700],
    ['Conduite du changement', 680],
    ['Gestion de projet / programme', 660],
    ['Gouvernance / TOM / RUN', 640],
    ['LANGUES', 620],
    ['Arabe — Maternelle', 590],
    ['Anglais — Bilingue', 570],
    ['Espagnol — Bilingue', 550],
  ]
  return [
    ...left.map(([text, y]) => item(text, 40, y, 240)),
    ...right.map(([text, y]) => item(text, 350, y, 180)),
  ]
}

describe('readPageText — colonnes', () => {
  // Le lecteur précédent groupait sur la seule hauteur : les fragments de
  // gauche et de droite partageant une ligne se collaient bout à bout, ce qui
  // donnait « Parties prenantes en France, US et Chine Développement
  // commercial » et versait les langues dans les compétences.
  it('lit une colonne entière avant l’autre, sans jamais les coller', () => {
    const lines = readPageText(twoColumns(), PAGE)

    expect(lines[0]).toBe('EXPÉRIENCE PROFESSIONNELLE')
    expect(lines).toContain('COMPÉTENCES')
    expect(lines).toContain('LANGUES')
    // Aucune ligne ne porte du texte des deux colonnes.
    for (const line of lines) {
      expect(line.includes('WAVESTONE') && line.includes('COMPÉTENCES')).toBe(false)
      expect(line.includes('Consultante') && line.includes('Conduite')).toBe(false)
    }
    // L’ordre reste celui de la lecture : toute la gauche, puis toute la droite.
    expect(lines.indexOf('COMPÉTENCES')).toBeGreaterThan(
      lines.findIndex((line) => line.startsWith('WAVESTONE')),
    )
  })

  it('laisse une page d’un seul tenant intacte', () => {
    const single = [
      item('Camille Moreau', 40, 760, 90),
      item('EXPÉRIENCE PROFESSIONNELLE', 40, 720, 220),
      item('Chargée de communication — Groupe Verlaine', 40, 700, 260),
    ]
    expect(readPageText(single, PAGE)).toEqual([
      'Camille Moreau',
      'EXPÉRIENCE PROFESSIONNELLE',
      'Chargée de communication — Groupe Verlaine',
    ])
  })

  // Une bande étroite — dates en marge, filet décoratif — n’est pas une colonne.
  it('ne prend pas une marge étroite pour une colonne', () => {
    const withMargin = [
      ...Array.from({ length: 16 }, (_, index) =>
        item(`Ligne de contenu numéro ${index}`, 120, 700 - index * 20, 300),
      ),
      item('2021', 40, 700, 25),
    ]
    const lines = readPageText(withMargin, PAGE)
    expect(lines[0]).toContain('2021')
    expect(lines[0]).toContain('Ligne de contenu numéro 0')
  })
})

describe('readPageText — replis et mentions', () => {
  it('recolle un paragraphe replié sur plusieurs lignes', () => {
    const wrapped = [
      item('Participation à plusieurs missions chez des clients variés axées', 40, 700, 300),
      item('sur la stratégie IT et la conduite du changement avec un focus', 40, 685, 300),
      item('sur le RUN dont : audit du modèle de support.', 40, 670, 300),
      item('Construire la stratégie d’un nouveau modèle de support.', 40, 650, 300),
    ]
    expect(readPageText(wrapped, PAGE)).toEqual([
      'Participation à plusieurs missions chez des clients variés axées sur la stratégie IT et la conduite du changement avec un focus sur le RUN dont : audit du modèle de support.',
      'Construire la stratégie d’un nouveau modèle de support.',
    ])
  })

  // « … Conduite du changement | » appelle manifestement la suite, même si
  // celle-ci commence par une majuscule.
  it('recolle après un séparateur laissé en suspens', () => {
    const dangling = [
      item('Mission de Contract Management : Collaboration transverse |', 40, 700, 300),
      item('Parties prenantes en France, US et Chine', 40, 685, 250),
    ]
    expect(readPageText(dangling, PAGE)).toEqual([
      'Mission de Contract Management : Collaboration transverse | Parties prenantes en France, US et Chine',
    ])
  })

  it('ne soude pas le titre du CV à la ligne de contact', () => {
    const header = [
      item('Consultante en transformation digitale', 40, 760, 200),
      item('nadia.benali@example.com · 06 11 22 33 44 · Paris', 40, 745, 260),
    ]
    expect(readPageText(header, PAGE)).toHaveLength(2)
  })

  // Ces mentions arrivent en tête de page et étaient prises pour le nom.
  it('écarte les mentions des banques de modèles', () => {
    const credited = [
      item('This template was created by Slidesgo', 40, 780, 200),
      item('Slidesgo', 40, 760, 50),
      item('Nadia Benali', 40, 740, 80),
    ]
    expect(readPageText(credited, PAGE)).toEqual(['Nadia Benali'])
  })

  it('rétablit les blancs que le PDF ne code pas', () => {
    const split = [item('Nadia', 40, 700, 30), item('Benali', 80, 700, 34)]
    expect(readPageText(split, PAGE)).toEqual(['Nadia Benali'])
  })
})
