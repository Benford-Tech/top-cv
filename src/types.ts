export type Personal = {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  city: string
  website: string
  linkedin: string
  /** Photo encodée en data URL — reste dans le navigateur, jamais envoyée sur un serveur. */
  photo: string
}

export type Experience = {
  id: string
  position: string
  company: string
  city: string
  start: string
  end: string
  current: boolean
  description: string
}

export type Education = {
  id: string
  degree: string
  school: string
  city: string
  start: string
  end: string
  description: string
}

export type Skill = {
  id: string
  name: string
  /** 1 à 5 — affiché en jauge par les modèles qui la montrent. */
  level: number
}

export type Language = {
  id: string
  name: string
  level: string
}

export type Recommendation = {
  id: string
  author: string
  /** Poste et société de l'auteur, tels qu'ils apparaissaient au moment de l'écriture. */
  role: string
  text: string
}

export type TemplateId =
  | 'moderne'
  | 'classique'
  | 'colonne'
  | 'minimal'
  | 'creatif'
  | 'elegant'
  | 'compact'
  | 'technique'
  | 'academique'
  | 'ats'
  | 'portrait'
  | 'ardoise'
  | 'cartes'

export type Settings = {
  template: TemplateId
  accent: string
  font: FontId
  /** Échelle typographique globale du document, 0.85 à 1.15. */
  scale: number
  showPhoto: boolean
  showSkillLevels: boolean
}

export type FontId = 'inter' | 'lato' | 'serif' | 'slab'

export type SectionId =
  | 'summary'
  | 'experiences'
  | 'education'
  | 'skills'
  | 'languages'
  | 'recommendations'

export type Resume = {
  personal: Personal
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  recommendations: Recommendation[]
  /** Titres personnalisables des sections du CV. */
  labels: Record<SectionId, string>
  settings: Settings
}
