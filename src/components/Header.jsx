import { Braces, Keyboard, Menu, Radio, Terminal } from 'lucide-react'
import { formatNumber } from '../lib/utils'
import { cn } from '../lib/utils'

function StatPill({ label, value }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="font-mono text-[11px] font-semibold text-zinc-800">{formatNumber(value)}</span>
      <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</span>
    </span>
  )
}

export default function Header({ stats, rawMode, onToggleRaw, onOpenShortcuts, onOpenMobile }) {
  return (
    <header className="relative border-b border-border-subtle bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1800px] items-center gap-3 px-4 py-3 sm:gap-4 lg:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-white text-zinc-600 transition hover:border-brand-light hover:text-brand lg:hidden"
          aria-label="Open tool navigator"
        >
          <Menu size={17} />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-md border border-orange-200 bg-orange-50 text-orange-600">
            <Terminal size={18} strokeWidth={2.25} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-mono text-[13px] font-bold tracking-[0.18em] text-zinc-900 sm:text-sm">
                LOTUS // ARSENAL
              </h1>
              <span className="hidden items-center gap-1 rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 sm:inline-flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
                <span className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-emerald-700">
                  LIVE
                </span>
              </span>
            </div>
            <p className="hidden text-[10.5px] tracking-[0.02em] text-zinc-500 sm:block">
              High-Density Offensive Security &amp; Active Directory Field Manual
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-3 rounded-md border border-border-subtle bg-white px-3 py-1.5 xl:flex">
            <StatPill value={stats.tools} label="Tools" />
            <span className="h-3 w-px bg-border-subtle" />
            <StatPill value={stats.commands} label="Commands" />
            <span className="h-3 w-px bg-border-subtle" />
            <StatPill value={stats.domains ?? stats.categories} label="Domains" />
          </div>

          <button
            type="button"
            onClick={onOpenShortcuts}
            className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-border-subtle bg-white px-2.5 text-[11px] font-medium text-zinc-600 transition hover:border-brand-light hover:text-brand"
            aria-label="View keyboard shortcuts"
          >
            <Keyboard size={14} />
            <span className="hidden md:inline">Shortcuts</span>
            <kbd className="hidden rounded-sm border border-border-subtle bg-panel px-1 py-0.5 font-mono text-[9px] text-zinc-500 md:inline">
              ?
            </kbd>
          </button>

          <button
            type="button"
            onClick={onToggleRaw}
            aria-pressed={rawMode}
            className={cn(
              'focus-ring inline-flex h-9 items-center gap-2 rounded-md border px-2.5 text-[11px] font-medium transition',
              rawMode
                ? 'border-brand-border bg-brand-tint text-brand'
                : 'border-border-subtle bg-white text-zinc-600 hover:border-brand-light hover:text-brand',
            )}
            title="Toggle raw template mode (Ctrl+Shift+C)"
          >
            {rawMode ? <Braces size={14} /> : <Radio size={14} />}
            <span className="hidden sm:inline">{rawMode ? 'Raw Templates' : 'Live IPs'}</span>
            <span
              className={cn(
                'relative ml-0.5 h-3.5 w-6 rounded-full border transition',
                rawMode ? 'border-brand-border bg-brand-tint' : 'border-border-subtle bg-panel',
              )}
            >
              <span
                className={cn(
                  'absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all',
                  rawMode ? 'left-3 bg-brand' : 'left-0.5 bg-zinc-400',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-2.5 xl:hidden lg:px-6">
        <StatPill value={stats.tools} label="Tools" />
        <span className="h-3 w-px bg-border-subtle" />
        <StatPill value={stats.commands} label="Commands" />
        <span className="h-3 w-px bg-border-subtle" />
        <StatPill value={stats.domains ?? stats.categories} label="Domains" />
      </div>
    </header>
  )
}
