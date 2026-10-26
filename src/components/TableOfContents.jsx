import { useEffect, useState } from 'react'
import { ListTree } from 'lucide-react'
import { cn } from '../lib/utils'

const STICKY_OFFSET = 92

export default function TableOfContents({ tool }) {
  const sections = tool?.sections || []
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [tool?.id])

  useEffect(() => {
    if (!tool || sections.length === 0) return undefined

    const ids = sections.map((_, index) => `sec-${tool.id}-${index}`)

    const update = () => {
      const threshold = STICKY_OFFSET + 16
      let current = 0
      ids.forEach((id, index) => {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= threshold) current = index
      })
      setActiveIndex(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [tool?.id, sections.length])

  if (!tool || sections.length === 0) return null

  const jumpTo = (index) => {
    const element = document.getElementById(`sec-${tool.id}-${index}`)
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav aria-label="On this page">
      <p className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        <ListTree size={11} className="text-brand" />
        On this page
      </p>

      <div className="mt-2.5 border-l border-border-subtle">
        {sections.map((section, index) => {
          const active = index === activeIndex
          return (
            <button
              key={`${tool.id}-${index}`}
              type="button"
              onClick={() => jumpTo(index)}
              className={cn(
                'focus-ring block w-full border-l-2 py-1.5 pl-3 pr-2 text-left text-[10.5px] leading-snug transition',
                active
                  ? 'border-brand bg-orange-50/60 font-semibold text-brand'
                  : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-900',
              )}
              aria-current={active ? 'true' : undefined}
            >
              <span
                className={cn(
                  'mr-1.5 font-mono text-[8.5px]',
                  active ? 'text-brand' : 'text-zinc-400',
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.title}
            </button>
          )
        })}
      </div>

      <div className="mt-5 rounded-lg border border-border-subtle bg-white p-3">
        <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-zinc-400">
          Section count
        </p>
        <p className="mt-1 font-mono text-[11px] font-semibold text-zinc-800">
          {sections.length} sections · {tool.commandCount} commands
        </p>
        <p className="mt-1 text-[9.5px] leading-relaxed text-zinc-500">
          Click any anchor to scroll directly to that block.
        </p>
      </div>
    </nav>
  )
}
