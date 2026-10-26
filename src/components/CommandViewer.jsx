import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Braces,
  Check,
  Clock,
  Copy,
  FolderOpen,
  Layers,
  Radar,
  Radio,
  Search,
  Target,
  Terminal,
  X,
} from 'lucide-react'
import { extractTags, interpolateVars, interpolateWithTokens } from '../lib/examVars'
import { cn, copyText, formatNumber } from '../lib/utils'

function TokenText({ text, vars }) {
  const chunks = useMemo(() => interpolateWithTokens(text, vars), [text, vars])

  return (
    <>
      {chunks.map((chunk, index) =>
        chunk.type === 'var' ? (
          <span
            key={`${chunk.raw}-${index}`}
            className="token-chip mx-[1px]"
            title={`${chunk.raw} → ${chunk.text}`}
          >
            {chunk.text}
          </span>
        ) : (
          <span key={`text-${index}`}>{chunk.text}</span>
        ),
      )}
    </>
  )
}

function Callout({ icon: Icon, label, text, iconClass, className }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-[96px] flex-col justify-between rounded-lg border p-3.5 transition',
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={11} className={cn('shrink-0', iconClass)} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-[1.55] text-zinc-800">{text}</p>
    </div>
  )
}

function CopyButton({ copied, onClick, label = 'Copy', compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-sm border font-medium transition',
        compact ? 'px-2 py-1 text-[9.5px]' : 'px-2.5 py-1.5 text-[10px]',
        copied
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
          : 'border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-brand hover:text-brand',
      )}
      aria-label={copied ? 'Copied to clipboard' : label}
    >
      {copied ? <Check size={compact ? 11 : 12} /> : <Copy size={compact ? 11 : 12} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  )
}

