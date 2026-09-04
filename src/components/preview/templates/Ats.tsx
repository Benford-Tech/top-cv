import { formatRange } from '../../../lib/format'
import { toBullets } from '../../../lib/format'
import { contactItems, fullName, type TemplateProps } from './parts'

/**
 * Modèle dépouillé, écrit pour les logiciels de tri (ATS).
 *
 * Une seule colonne, aucune couleur, aucune icône, aucune pastille, aucun
 * caractère décoratif : les puces sont de vraies listes `<ul>`, les intitulés
 * de rubrique des mots courants en majuscules. Ce qui fait trébucher un analyseur
 * automatique — colonnes multiples, texte en image, glyphes exotiques,
 * information logée dans une couleur — est ici absent par construction.
 *
 * L'accent choisi par l'utilisateur n'est volontairement pas utilisé : ce
 * modèle ne doit rien porter en couleur.
 */
export function Ats({ resume }: TemplateProps) {
  const { personal, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <h2
      style={{
        fontSize: '1em',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#000',
        marginTop: '5mm',
        marginBottom: '1.5mm',
      }}
    >
      {text}
    </h2>
  )

  const lines = (text: string) => {
    const bullets = toBullets(text)
    if (bullets.length === 0) return null
    return (
      <ul style={{ margin: '0.3em 0 0', paddingLeft: '1.1em', listStyleType: 'disc' }}>
        {bullets.map((line, index) => (
          <li key={index} style={{ lineHeight: 1.5, marginBottom: '0.15em' }}>
            {line}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div style={{ padding: '16mm 16mm 14mm', color: '#000', lineHeight: 1.5 }}>
      <header style={{ marginBottom: '3mm' }}>
        <h1 style={{ fontSize: '1.6em', fontWeight: 700 }}>
          {fullName(personal) || 'Votre nom'}
        </h1>
        {personal.title ? <p style={{ fontSize: '1em' }}>{personal.title}</p> : null}
        {contacts.length > 0 ? (
          // Une coordonnée par ligne : un analyseur automatique les isole plus
          // sûrement ainsi que séparées par un caractère qu'il faut deviner.
          <div style={{ fontSize: '0.9em', marginTop: '0.4em' }}>
            {contacts.map((item) => (
              <div key={item.key}>{item.value}</div>
            ))}
          </div>
        ) : null}
      </header>

      {resume.summary.trim() ? (
        <section>
          {heading(labels.summary)}
          <p style={{ whiteSpace: 'pre-line' }}>{resume.summary}</p>
        </section>
      ) : null}

      {resume.experiences.length > 0 ? (
        <section>
          {heading(labels.experiences)}
          {resume.experiences.map((item) => (
            <div key={item.id} className="avoid-break" style={{ marginBottom: '4mm' }}>
              <p style={{ fontWeight: 700 }}>{item.position}</p>
              <p>
                {[item.company, item.city, formatRange(item.start, item.end, item.current)]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {lines(item.description)}
            </div>
          ))}
        </section>
      ) : null}

      {resume.education.length > 0 ? (
        <section>
          {heading(labels.education)}
          {resume.education.map((item) => (
            <div key={item.id} className="avoid-break" style={{ marginBottom: '3mm' }}>
              <p style={{ fontWeight: 700 }}>{item.degree}</p>
              <p>
                {[item.school, item.city, formatRange(item.start, item.end, false)]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {item.description ? <p>{item.description}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {resume.skills.length > 0 ? (
        <section>
          {heading(labels.skills)}
          <p>
            {resume.skills
              .filter((item) => item.name.trim())
              .map((item) => item.name)
              .join(', ')}
          </p>
        </section>
      ) : null}

      {resume.languages.length > 0 ? (
        <section>
          {heading(labels.languages)}
          <p>
            {resume.languages
              .filter((item) => item.name.trim())
              .map((item) => (item.level ? `${item.name} : ${item.level}` : item.name))
              .join(', ')}
          </p>
        </section>
      ) : null}

      {resume.recommendations.length > 0 ? (
        <section>
          {heading(labels.recommendations)}
          {resume.recommendations.map((item) => (
            <div key={item.id} className="avoid-break" style={{ marginBottom: '3mm' }}>
              <p>{item.text}</p>
              <p style={{ fontWeight: 700 }}>
                {[item.author, item.role].filter(Boolean).join(', ')}
              </p>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  )
}
