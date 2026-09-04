import { describe, expect, it } from 'vitest'
import { extractDocxParagraphs } from '../docx'
import { findRange, parseResumeLines, splitCity } from '../cvParser'

/**
 * Les dispositions ci-dessous sont celles rencontrées sur de vrais CV Word.
 * Chacune a cassé au moins une fois : ce fichier existe pour qu'elles ne
 * cassent pas une troisième.
 */

describe('findRange — repérage des dates', () => {
  it('lit une plage de mois nommés', () => {
    expect(findRange('Mars 2021 – Février 2023')).toMatchObject({
      start: '2021-03',
      end: '2023-02',
      current: false,
    })
  })

  // Word remplace l'apostrophe droite par une courbe pendant la frappe : le
  // motif ne voyait plus « Aujourd'hui », et l'expérience en cours disparaissait
  // complètement de l'import.
  it('reconnaît « Aujourd’hui » avec l’apostrophe courbe de Word', () => {
    expect(findRange('Mars 2021 – Aujourd’hui')).toMatchObject({
      start: '2021-03',
      end: '',
      current: true,
    })
  })

  it('accepte les mois accentués', () => {
    expect(findRange('Février 2018 - Août 2020')).toMatchObject({
      start: '2018-02',
      end: '2020-08',
    })
  })

  it('lit « Depuis 2021 » comme un poste en cours', () => {
    expect(findRange('Depuis 2021')).toMatchObject({ start: '2021', current: true })
  })

  // « Acme 2019 » se lisait comme « mois année » : l'employeur partait avec la
  // date, et l'intitulé se retrouvait amputé.
  it('ne prend pas un mot quelconque pour un nom de mois', () => {
    const range = findRange('Chef de projet chez Acme    2019 – 2022')
    expect(range).toMatchObject({ start: '2019', end: '2022' })
    expect(range?.rest).toBe('Chef de projet chez Acme')
  })

  // Retirer tous les séparateurs effaçait le tiret sur lequel l'intitulé se
  // sépare de l'employeur.
  it('conserve le tiret intérieur, ne retire que les séparateurs de bordure', () => {
    expect(findRange('2019 – 2022 : Chef de projet — Acme')?.rest).toBe('Chef de projet — Acme')
  })

  it('ne voit pas de date là où il n’y en a pas', () => {
    expect(findRange('Pilotage du plan de communication annuel.')).toBeNull()
  })
})

describe('splitCity — ville collée à l’employeur', () => {
  it('détache une ville en fin de chaîne', () => {
    expect(splitCity('Groupe Verlaine, Lyon')).toEqual({ value: 'Groupe Verlaine', city: 'Lyon' })
  })

  it('laisse une forme juridique tranquille', () => {
    expect(splitCity('Acme, Inc.')).toEqual({ value: 'Acme, Inc.', city: '' })
  })

  it('laisse un segment chiffré ou trop long tranquille', () => {
    expect(splitCity('Université Lyon, 2 bis rue Neuve')).toEqual({
      value: 'Université Lyon, 2 bis rue Neuve',
      city: '',
    })
  })

  it('ne fait rien sans virgule', () => {
    expect(splitCity('Mairie de Villeurbanne')).toEqual({
      value: 'Mairie de Villeurbanne',
      city: '',
    })
  })
})