export default function CommandViewer({
  tool,
  category,
  vars,
  rawMode,
  onRawModeChange,
  onTagClick,
}) {
  const [commandQuery, setCommandQuery] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const copyTimer = useRef(null)

  useEffect(() => {
    setCommandQuery('')
    const scroller = document.querySelector('main')
    if (scroller) scroller.scrollTop = 0
  }, [tool.id])

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    }
  }, [])

  const tags = useMemo(() => extractTags(tool), [tool])
  const query = commandQuery.trim().toLowerCase()
  const CategoryIcon = category.icon || FolderOpen

  const sections = useMemo(() => {
    return tool.sections.map((section, index) => {
      const commands = (section.commands || []).map((command, commandIndex) => ({
        ...command,
        commandIndex,
      }))

      const filtered = query
        ? commands.filter(
            (command) =>
              command.command.toLowerCase().includes(query) ||
              (command.comment || '').toLowerCase().includes(query),
          )
        : commands

      return { ...section, index, commands, filtered }
    })
  }, [tool, query])

  const visibleSections = sections.filter((section) => section.filtered.length > 0)
  const visibleCommandCount = visibleSections.reduce(
    (total, section) => total + section.filtered.length,
    0,
  )

  const sectionSignature = visibleSections.map((section) => section.index).join(',')

  useEffect(() => {
    const scroller = document.querySelector('main')
    if (!scroller || visibleSections.length === 0) {
      setActiveSection(null)
      return
    }

    const ids = visibleSections.map((section) => `sec-${tool.id}-${section.index}`)

    const update = () => {
      const threshold = scroller.getBoundingClientRect().top + 48
      let current = ids[0]
      ids.forEach((id) => {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= threshold) current = id
      })
      const match = visibleSections.find(
        (section) => `sec-${tool.id}-${section.index}` === current,
      )
      setActiveSection(match ? match.index : null)
    }

    update()
    scroller.addEventListener('scroll', update, { passive: true })
    return () => scroller.removeEventListener('scroll', update)
  }, [tool.id, sectionSignature])

  const flashCopied = (key) => {
    setCopiedKey(key)
    if (copyTimer.current) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopiedKey(null), 1600)
  }

  const copyCommand = async (key, command) => {
    const ok = await copyText(interpolateVars(command.command, vars))
    if (ok) flashCopied(key)
  }

  const copySection = async (section) => {
    const payload = section.commands
      .map((command) => {
        const line = interpolateVars(command.command, vars)
        return command.comment ? `${line} ${command.comment}` : line
      })
      .join('\n')
    const ok = await copyText(payload)
    if (ok) flashCopied(`section-${section.index}`)
  }

  const jumpToSection = (index) => {
    const element = document.getElementById(`sec-${tool.id}-${index}`)
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const commentText = (comment) => (rawMode ? comment : interpolateVars(comment, vars))
  const callout = tool.callout || {}

  return (
    <div className="min-w-0 animate-fade-in">
      <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
        <div className="relative p-5 lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-brand-border bg-brand-tint px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-brand">
              <CategoryIcon size={11} />
              {category.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-border-subtle bg-card-code px-2 py-1 font-mono text-[9.5px] text-zinc-600">
              <Terminal size={10} className="text-emerald-700" />
              {formatNumber(tool.commandCount)} commands
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-border-subtle bg-card-code px-2 py-1 font-mono text-[9.5px] text-zinc-600">
              <Layers size={10} className="text-brand" />
              {tool.sections.length} sections
            </span>
            <span className="ml-auto hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-500 sm:flex">
              <span className={cn('h-1.5 w-1.5 rounded-full', rawMode ? 'bg-emerald-600' : 'bg-brand')} />
              {rawMode ? 'raw template' : 'live injection'}
            </span>
          </div>

          <h2 className="mt-3 text-balance text-xl font-semibold tracking-[-0.01em] text-zinc-900 lg:text-2xl">
            {tool.shortName}
          </h2>
          {tool.fullTitle && tool.fullTitle !== tool.shortName && (
            <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-500">{tool.fullTitle}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-zinc-400">
                Tags
              </span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className="focus-ring rounded-sm border border-border-subtle bg-white px-2 py-0.5 font-mono text-[9.5px] text-zinc-600 transition hover:border-brand-light hover:bg-brand-tint hover:text-brand"
                  title={`Search arsenal for #${tag}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Callout
              icon={Target}
              label="// OBJECTIVE"
              text={interpolateVars(callout.why || '—', vars)}
              iconClass="text-brand"
              className="border-orange-200/80 bg-orange-50/70"
            />
            <Callout
              icon={Radar}
              label="// ATTACK SURFACE"
              text={interpolateVars(callout.where || '—', vars)}
              iconClass="text-amber-600"
              className="border-amber-200/80 bg-amber-50/70"
            />
            <Callout
              icon={Clock}
              label="// OPERATIONAL TIMING"
              text={interpolateVars(callout.when || '—', vars)}
              iconClass="text-emerald-700"
              className="border-emerald-200/80 bg-emerald-50/70"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border-subtle bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="group relative min-w-0 flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-brand"
            />
            <input
              type="text"
              value={commandQuery}
              onChange={(event) => setCommandQuery(event.target.value)}
              placeholder="Filter commands in this tool…"
              spellCheck={false}
              className="focus-ring w-full rounded-md border border-border-subtle bg-white py-2 pl-8 pr-20 font-mono text-[11.5px] text-zinc-900 placeholder:text-zinc-400 transition focus:border-brand"
            />
            {commandQuery ? (
              <button
                type="button"
                onClick={() => setCommandQuery('')}
                className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-sm text-zinc-400 transition hover:bg-card-hover hover:text-zinc-900"
                aria-label="Clear command filter"
              >
                <X size={12} />
              </button>
            ) : (
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-zinc-400">
                {visibleCommandCount} shown
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center rounded-md border border-border-subtle bg-panel p-0.5">
            <button
              type="button"
              onClick={() => onRawModeChange(false)}
              className={cn(
                'focus-ring inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-[10px] font-medium transition',
                !rawMode
                  ? 'bg-brand-tint text-brand'
                  : 'text-zinc-500 hover:text-zinc-800',
              )}
            >
              <Radio size={11} />
              <span className="hidden sm:inline">Interpolated (Live IPs)</span>
              <span className="sm:hidden">Live</span>
            </button>
            <button
              type="button"
              onClick={() => onRawModeChange(true)}
              className={cn(
                'focus-ring inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-[10px] font-medium transition',
                rawMode
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-zinc-500 hover:text-zinc-800',
              )}
            >
              <Braces size={11} />
              <span className="hidden sm:inline">Raw Template ($TARGET)</span>
              <span className="sm:hidden">Raw</span>
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.14em] text-zinc-400">
            Jump
          </span>
          <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto pb-0.5">
            {visibleSections.map((section) => {
              const active = section.index === activeSection
              return (
                <button
                  key={section.index}
                  type="button"
                  onClick={() => jumpToSection(section.index)}
                  className={cn(
                    'focus-ring group inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1 text-[9.5px] transition',
                    active
                      ? 'border-brand bg-brand-tint font-semibold text-brand'
                      : 'border-border-subtle bg-white text-zinc-700 hover:border-brand-light hover:text-brand',
                  )}
                  title={section.title}
                  aria-current={active ? 'true' : undefined}
                >
                  <span
                    className={cn(
                      'font-mono text-[8.5px] transition',
                      active ? 'text-brand' : 'text-zinc-400 group-hover:text-brand/80',
                    )}
                  >
                    {String(section.index + 1).padStart(2, '0')}
                  </span>
                  <span className="max-w-[130px] truncate">{section.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-zinc-400">
          {formatNumber(visibleCommandCount)} of {formatNumber(tool.commandCount)} commands
          {query ? ' matched' : ''} · {visibleSections.length} of {sections.length} sections
        </p>
        <span className="ml-auto hidden items-center gap-1.5 text-[9.5px] text-zinc-400 sm:flex">
          <Copy size={10} />
          Copy inserts live interpolated values
        </span>
      </div>

      <div className="mt-2 space-y-4 pb-10">
        {visibleSections.length === 0 && (
          <div className="rounded-xl border border-border-subtle bg-white px-4 py-14 text-center shadow-sm">
            <Search size={20} className="mx-auto text-zinc-300" />
            <p className="mt-2 text-[12px] font-medium text-zinc-700">No matching commands</p>
            <p className="mt-1 text-[10.5px] text-zinc-400">
              Clear the filter to see all {formatNumber(tool.commandCount)} commands in this tool.
            </p>
            <button
              type="button"
              onClick={() => setCommandQuery('')}
              className="focus-ring mt-3 rounded-sm border border-border-subtle bg-white px-3 py-1.5 text-[10px] text-zinc-700 transition hover:border-brand-light hover:text-brand"
            >
              Clear filter
            </button>
          </div>
        )}

        {visibleSections.map((section) => (
          <section
            key={section.index}
            id={`sec-${tool.id}-${section.index}`}
            className="section-anchor"
          >
            <div className="flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 border-zinc-200 bg-zinc-100 px-3 py-2 text-zinc-800">
              <span className="grid h-6 min-w-6 place-items-center rounded-sm border border-brand-border bg-white px-1 font-mono text-[9.5px] font-bold text-brand">
                {String(section.index + 1).padStart(2, '0')}
              </span>
              <h3 className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-zinc-800">
                {section.title}
              </h3>
              <span className="rounded-sm border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[8.5px] text-zinc-500">
                {section.filtered.length}
                {query ? `/${section.commands.length}` : ''}
              </span>
              <CopyButton
                compact
                copied={copiedKey === `section-${section.index}`}
                onClick={() => copySection(section)}
                label="Copy Section"
              />
            </div>

            <div className="overflow-hidden rounded-b-lg border border-zinc-200 bg-white">
              <div className="grid grid-cols-[1fr] items-center gap-4 rounded-t-lg border-b border-border-subtle bg-zinc-50/90 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:grid-cols-[1fr_260px_84px] lg:grid-cols-[1fr_340px_84px] xl:grid-cols-[1fr_420px_84px]">
                <span>Command Syntax (Live Parameters)</span>
                <span className="hidden sm:block">Operation &amp; Flags</span>
                <span className="hidden text-right sm:block">Action</span>
              </div>

              {section.filtered.map((command) => {
                const key = `${section.index}-${command.commandIndex}`
                return (
                  <div
                    key={key}
                    className="grid grid-cols-[1fr] items-center gap-4 border-t border-border-subtle bg-white px-4 py-3 transition hover:bg-orange-50/30 sm:grid-cols-[1fr_260px_84px] lg:grid-cols-[1fr_340px_84px] xl:grid-cols-[1fr_420px_84px]"
                  >
                    <code className="min-w-0 whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-slate-900">
                      <span className="mr-1.5 select-none text-xs text-brand/50">$</span>
                      {rawMode ? command.command : <TokenText text={command.command} vars={vars} />}
                    </code>

                    <div className="min-w-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-normal text-emerald-800">
                      {command.comment ? (
                        <span>{commentText(command.comment)}</span>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </div>

                    <div className="ml-auto flex w-[84px] justify-end sm:ml-0">
                      <CopyButton
                        copied={copiedKey === key}
                        onClick={() => copyCommand(key, command)}
                        label="Copy"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
