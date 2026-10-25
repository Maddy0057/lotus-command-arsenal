import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Braces,
  Check,
  Clock,
  Copy,
  FolderOpen,
  MapPin,
  Search,
  Sparkles,
  Target,
  Terminal,
  X,
  Zap,
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
            className="token-chip mx-[1px] text-[11.5px]"
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

function Callout({ icon: Icon, label, text, tone }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-card/60 px-3 py-2.5 transition hover:border-border-bright hover:bg-card">
      <div className="flex items-center gap-1.5">
        <Icon size={11} className={cn('shrink-0', tone)} />
        <span className="font-mono text-[8.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-[1.55] text-zinc-400">{text}</p>
    </div>
  )
}

function CopyButton({ copied, onClick, label = 'Copy', compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-md border font-medium transition',
        compact ? 'px-2 py-1 text-[9.5px]' : 'px-2.5 py-1.5 text-[10px]',
        copied
          ? 'border-terminal-green/50 bg-terminal-green/10 text-terminal-green shadow-[0_0_16px_-6px_rgba(74,222,128,0.8)]'
          : 'border-border-subtle bg-panel text-zinc-400 hover:border-border-bright hover:bg-card-hover hover:text-zinc-100',
      )}
      aria-label={copied ? 'Copied to clipboard' : label}
    >
      {copied ? <Check size={compact ? 11 : 12} /> : <Copy size={compact ? 11 : 12} />}
      <span className={cn('transition-all', copied ? 'text-terminal-green' : '')}>
        {copied ? 'Copied!' : label}
      </span>
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
  const copyTimer = useRef(null)

  useEffect(() => {
    setCommandQuery('')
  }, [tool.id])

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    }
  }, [])

  const tags = useMemo(() => extractTags(tool), [tool])
  const query = commandQuery.trim().toLowerCase()

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
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-panel shadow-panel">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-70" />
        <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-16 h-48 w-48 rounded-full bg-token-cyan/5 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-bright/50 to-transparent" />

        <div className="relative p-5 lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand/15 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-brand-bright">
              <FolderOpen size={11} />
              {category.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-card px-2 py-1 font-mono text-[9.5px] text-zinc-400">
              <Terminal size={10} className="text-terminal-green" />
              {formatNumber(tool.commandCount)} commands
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-card px-2 py-1 font-mono text-[9.5px] text-zinc-400">
              <Zap size={10} className="text-token-cyan" />
              {tool.sections.length} sections
            </span>
            <span className="ml-auto hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-600 sm:flex">
              <span className={cn('h-1.5 w-1.5 rounded-full', rawMode ? 'bg-amber-400' : 'bg-terminal-green')} />
              {rawMode ? 'raw template' : 'live injection'}
            </span>
          </div>

          <h2 className="mt-3 text-balance text-xl font-semibold tracking-[-0.01em] text-white lg:text-2xl">
            {tool.shortName}
          </h2>
          {tool.fullTitle && tool.fullTitle !== tool.shortName && (
            <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-500">{tool.fullTitle}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-zinc-600">
                Tags
              </span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className="focus-ring rounded-full border border-border-subtle bg-card/80 px-2 py-0.5 font-mono text-[9.5px] text-zinc-400 transition hover:border-token-cyan/40 hover:bg-token-bg hover:text-token-cyan"
                  title={`Search arsenal for #${tag}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <Callout
              icon={Target}
              label="🎯 Why"
              text={interpolateVars(callout.why || '—', vars)}
              tone="text-brand-bright"
            />
            <Callout
              icon={MapPin}
              label="📍 Where"
              text={interpolateVars(callout.where || '—', vars)}
              tone="text-token-cyan"
            />
            <Callout
              icon={Clock}
              label="⏰ When"
              text={interpolateVars(callout.when || '—', vars)}
              tone="text-terminal-green"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border-subtle bg-panel/80 p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="group relative min-w-0 flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 transition group-focus-within:text-brand-bright"
            />
            <input
              type="text"
              value={commandQuery}
              onChange={(event) => setCommandQuery(event.target.value)}
              placeholder="Filter commands inside this tool…"
              spellCheck={false}
              className="focus-ring w-full rounded-lg border border-border-subtle bg-card py-2 pl-8 pr-20 font-mono text-[11.5px] text-zinc-100 placeholder:text-zinc-600 transition focus:border-brand/50"
            />
            {commandQuery ? (
              <button
                type="button"
                onClick={() => setCommandQuery('')}
                className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded text-zinc-500 transition hover:bg-card-hover hover:text-white"
                aria-label="Clear command filter"
              >
                <X size={12} />
              </button>
            ) : (
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-zinc-600">
                {visibleCommandCount} shown
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center rounded-lg border border-border-subtle bg-card p-0.5">
            <button
              type="button"
              onClick={() => onRawModeChange(false)}
              className={cn(
                'focus-ring inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition',
                !rawMode
                  ? 'bg-brand/20 text-brand-bright shadow-[inset_0_0_0_1px_rgba(113,112,255,0.3)]'
                  : 'text-zinc-500 hover:text-zinc-200',
              )}
            >
              <Sparkles size={11} />
              <span className="hidden sm:inline">Interpolated (Live IPs)</span>
              <span className="sm:hidden">Live</span>
            </button>
            <button
              type="button"
              onClick={() => onRawModeChange(true)}
              className={cn(
                'focus-ring inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition',
                rawMode
                  ? 'bg-amber-400/15 text-amber-300 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.25)]'
                  : 'text-zinc-500 hover:text-zinc-200',
              )}
            >
              <Braces size={11} />
              <span className="hidden sm:inline">Raw Template ($TARGET)</span>
              <span className="sm:hidden">Raw</span>
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.14em] text-zinc-600">
            Jump
          </span>
          <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto pb-0.5">
            {visibleSections.map((section) => (
              <button
                key={section.index}
                type="button"
                onClick={() => jumpToSection(section.index)}
                className="focus-ring group inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border-subtle bg-card/60 px-2 py-1 text-[9.5px] text-zinc-500 transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand-bright"
                title={section.title}
              >
                <span className="font-mono text-[8.5px] text-zinc-600 transition group-hover:text-brand-bright/80">
                  {String(section.index + 1).padStart(2, '0')}
                </span>
                <span className="max-w-[130px] truncate">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-zinc-600">
          {formatNumber(visibleCommandCount)} of {formatNumber(tool.commandCount)} commands
          {query ? ' matched' : ''} · {visibleSections.length} of {sections.length} sections
        </p>
        <span className="ml-auto hidden items-center gap-1.5 text-[9.5px] text-zinc-600 sm:flex">
          <Copy size={10} />
          Copy always inserts live interpolated values
        </span>
      </div>

      <div className="mt-2 space-y-4 pb-10">
        {visibleSections.length === 0 && (
          <div className="rounded-xl border border-border-subtle bg-panel px-4 py-14 text-center">
            <Search size={20} className="mx-auto text-zinc-600" />
            <p className="mt-2 text-[12px] font-medium text-zinc-300">No matching commands</p>
            <p className="mt-1 text-[10.5px] text-zinc-600">
              Clear the filter to see all {formatNumber(tool.commandCount)} commands in this tool.
            </p>
            <button
              type="button"
              onClick={() => setCommandQuery('')}
              className="focus-ring mt-3 rounded-md border border-border-bright bg-card px-3 py-1.5 text-[10px] text-zinc-300 transition hover:text-white"
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
            <div className="flex flex-wrap items-center gap-2 rounded-t-xl border border-b-0 border-border-subtle bg-card/60 px-3 py-2">
              <span className="grid h-6 min-w-6 place-items-center rounded-md border border-brand/30 bg-brand/10 px-1 font-mono text-[9.5px] font-bold text-brand-bright">
                {String(section.index + 1).padStart(2, '0')}
              </span>
              <h3 className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-zinc-200">
                {section.title}
              </h3>
              <span className="rounded border border-border-subtle bg-panel px-1.5 py-0.5 font-mono text-[8.5px] text-zinc-500">
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

            <div className="overflow-hidden rounded-b-xl border border-border-subtle bg-panel">
              {section.filtered.map((command, rowIndex) => {
                const key = `${section.index}-${command.commandIndex}`
                return (
                  <div
                    key={key}
                    className={cn(
                      'group grid gap-2 px-3 py-2.5 transition hover:bg-card-hover/35 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_auto] lg:items-start lg:gap-6',
                      rowIndex > 0 && 'border-t border-border-subtle',
                    )}
                  >
                    <code className="min-w-0 whitespace-pre-wrap break-words font-mono text-[12px] leading-[1.7] text-zinc-100">
                      <span className="mr-1.5 select-none text-xs text-zinc-600">$</span>
                      {rawMode ? command.command : <TokenText text={command.command} vars={vars} />}
                    </code>

                    <div className="min-w-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-[1.7] lg:pt-0.5">
                      {command.comment ? (
                        <span className="text-terminal-green/85">{commentText(command.comment)}</span>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </div>

                    <div className="flex justify-end lg:pt-0.5">
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