describe('parseResumeLines — dispositions rencontrées sur les CV Word', () => {
  const withHeading = (...lines: string[]) => ['Expérience professionnelle', ...lines]

  // La disposition la plus répandue sous Word, et celle qui ne marchait pas :
  // la date seule sur sa ligne, l'intitulé juste en dessous. L'intitulé
  // atterrissait dans le descriptif et le poste restait vide.
  it('date au-dessus de l’intitulé', () => {
    const { experiences } = parseResumeLines(
      withHeading(
        'Mars 2021 – Aujourd’hui',
        'Chargée de communication senior — Groupe Verlaine, Lyon',
        '• Pilotage du plan annuel.',
      ),
    )
    expect(experiences).toHaveLength(1)
    expect(experiences[0]).toMatchObject({
      position: 'Chargée de communication senior',
      company: 'Groupe Verlaine',
      city: 'Lyon',
      start: '2021-03',
      current: true,
      description: '• Pilotage du plan annuel.',
    })
  })

  it('intitulé au-dessus de la date', () => {
    const { experiences } = parseResumeLines(
      withHeading('Chargée de communication — Agence Nord Sud, Paris', 'Septembre 2018 – Février 2021'),
    )
    expect(experiences[0]).toMatchObject({
      position: 'Chargée de communication',
      company: 'Agence Nord Sud',
      city: 'Paris',
      start: '2018-09',
      end: '2021-02',
    })
  })

  it('tout sur une seule ligne', () => {
    const { experiences } = parseResumeLines(withHeading('2019 – 2022 : Chef de projet — Acme'))
    expect(experiences[0]).toMatchObject({ position: 'Chef de projet', company: 'Acme' })
  })

  it('« chez » avec la date rejetée à droite', () => {
    const { experiences } = parseResumeLines(withHeading('Chef de projet chez Acme    2019 – 2022'))
    expect(experiences[0]).toMatchObject({ position: 'Chef de projet', company: 'Acme' })
  })

  // Une puce appartient toujours au descriptif : la prendre pour un intitulé
  // serait pire que de laisser le poste vide.
  it('ne prend jamais une puce pour un intitulé', () => {
    const { experiences } = parseResumeLines(
      withHeading('Mars 2021 – Aujourd’hui', '• Pilotage du plan annuel.'),
    )
    expect(experiences[0].position).toBe('')
    expect(experiences[0].description).toBe('• Pilotage du plan annuel.')
  })

  it('sépare diplôme et établissement', () => {
    const { education } = parseResumeLines([
      'Formation',
      '2015 – 2017',
      'Master Communication des organisations, Université Lyon 2',
    ])
    expect(education[0]).toMatchObject({
      degree: 'Master Communication des organisations',
      school: 'Université Lyon 2',
      start: '2015',
      end: '2017',
    })
  })

  it('lit l’identité, la ville et le téléphone de l’en-tête', () => {
    const parsed = parseResumeLines([
      'Camille Moreau',
      'Chargée de communication',
      'camille.moreau@example.com | +33 6 12 34 56 78',
      '12 rue des Lilas, 69003 Lyon',
    ])
    expect(parsed).toMatchObject({
      firstName: 'Camille',
      lastName: 'Moreau',
      headline: 'Chargée de communication',
      email: 'camille.moreau@example.com',
      phone: '+33 6 12 34 56 78',
      // Le champ attend une ville, pas une adresse postale complète.
      city: 'Lyon',
    })
  })

  it('lit les trois écritures de niveau de langue', () => {
    const { languages } = parseResumeLines([
      'Langues',
      'Français (langue maternelle)',
      'Anglais : courant',
      'Espagnol - notions',
    ])
    expect(languages).toEqual([
      expect.objectContaining({ name: 'Français', level: 'langue maternelle' }),
      expect.objectContaining({ name: 'Anglais', level: 'courant' }),
      expect.objectContaining({ name: 'Espagnol', level: 'notions' }),
    ])
  })
})

describe('extractDocxParagraphs', () => {
  it('rend un paragraphe par bloc, tabulations converties en espaces', () => {
    const xml =
      '<w:body>' +
      '<w:p><w:r><w:t>Master de gestion</w:t></w:r><w:r><w:tab/><w:t>2015 – 2017</w:t></w:r></w:p>' +
      '<w:p/>' +
      '<w:p><w:r><w:t>Universit&#233; Lyon 2</w:t></w:r></w:p>' +
      '</w:body>'
    expect(extractDocxParagraphs(xml)).toEqual(['Master de gestion 2015 – 2017', 'Université Lyon 2'])
  })
})
