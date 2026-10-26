import { Braces, Keyboard, Menu, Radio, Search, Terminal } from 'lucide-react'
import { cn, formatNumber } from '../lib/utils'

export default function Header({
  stats,
  rawMode,
  onToggleRaw,
  onOpenShortcuts,
  onOpenMobile,
  onOpenSearch,
}) {
  return (
    <header className="h-[52px] border-b border-border-subtle bg-white">
      <div className="mx-auto flex h-full max-w-[1800px] items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          className="focus-ring inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-white text-zinc-600 transition hover:border-brand-light hover:text-brand lg:hidden"
          aria-label="Open tool navigator"
        >
          <Menu size={16} />
        </button>

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-md border border-orange-200 bg-orange-50 text-orange-600">
            <Terminal size={15} strokeWidth={2.25} />
          </div>
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <h1 className="truncate font-mono text-[11.5px] font-bold tracking-[0.16em] text-zinc-900 sm:text-[12.5px]">
              LOTUS // ARSENAL
            </h1>
            <span className="hidden rounded-sm border border-border-subtle bg-panel px-1 py-0.5 font-mono text-[8.5px] font-medium text-zinc-500 sm:inline">
              v1.0
            </span>
            <span className="hidden items-center gap-1 rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </span>
              <span className="font-mono text-[8px] font-bold tracking-[0.14em] text-emerald-700">
                LIVE
              </span>
            </span>
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-md px-1 md:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="focus-ring group flex h-8 w-full items-center gap-2 rounded-md border border-border-subtle bg-panel/70 px-2.5 text-left transition hover:border-brand-light hover:bg-white"
            aria-label="Search the arsenal"
          >
            <Search size={13} className="shrink-0 text-zinc-400 transition group-hover:text-brand" />
            <span className="min-w-0 flex-1 truncate text-[11px] text-zinc-400">
              Search tools, commands, tags…
            </span>
            <kbd className="shrink-0 rounded-sm border border-border-subtle bg-white px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
              Ctrl K
            </kbd>
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1.5 whitespace-nowrap rounded-md border border-border-subtle bg-white px-2.5 py-1 font-mono text-[10px] text-zinc-500 xl:flex">
            <span className="font-semibold text-zinc-800">{formatNumber(stats.tools)}</span>
            <span>Tools</span>
            <span className="text-zinc-300">·</span>
            <span className="font-semibold text-zinc-800">{formatNumber(stats.commands)}</span>
            <span>Commands</span>
          </div>

          <button
            type="button"
            onClick={onOpenSearch}
            className="focus-ring grid h-8 w-8 place-items-center rounded-md border border-border-subtle bg-white text-zinc-600 transition hover:border-brand-light hover:text-brand md:hidden"
            aria-label="Search the arsenal"
          >
            <Search size={14} />
          </button>

          <button
            type="button"
            onClick={onToggleRaw}
            aria-pressed={rawMode}
            className={cn(
              'focus-ring inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-[10.5px] font-medium transition',
              rawMode
                ? 'border-brand-border bg-brand-tint text-brand'
                : 'border-border-subtle bg-white text-zinc-600 hover:border-brand-light hover:text-brand',
            )}
            title="Toggle raw template mode (Ctrl+Shift+C)"
          >
            {rawMode ? <Braces size={13} /> : <Radio size={13} />}
            <span className="hidden sm:inline">{rawMode ? 'Raw' : 'Live'}</span>
            <span
              className={cn(
                'relative h-3.5 w-6 rounded-full border transition',
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

          <button
            type="button"
            onClick={onOpenShortcuts}
            className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-md border border-border-subtle bg-white px-2 text-[10.5px] font-medium text-zinc-600 transition hover:border-brand-light hover:text-brand"
            aria-label="View keyboard shortcuts"
          >
            <Keyboard size={13} />
            <span className="hidden md:inline">Shortcuts</span>
            <kbd className="hidden rounded-sm border border-border-subtle bg-panel px-1 py-0.5 font-mono text-[9px] text-zinc-500 md:inline">
              ?
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
