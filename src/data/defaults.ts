import type { Resume } from '../types'
import { uid } from '../lib/id'

export const FONTS: { id: Resume['settings']['font']; label: string; stack: string }[] = [
  { id: 'inter', label: 'Inter', stack: '"Inter", system-ui, sans-serif' },
  { id: 'lato', label: 'Lato', stack: '"Lato", system-ui, sans-serif' },
  { id: 'serif', label: 'Source Serif', stack: '"Source Serif 4", Georgia, serif' },
  { id: 'slab', label: 'Roboto Slab', stack: '"Roboto Slab", Georgia, serif' },
]

export const ACCENTS = [
  '#2563eb',
  '#0f766e',
  '#b91c1c',
  '#7c3aed',
  '#c2410c',
  '#1e293b',
  '#be185d',
  '#15803d',
]

export const EMPTY_RESUME: Resume = {
  personal: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    city: '',
    website: '',
    linkedin: '',
    photo: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  labels: {
    summary: 'Profil',
    experiences: 'Expérience professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
  },
  settings: {
    template: 'moderne',
    accent: '#2563eb',
    font: 'inter',
    scale: 1,
    showPhoto: true,
    showSkillLevels: true,
  },
}

/** CV de démonstration : sert d'amorce au premier lancement et de « remplir avec un exemple ». */
export function sampleResume(): Resume {
  return {
    ...EMPTY_RESUME,
    personal: {
      firstName: 'Camille',
      lastName: 'Moreau',
      title: 'Cheffe de projet digital',
      email: 'camille.moreau@example.com',
      phone: '+33 6 12 34 56 78',
      city: 'Lyon, France',
      website: 'camille-moreau.fr',
      linkedin: 'linkedin.com/in/camillemoreau',
      photo: '',
    },
    summary:
      "Cheffe de projet digital avec 7 ans d'expérience dans la conduite de refontes web et d'applications mobiles. J'accompagne des équipes pluridisciplinaires de la cadrage au déploiement, avec un souci constant du délai et de la qualité livrée.",
    experiences: [
      {
        id: uid(),
        position: 'Cheffe de projet digital senior',
        company: 'Atelier Nova',
        city: 'Lyon',
        start: '2021-03',
        end: '',
        current: true,
        description:
          "Pilotage de 6 projets simultanés pour un budget annuel de 1,2 M€.\nRéduction de 30 % des délais de livraison via la mise en place d'un rituel de cadrage hebdomadaire.\nEncadrement d'une équipe de 8 personnes (design, développement, contenu).",
      },
      {
        id: uid(),
        position: 'Chargée de projet web',
        company: 'Studio Kaolin',
        city: 'Villeurbanne',
        start: '2018-09',
        end: '2021-02',
        current: false,
        description:
          "Refonte du site e-commerce d'un client retail : +45 % de conversion sur 12 mois.\nRédaction des cahiers des charges et suivi de la recette fonctionnelle.\nInterlocutrice principale de 12 comptes clients.",
      },
    ],
    education: [
      {
        id: uid(),
        degree: 'Master Management de projets numériques',
        school: 'Université Lyon 2',
        city: 'Lyon',
        start: '2016',
        end: '2018',
        description: 'Mention bien. Mémoire sur la gouvernance des projets agiles en agence.',
      },
      {
        id: uid(),
        degree: 'Licence Information & Communication',
        school: 'Université Grenoble Alpes',
        city: 'Grenoble',
        start: '2013',
        end: '2016',
        description: '',
      },
    ],
    skills: [
      { id: uid(), name: 'Gestion de projet agile', level: 5 },
      { id: uid(), name: 'Jira & Confluence', level: 5 },
      { id: uid(), name: 'Cadrage fonctionnel', level: 4 },
      { id: uid(), name: 'Figma', level: 4 },
      { id: uid(), name: 'Analyse de données', level: 3 },
    ],
    languages: [
      { id: uid(), name: 'Français', level: 'Langue maternelle' },
      { id: uid(), name: 'Anglais', level: 'Courant (C1)' },
      { id: uid(), name: 'Espagnol', level: 'Intermédiaire (B1)' },
    ],
  }
}
