import type { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes } from 'react'

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field-input ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`field-input resize-y ${props.className ?? ''}`} />
}

export function Button({
  children,
  onClick,
  variant = 'ghost',
  type = 'button',
  title,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'subtle' | 'danger'
  type?: 'button' | 'submit'
  title?: string
  disabled?: boolean
}) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    ghost: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300',
    subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent',
    danger: 'bg-white text-red-600 hover:bg-red-50 border-red-200',
  }[variant]

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  )
}

export function IconButton({
  label,
  onClick,
  children,
  disabled,
}: {
  label: string
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-white"
    >
      {children}
    </button>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  /**
   * Raison pour laquelle le réglage ne s'applique pas au modèle courant. Un
   * interrupteur sans effet est pire qu'un interrupteur absent : renseignée,
   * elle le désactive et l'explique.
   */
  disabledReason,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  disabledReason?: string
}) {
  const off = Boolean(disabledReason)

  return (
    <label
      title={disabledReason}
      className={`flex items-center gap-2 text-sm ${
        off ? 'cursor-not-allowed text-slate-400' : 'cursor-pointer text-slate-700'
      }`}
    >
      <span
        role="switch"
        aria-checked={off ? false : checked}
        aria-disabled={off || undefined}
        onClick={() => !off && onChange(!checked)}
        className={`relative h-5 w-9 flex-none rounded-full transition ${
          off ? 'bg-slate-200' : checked ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            checked && !off ? 'left-4.5' : 'left-0.5'
          }`}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={off ? false : checked}
        disabled={off}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        {label}
        {disabledReason ? (
          <span className="block text-xs text-slate-400">Sans effet ici : {disabledReason}.</span>
        ) : null}
      </span>
    </label>
  )
}
