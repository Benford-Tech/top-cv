import type { ReactNode } from 'react'
import { formatRange } from '../../../lib/format'
import {
  Bullets,
  RecommendationList,
  contactItems,
  fullName,
  type TemplateProps,
} from './parts'

/**
 * Rubriques numérotées, formation en tête, aucune icône ni pastille.
 *
 * L'ordre est le fond du modèle : dans l'enseignement et la recherche, le
 * diplôme précède le poste, contrairement à tous les autres modèles d'ici.
 * Le numéro donne au document l'allure d'un dossier, ce qui est la convention
 * de ces milieux.
 */
export function Academique({ resume, accent }: TemplateProps) {
  const { personal, labels } = resume
  const contacts = contactItems(personal)

  // Le compteur est tenu à la construction : les rubriques vides ne prennent
  // pas de numéro, sinon la suite paraîtrait trouée.
  let counter = 0
  const section = (title: string, children: ReactNode) => {
    counter += 1
    return (
      <section style={{ marginBottom: '7mm' }}>
        <h2
          style={{
            fontSize: '0.95em',
            fontWeight: 700,
            color: '#111827',
            borderBottom: `1px solid ${accent}`,
            paddingBottom: '0.3em',
            marginBottom: '0.8em',
          }}
        >
          <span style={{ color: accent, marginRight: '0.5em' }}>{counter}.</span>
          {title}
        </h2>
        {children}
      </section>
    )
  }

  const entry = (
    title: string,
    org: string,
    range: string,
    description?: string,
    bullets?: string,
  ) => (
    <div className="avoid-break" style={{ marginBottom: '4mm' }}>
      <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.98em' }}>{title}</h3>
      {/* Point médian et non tiret : la plage de dates porte déjà un tiret,
          « Université Lyon 2 — 2016 — 2018 » se lisait mal. */}
      <p style={{ fontSize: '0.88em', color: '#4b5563' }}>
        {[org, range].filter(Boolean).join(' · ')}
      </p>
      {bullets ? <Bullets text={bullets} style={{ color: '#374151', fontSize: '0.9em' }} /> : null}
      {description ? (
        <p style={{ fontSize: '0.9em', color: '#374151', marginTop: '0.2em' }}>{description}</p>
      ) : null}
    </div>
  )

  return (
    <div style={{ padding: '18mm 18mm 14mm', color: '#111827' }}>
      <header style={{ marginBottom: '8mm' }}>
        <h1 style={{ fontSize: '1.85em', fontWeight: 700, lineHeight: 1.15 }}>
          {fullName(personal) || 'Votre nom'}
        </h1>
        {personal.title ? (
          <p style={{ fontSize: '1em', color: '#4b5563', marginTop: '0.15em' }}>{personal.title}</p>
        ) : null}
        {contacts.length > 0 ? (
          <p style={{ fontSize: '0.84em', color: '#6b7280', marginTop: '0.6em', lineHeight: 1.7 }}>
            {contacts.map((item) => item.value).join(' — ')}
          </p>
        ) : null}
      </header>

      {resume.summary.trim()
        ? section(
            labels.summary,
            <p
              style={{
                lineHeight: 1.65,
                color: '#374151',
                whiteSpace: 'pre-line',
                textAlign: 'justify',
              }}
            >
              {resume.summary}
            </p>,
          )
        : null}

      {/* La formation d'abord : c'est la convention du milieu. */}
      {resume.education.length > 0
        ? section(
            labels.education,
            resume.education.map((item) => (
              <div key={item.id}>
                {entry(
                  item.degree,
                  [item.school, item.city].filter(Boolean).join(', '),
                  formatRange(item.start, item.end, false),
                  item.description,
                )}
              </div>
            )),
          )
        : null}

      {resume.experiences.length > 0
        ? section(
            labels.experiences,
            resume.experiences.map((item) => (
              <div key={item.id}>
                {entry(
                  item.position,
                  [item.company, item.city].filter(Boolean).join(', '),
                  formatRange(item.start, item.end, item.current),
                  undefined,
                  item.description,
                )}
              </div>
            )),
          )
        : null}

      {resume.skills.length > 0
        ? section(
            labels.skills,
            <p style={{ lineHeight: 1.8, color: '#374151' }}>
              {resume.skills
                .filter((item) => item.name.trim())
                .map((item) => item.name)
                .join(' ; ')}
            </p>,
          )
        : null}

      {resume.languages.length > 0
        ? section(
            labels.languages,
            <p style={{ lineHeight: 1.8, color: '#374151' }}>
              {resume.languages
                .filter((item) => item.name.trim())
                // Le niveau porte souvent déjà sa parenthèse (« Courant (C1) ») :
                // l'encadrer une seconde fois donnait « (Courant (C1)) ».
                .map((item) => (item.level ? `${item.name} — ${item.level}` : item.name))
                .join(' ; ')}
            </p>,
          )
        : null}

      {resume.recommendations.length > 0
        ? section(
            labels.recommendations,
            <RecommendationList items={resume.recommendations} accent={accent} />,
          )
        : null}
    </div>
  )
}
