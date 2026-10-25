import { Braces, Keyboard, Menu, Sparkles } from 'lucide-react'
import { formatNumber } from '../lib/utils'
import { cn } from '../lib/utils'

function StatPill({ label, value }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="font-mono text-[11px] font-medium text-zinc-100">{formatNumber(value)}</span>
      <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{label}</span>
    </span>
  )
}

export default function Header({ stats, rawMode, onToggleRaw, onOpenShortcuts, onOpenMobile }) {
  return (
    <header className="relative border-b border-border-subtle bg-canvas/80 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-bright/60 to-transparent" />
      <div className="mx-auto flex max-w-[1800px] items-center gap-3 px-4 py-3 sm:gap-4 lg:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-card text-zinc-400 transition hover:border-border-bright hover:text-white lg:hidden"
          aria-label="Open tool navigator"
        >
          <Menu size={17} />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand/40 bg-gradient-to-br from-brand/30 via-brand/10 to-transparent text-lg shadow-glow">
            <span aria-hidden="true">🪷</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-canvas bg-terminal-green" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-mono text-[13px] font-bold tracking-[0.14em] text-white sm:text-sm">
                LOTUS COMMAND ARSENAL
              </h1>
              <span className="hidden rounded border border-brand/40 bg-brand/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-bright sm:inline">
                v1.0
              </span>
            </div>
            <p className="hidden text-[10.5px] tracking-[0.04em] text-zinc-500 sm:block">
              OSCP &amp; Active Directory field manual · live target interpolation
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-3 rounded-lg border border-border-subtle bg-panel/80 px-3 py-1.5 xl:flex">
            <StatPill value={stats.tools} label="Tools" />
            <span className="h-3 w-px bg-border-bright" />
            <StatPill value={stats.commands} label="Commands" />
            <span className="h-3 w-px bg-border-bright" />
            <StatPill value={stats.categories} label="Tactical Categories" />
          </div>

          <button
            type="button"
            onClick={onOpenShortcuts}
            className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg border border-border-subtle bg-card px-2.5 text-[11px] font-medium text-zinc-400 transition hover:border-border-bright hover:bg-card-hover hover:text-white"
            aria-label="View keyboard shortcuts"
          >
            <Keyboard size={14} />
            <span className="hidden md:inline">Shortcuts</span>
            <kbd className="hidden rounded border border-border-bright bg-panel px-1 py-0.5 font-mono text-[9px] text-zinc-500 md:inline">
              ?
            </kbd>
          </button>

          <button
            type="button"
            onClick={onToggleRaw}
            aria-pressed={rawMode}
            className={cn(
              'focus-ring inline-flex h-9 items-center gap-2 rounded-lg border px-2.5 text-[11px] font-medium transition',
              rawMode
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                : 'border-border-subtle bg-card text-zinc-400 hover:border-border-bright hover:bg-card-hover hover:text-white',
            )}
            title="Toggle raw template mode (Ctrl+Shift+C)"
          >
            {rawMode ? <Braces size={14} /> : <Sparkles size={14} />}
            <span className="hidden sm:inline">{rawMode ? 'Raw Templates' : 'Live IPs'}</span>
            <span
              className={cn(
                'relative ml-0.5 h-3.5 w-6 rounded-full border transition',
                rawMode ? 'border-amber-400/50 bg-amber-400/20' : 'border-border-bright bg-panel',
              )}
            >
              <span
                className={cn(
                  'absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all',
                  rawMode ? 'left-3 bg-amber-300' : 'left-0.5 bg-zinc-500',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-2.5 xl:hidden lg:px-6">
        <StatPill value={stats.tools} label="Tools" />
        <span className="h-3 w-px bg-border-bright" />
        <StatPill value={stats.commands} label="Commands" />
        <span className="h-3 w-px bg-border-bright" />
        <StatPill value={stats.categories} label="Tactical Categories" />
      </div>
    </header>
  )
}
