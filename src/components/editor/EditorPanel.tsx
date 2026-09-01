import { useRef } from 'react'
import type { useResume } from '../../lib/useResume'
import { readPhoto } from '../../lib/image'
import { Button, Field, TextArea, TextInput } from '../ui/controls'
import { Plus } from '../ui/icons'
import { SectionCard } from './SectionCard'
import { EntryCard } from './EntryCard'
import { SuggestionPicker } from './SuggestionPicker'

type Store = ReturnType<typeof useResume>

/** Ajoute une phrase à un texte existant sans écraser ce qui est déjà saisi. */
function append(current: string, phrase: string): string {
  if (!current.trim()) return phrase
  return `${current.replace(/\s+$/, '')}\n${phrase}`
}

export function EditorPanel({ store }: { store: Store }) {
  const { resume, updatePersonal, update, updateLabel, addItem, updateItem, removeItem, moveItem } =
    store
  const photoInput = useRef<HTMLInputElement>(null)

  async function onPhotoChange(file: File | undefined) {
    if (!file) return
    try {
      updatePersonal({ photo: await readPhoto(file) })
    } catch {
      window.alert("Cette image n'a pas pu être chargée. Essayez un fichier JPEG ou PNG.")
    }
  }

  return (
    <div className="space-y-4">
      {/* ---- Informations personnelles ---- */}
      <SectionCard title="Informations personnelles">
        <div className="flex gap-4">
          <div className="flex-none">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
              {resume.personal.photo ? (
                <img
                  src={resume.personal.photo}
                  alt="Photo de profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                'Photo'
              )}
            </div>
            <input
              ref={photoInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void onPhotoChange(event.target.files?.[0])}
            />
            <div className="mt-2 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => photoInput.current?.click()}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                {resume.personal.photo ? 'Changer' : 'Ajouter'}
              </button>
              {resume.personal.photo ? (
                <button
                  type="button"
                  onClick={() => updatePersonal({ photo: '' })}
                  className="text-xs text-slate-400 hover:text-red-600 hover:underline"
                >
                  Retirer
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-3">
            <Field label="Prénom">
              <TextInput
                value={resume.personal.firstName}
                onChange={(event) => updatePersonal({ firstName: event.target.value })}
                placeholder="Camille"
              />
            </Field>
            <Field label="Nom">
              <TextInput
                value={resume.personal.lastName}
                onChange={(event) => updatePersonal({ lastName: event.target.value })}
                placeholder="Moreau"
              />
            </Field>
            <div className="col-span-2">
              <Field label="Titre du poste visé">
                <TextInput
                  value={resume.personal.title}
                  onChange={(event) => updatePersonal({ title: event.target.value })}
                  placeholder="Cheffe de projet digital"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="E-mail">
            <TextInput
              type="email"
              value={resume.personal.email}
              onChange={(event) => updatePersonal({ email: event.target.value })}
              placeholder="camille.moreau@example.com"
            />
          </Field>
          <Field label="Téléphone">
            <TextInput
              value={resume.personal.phone}
              onChange={(event) => updatePersonal({ phone: event.target.value })}
              placeholder="+33 6 12 34 56 78"
            />
          </Field>
          <Field label="Ville">
            <TextInput
              value={resume.personal.city}
              onChange={(event) => updatePersonal({ city: event.target.value })}
              placeholder="Lyon, France"
            />
          </Field>
          <Field label="Site web / portfolio">
            <TextInput
              value={resume.personal.website}
              onChange={(event) => updatePersonal({ website: event.target.value })}
              placeholder="camille-moreau.fr"
            />
          </Field>
          <div className="col-span-2">
            <Field label="LinkedIn">
              <TextInput
                value={resume.personal.linkedin}
                onChange={(event) => updatePersonal({ linkedin: event.target.value })}
                placeholder="linkedin.com/in/camillemoreau"
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* ---- Profil ---- */}
      <SectionCard
        title={resume.labels.summary}
        onTitleChange={(value) => updateLabel('summary', value)}
        subtitle="3 à 5 lignes qui résument votre valeur ajoutée"
      >
        <div className="flex justify-end">
          <SuggestionPicker
            kind="summary"
            onPick={(phrase) => update({ summary: append(resume.summary, phrase) })}
          />
        </div>
        <TextArea
          rows={5}
          value={resume.summary}
          onChange={(event) => update({ summary: event.target.value })}
          placeholder="Cheffe de projet digital avec 7 ans d'expérience…"
        />
      </SectionCard>

      {/* ---- Expériences ---- */}
      <SectionCard
        title={resume.labels.experiences}
        onTitleChange={(value) => updateLabel('experiences', value)}
        subtitle="De la plus récente à la plus ancienne"
      >
        {resume.experiences.map((item, index) => (
          <EntryCard
            key={item.id}
            index={index}
            count={resume.experiences.length}
            title={item.position}
            meta={[item.company, item.city].filter(Boolean).join(' · ')}
            onMove={(delta) => moveItem('experiences', item.id, delta)}
            onRemove={() => removeItem('experiences', item.id)}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Poste">
                <TextInput
                  value={item.position}
                  onChange={(event) =>
                    updateItem('experiences', item.id, { position: event.target.value })
                  }
                  placeholder="Cheffe de projet"
                />
              </Field>
              <Field label="Entreprise">
                <TextInput
                  value={item.company}
                  onChange={(event) =>
                    updateItem('experiences', item.id, { company: event.target.value })
                  }
                  placeholder="Atelier Nova"
                />
              </Field>
              <Field label="Ville">
                <TextInput
                  value={item.city}
                  onChange={(event) =>
                    updateItem('experiences', item.id, { city: event.target.value })
                  }
                  placeholder="Lyon"
                />
              </Field>
              <div className="flex items-end pb-1.5">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(event) =>
                      updateItem('experiences', item.id, { current: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Poste actuel
                </label>
              </div>
              <Field label="Début">
                <TextInput
                  type="month"
                  value={item.start}
                  onChange={(event) =>
                    updateItem('experiences', item.id, { start: event.target.value })
                  }
                />
              </Field>
              <Field label="Fin">
                <TextInput
                  type="month"
                  value={item.end}
                  disabled={item.current}
                  onChange={(event) =>
                    updateItem('experiences', item.id, { end: event.target.value })
                  }
                />
              </Field>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  Missions et résultats — une ligne par puce
                </span>
                <SuggestionPicker
                  kind="bullets"
                  onPick={(phrase) =>
                    updateItem('experiences', item.id, {
                      description: append(item.description, phrase),
                    })
                  }
                />
              </div>
              <TextArea
                rows={4}
                value={item.description}
                onChange={(event) =>
                  updateItem('experiences', item.id, { description: event.target.value })
                }
                placeholder={'Pilotage de 6 projets simultanés…\nRéduction de 30 % des délais…'}
              />
            </div>
          </EntryCard>
        ))}

        <Button onClick={() => addItem('experiences')}>
          <Plus className="h-4 w-4" /> Ajouter une expérience
        </Button>
      </SectionCard>

      {/* ---- Formation ---- */}
      <SectionCard
        title={resume.labels.education}
        onTitleChange={(value) => updateLabel('education', value)}
      >
        {resume.education.map((item, index) => (
          <EntryCard
            key={item.id}
            index={index}
            count={resume.education.length}
            title={item.degree}
            meta={[item.school, item.city].filter(Boolean).join(' · ')}
            onMove={(delta) => moveItem('education', item.id, delta)}
            onRemove={() => removeItem('education', item.id)}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Field label="Diplôme">
                  <TextInput
                    value={item.degree}
                    onChange={(event) =>
                      updateItem('education', item.id, { degree: event.target.value })
                    }
                    placeholder="Master Management de projets numériques"
                  />
                </Field>
              </div>
              <Field label="Établissement">
                <TextInput
                  value={item.school}
                  onChange={(event) =>
                    updateItem('education', item.id, { school: event.target.value })
                  }
                  placeholder="Université Lyon 2"
                />
              </Field>
              <Field label="Ville">
                <TextInput
                  value={item.city}
                  onChange={(event) =>
                    updateItem('education', item.id, { city: event.target.value })
                  }
                  placeholder="Lyon"
                />
              </Field>
              <Field label="Début" hint="Année ou mois">
                <TextInput
                  value={item.start}
                  onChange={(event) =>
                    updateItem('education', item.id, { start: event.target.value })
                  }
                  placeholder="2016"
                />
              </Field>
              <Field label="Fin">
                <TextInput
                  value={item.end}
                  onChange={(event) =>
                    updateItem('education', item.id, { end: event.target.value })
                  }
                  placeholder="2018"
                />
              </Field>
            </div>
            <Field label="Précisions (facultatif)">
              <TextArea
                rows={2}
                value={item.description}
                onChange={(event) =>
                  updateItem('education', item.id, { description: event.target.value })
                }
                placeholder="Mention bien. Mémoire sur…"
              />
            </Field>
          </EntryCard>
        ))}

        <Button onClick={() => addItem('education')}>
          <Plus className="h-4 w-4" /> Ajouter une formation
        </Button>
      </SectionCard>

      {/* ---- Compétences ---- */}
      <SectionCard
        title={resume.labels.skills}
        onTitleChange={(value) => updateLabel('skills', value)}
        subtitle="6 à 10 compétences suffisent"
      >
        <div className="space-y-2">
          {resume.skills.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <TextInput
                value={item.name}
                onChange={(event) => updateItem('skills', item.id, { name: event.target.value })}
                placeholder="Gestion de projet agile"
              />
              <input
                type="range"
                min={1}
                max={5}
                value={item.level}
                aria-label={`Niveau pour ${item.name || 'cette compétence'}`}
                onChange={(event) =>
                  updateItem('skills', item.id, { level: Number(event.target.value) })
                }
                className="w-24 flex-none accent-blue-600"
              />
              <div className="flex flex-none gap-1">
                <button
                  type="button"
                  aria-label="Monter"
                  onClick={() => moveItem('skills', item.id, -1)}
                  disabled={index === 0}
                  className="px-1 text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Supprimer"
                  onClick={() => removeItem('skills', item.id)}
                  className="px-1 text-xs text-slate-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => addItem('skills')}>
          <Plus className="h-4 w-4" /> Ajouter une compétence
        </Button>
      </SectionCard>

      {/* ---- Langues ---- */}
      <SectionCard
        title={resume.labels.languages}
        onTitleChange={(value) => updateLabel('languages', value)}
      >
        <div className="space-y-2">
          {resume.languages.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <TextInput
                value={item.name}
                onChange={(event) => updateItem('languages', item.id, { name: event.target.value })}
                placeholder="Anglais"
              />
              <TextInput
                value={item.level}
                onChange={(event) =>
                  updateItem('languages', item.id, { level: event.target.value })
                }
                placeholder="Courant (C1)"
              />
              <button
                type="button"
                aria-label="Supprimer"
                onClick={() => removeItem('languages', item.id)}
                className="flex-none px-1 text-xs text-slate-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <Button onClick={() => addItem('languages')}>
          <Plus className="h-4 w-4" /> Ajouter une langue
        </Button>
      </SectionCard>
    </div>
  )
}
