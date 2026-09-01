import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Resume } from '../../types'
import { FONTS } from '../../data/defaults'
import { templateById } from './templates'

const A4_RATIO = 297 / 210

export function ResumePreview({
  resume,
  onPageCount,
}: {
  resume: Resume
  onPageCount?: (count: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const { Component } = templateById(resume.settings.template)
  const font = FONTS.find((item) => item.id === resume.settings.font) ?? FONTS[0]

  // Le panneau est plus étroit qu'une feuille A4 : on réduit visuellement la
  // page pour qu'elle tienne, sans toucher à ses dimensions réelles.
  useLayoutEffect(() => {
    const scroller = scrollRef.current
    const page = pageRef.current
    if (!scroller || !page) return

    const measure = () => {
      const available = scroller.clientWidth - 40
      const width = page.offsetWidth
      const height = page.offsetHeight
      if (!width) return
      setScale(Math.min(1, available / width))
      setSize({ width, height })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(scroller)
    observer.observe(page)
    return () => observer.disconnect()
  }, [])

  const pageHeightPx = size.width * A4_RATIO
  const pageCount = pageHeightPx > 0 ? Math.max(1, Math.ceil(size.height / pageHeightPx - 0.01)) : 1

  useEffect(() => {
    onPageCount?.(pageCount)
  }, [pageCount, onPageCount])

  return (
    <div ref={scrollRef} className="preview-scroll h-full overflow-auto bg-slate-200/70 p-5">
      <div
        className="preview-scaler mx-auto"
        style={{
          width: size.width ? size.width * scale : undefined,
          height: size.height ? size.height * scale : undefined,
        }}
      >
        <div
          ref={pageRef}
          className="resume-page"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            fontFamily: font.stack,
            fontSize: `${10.5 * resume.settings.scale}pt`,
            lineHeight: 1.45,
            color: '#1f2937',
          }}
        >
          <Component resume={resume} accent={resume.settings.accent} />

          {Array.from({ length: pageCount - 1 }, (_, index) => (
            <div
              key={index}
              className="page-break-guide"
              data-label={`page ${index + 2}`}
              style={{ top: pageHeightPx * (index + 1) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
