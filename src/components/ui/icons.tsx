import type { ReactNode } from 'react'

type IconProps = { className?: string }

const base = 'h-4 w-4'

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? base}
    >
      {children}
    </svg>
  )
}

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
export const ArrowUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19V5m-7 7 7-7 7 7" />
  </Svg>
)
export const ArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14m7-7-7 7-7-7" />
  </Svg>
)
export const Trash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" />
  </Svg>
)
export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
    <path d="M18 15.5 18.8 17.4 20.7 18.2 18.8 19 18 20.9 17.2 19 15.3 18.2 17.2 17.4z" />
  </Svg>
)
export const Printer = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9V3h12v6M6 18H4v-6h16v6h-2" />
    <path d="M6 14h12v7H6z" />
  </Svg>
)
export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v12m-5-5 5 5 5-5M4 21h16" />
  </Svg>
)
export const Upload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 16V4m-5 5 5-5 5 5M4 21h16" />
  </Svg>
)
export const Reset = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Svg>
)
export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
)
export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)
export const Mail = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18v12H3z" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
)
export const Phone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a15 15 0 0 1-16-16z" />
  </Svg>
)
export const Pin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)
export const Globe = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
  </Svg>
)
export const LinkedIn = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4" />
  </Svg>
)
