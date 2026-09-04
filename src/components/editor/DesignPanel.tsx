import type { ReactNode } from 'react'
import type { Resume, Settings } from '../../types'
import { ACCENTS, FONTS } from '../../data/defaults'
import { TEMPLATES, templateById } from '../preview/templates'
import { SectionCard } from './SectionCard'
import { Toggle } from '../ui/controls'

/** Miniature schématique : donne l'allure d'un modèle sans rendre le CV entier. */
function Thumb({ id, accent }: { id: Resume['settings']['template']; accent: string }) {
  const bar = (width: string, color = '#cbd5e1', height = 3) => (
    <div style={{ width, height, borderRadius: 2, background: color }} />
  )

  const body = (
    <div className="flex flex-col gap-[3px]">
      {bar('90%')}
      {bar('80%')}
      {bar('60%')}
    </div>
  )

  if (id === 'colonne') {
    return (
      <div className="flex h-full gap-[4px] p-[5px]">
        <div className="w-1/3 rounded-[2px]" style={{ background: accent }} />
        <div className="flex flex-1 flex-col gap-[4px]">
          {bar('70%', accent, 4)}
          {body}
          {body}
        </div>
      </div>
    )
  }

  if (id === 'creatif') {
    return (
      <div className="flex h-full flex-col">
        <div className="h-1/4 w-full" style={{ background: accent }} />
        <div className="flex flex-1 gap-[4px] p-[5px]">
          <div className="flex flex-[3] flex-col gap-[4px]">{body}</div>
          <div className="flex flex-[2] flex-col gap-[4px]">{body}</div>
        </div>
      </div>
    )
  }

  if (id === 'classique') {
    return (
      <div className="flex h-full flex-col items-center gap-[5px] p-[6px]">
        {bar('55%', '#94a3b8', 4)}
        {bar('35%', accent)}
        <div className="w-full border-t border-slate-300 pt-[4px]">{body}</div>
        <div className="w-full border-t border-slate-300 pt-[4px]">{body}</div>
      </div>
    )
  }

  if (id === 'minimal') {
    return (
      <div className="flex h-full flex-col gap-[5px] p-[6px]">
        {bar('45%', '#94a3b8', 4)}
        <div className="border-t pt-[4px]" style={{ borderColor: accent }} />
        <div className="flex gap-[4px]">
          <div className="w-1/4">{bar('80%', '#e2e8f0')}</div>
          <div className="flex-1">{body}</div>
        </div>
        <div className="flex gap-[4px]">
          <div className="w-1/4">{bar('80%', '#e2e8f0')}</div>
          <div className="flex-1">{body}</div>
        </div>
      </div>
    )
  }

  if (id === 'elegant') {
    return (
      <div className="flex h-full flex-col items-center gap-[4px] p-[6px]">
        {bar('60%', '#57534e', 5)}
        {bar('30%', accent)}
        <div className="mt-[2px] flex w-full items-center gap-[3px]">
          {bar('28%', accent, 2)}
          <div className="h-px flex-1 bg-stone-300" />
        </div>
        {body}
        <div className="flex w-full items-center gap-[3px]">
          {bar('28%', accent, 2)}
          <div className="h-px flex-1 bg-stone-300" />
        </div>
        {body}
      </div>
    )
  }

  if (id === 'compact') {
    return (
      <div className="flex h-full flex-col gap-[4px] p-[5px]">
        <div className="flex items-end justify-between gap-[4px] border-b-2 pb-[3px]" style={{ borderColor: accent }}>
          {bar('45%', '#94a3b8', 4)}
          {bar('25%', '#cbd5e1', 2)}
        </div>
        <div className="flex flex-1 gap-[5px]">
          <div className="flex flex-[3] flex-col gap-[3px]">
            {bar('50%', accent, 2)}
            {body}
            {body}
          </div>
          <div className="flex flex-[2] flex-col gap-[3px]">
            {bar('60%', accent, 2)}
            {body}
          </div>
        </div>
      </div>
    )
  }

  if (id === 'technique') {
    return (
      <div className="flex h-full gap-[4px] p-[5px]">
        <div className="flex w-1/3 flex-col gap-[3px] rounded-[2px] bg-slate-100 p-[3px]">
          {bar('70%', '#94a3b8', 2)}
          {bar('90%', accent, 2)}
          {bar('60%', accent, 2)}
          {bar('80%', accent, 2)}
        </div>
        <div className="flex flex-1 flex-col gap-[4px]">
          {bar('65%', '#94a3b8', 4)}
          {body}
          {body}
        </div>
      </div>
    )
  }

  if (id === 'academique') {
    return (
      <div className="flex h-full flex-col gap-[4px] p-[6px]">
        {bar('55%', '#94a3b8', 4)}
        <div className="flex items-center gap-[3px] border-b pb-[2px]" style={{ borderColor: accent }}>
          <div className="h-[3px] w-[3px] rounded-full" style={{ background: accent }} />
          {bar('40%', '#cbd5e1', 2)}
        </div>
        {body}
        <div className="flex items-center gap-[3px] border-b pb-[2px]" style={{ borderColor: accent }}>
          <div className="h-[3px] w-[3px] rounded-full" style={{ background: accent }} />
          {bar('45%', '#cbd5e1', 2)}
        </div>
        {body}
      </div>
    )
  }

  if (id === 'ats') {
    // Aucune couleur dans la miniature non plus : c'est tout le propos.
    return (
      <div className="flex h-full flex-col gap-[5px] p-[6px]">
        {bar('50%', '#334155', 4)}
        {bar('30%', '#94a3b8', 2)}
        <div className="mt-[2px]">{bar('35%', '#334155', 3)}</div>
        {body}
        {bar('35%', '#334155', 3)}
        {body}
      </div>
    )
  }

  if (id === 'portrait') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-[4px] p-[5px]" style={{ background: accent }}>
          <div className="h-[14px] w-[14px] flex-none rounded-full bg-white/70" />
          <div className="flex flex-1 flex-col gap-[3px]">
            {bar('80%', 'rgba(255,255,255,.9)', 4)}
            {bar('50%', 'rgba(255,255,255,.6)', 2)}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-[4px] p-[5px]">
          {bar('45%', accent, 2)}
          {body}
          {bar('45%', accent, 2)}
          {body}
        </div>
      </div>
    )
  }

  if (id === 'ardoise') {
    return (
      <div className="flex h-full gap-[4px] p-[5px]">
        <div className="flex w-2/5 flex-col items-center gap-[4px] rounded-[2px] bg-slate-800 p-[4px]">
          <div className="h-[13px] w-[13px] rounded-full bg-white/25" />
          {bar('85%', 'rgba(255,255,255,.5)', 2)}
          {bar('70%', accent, 2)}
          {bar('80%', 'rgba(255,255,255,.3)', 2)}
        </div>
        <div className="flex flex-1 flex-col gap-[4px]">
          {bar('60%', '#334155', 3)}
          {body}
          {bar('60%', '#334155', 3)}
          {body}
        </div>
      </div>
    )
  }

  if (id === 'cartes') {
    const cardBox = (children: ReactNode) => (
      <div className="rounded-[2px] border border-slate-300 bg-white p-[3px]">{children}</div>
    )
    return (
      <div className="flex h-full flex-col gap-[4px] bg-slate-100 p-[4px]">
        <div className="rounded-[2px] border border-slate-300 bg-white p-[3px]" style={{ borderTopColor: accent, borderTopWidth: 2 }}>
          <div className="flex items-center gap-[3px]">
            <div className="h-[10px] w-[10px] rounded-[2px] bg-slate-200" />
            <div className="flex-1">{bar('70%', '#94a3b8', 3)}</div>
          </div>
        </div>
        {cardBox(
          <div className="flex flex-col gap-[3px]">
            {bar('40%', accent, 2)}
            {bar('90%')}
            {bar('75%')}
          </div>,
        )}
        {cardBox(
          <div className="flex flex-col gap-[3px]">
            {bar('40%', accent, 2)}
            {bar('85%')}
          </div>,
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-[5px] p-[6px]">
      <div className="flex items-center gap-[4px]">
        <div className="h-[10px] w-[10px] rounded-full" style={{ background: `${accent}55` }} />
        <div className="flex-1">{bar('70%', '#94a3b8', 4)}</div>
      </div>
      {bar('100%', accent, 2)}
      {body}
      {bar('100%', accent, 2)}
      {body}
    </div>
  )
}

export function DesignPanel({
  settings,
  onChange,
}: {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
}) {
  const { fixedFont, noPhoto, noSkillLevels } = templateById(settings.template)

  return (
    <div className="space-y-4">
      <SectionCard title="Modèle">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TEMPLATES.map((template) => {
            const active = template.id === settings.template
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange({ template: template.id })}
                className={`overflow-hidden rounded-lg border-2 text-left transition ${
                  active
                    ? 'border-blue-600 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="aspect-[210/297] w-full bg-white">
                  <Thumb id={template.id} accent={settings.accent} />
                </div>
                <div className="border-t border-slate-100 px-2 py-1.5">
                  <p className="text-xs font-semibold text-slate-800">{template.name}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                    {template.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard title="Couleur d’accent">
        <div className="flex flex-wrap items-center gap-2">
          {ACCENTS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Couleur ${color}`}
              onClick={() => onChange({ accent: color })}
              className={`h-8 w-8 rounded-full transition ${
                settings.accent === color
                  ? 'ring-2 ring-slate-900 ring-offset-2'
                  : 'hover:scale-105'
              }`}
              style={{ background: color }}
            />
          ))}
          <label
            className="ml-1 inline-flex cursor-pointer items-center gap-2 text-xs text-slate-500"
            title="Choisir une couleur libre"
          >
            <input
              type="color"
              value={settings.accent}
              onChange={(event) => onChange({ accent: event.target.value })}
              className="h-8 w-8 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
            />
            personnalisée
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Typographie et densité">
        {fixedFont ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Le modèle {templateById(settings.template).name} impose {fixedFont}. Le choix
            ci-dessous ne s’appliquera qu’aux autres modèles.
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onChange({ font: font.id })}
              style={{ fontFamily: font.stack }}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                settings.font === font.id
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {font.label}
              <span className="ml-1 text-xs text-slate-400">Aa</span>
            </button>
          ))}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Taille du texte</span>
            <span className="text-slate-400">{Math.round(settings.scale * 100)} %</span>
          </div>
          <input
            type="range"
            min={0.85}
            max={1.15}
            step={0.01}
            value={settings.scale}
            onChange={(event) => onChange({ scale: Number(event.target.value) })}
            className="w-full accent-blue-600"
          />
          <p className="mt-1 text-xs text-slate-400">
            Le levier le plus simple pour faire tenir un CV sur une seule page.
          </p>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-3">
          <Toggle
            checked={settings.showPhoto}
            onChange={(value) => onChange({ showPhoto: value })}
            label="Afficher la photo"
            disabledReason={noPhoto}
          />
          <Toggle
            checked={settings.showSkillLevels}
            onChange={(value) => onChange({ showSkillLevels: value })}
            label="Afficher les niveaux de compétence"
            disabledReason={noSkillLevels}
          />
        </div>
      </SectionCard>
    </div>
  )
}
