import { Braces, Keyboard, Search, X, Zap } from 'lucide-react'

const SHORTCUTS = [
  {
    keys: ['Ctrl', 'K'],
    label: 'Focus the tool & command search',
    hint: 'Jump to any of the 44 tools or 2,043 commands.',
    icon: Search,
  },
  {
    keys: ['Ctrl', 'Shift', 'C'],
    label: 'Toggle raw template mode',
    hint: 'Flip between live-injected values and $TARGET templates.',
    icon: Braces,
  },
  {
    keys: ['/'],
    label: 'Quick focus search',
    hint: 'Works anywhere outside an input field.',
    icon: Zap,
  },
  {
    keys: ['Esc'],
    label: 'Close modal or drawer',
    hint: 'Also releases focus from the active field.',
    icon: X,
  },
]

function Key({ children }) {
  return (
    <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-border-bright bg-card px-1.5 py-1 font-mono text-[10px] font-medium text-zinc-300 shadow-[inset_0_-1px_0_rgba(0,0,0,0.5)]">
      {children}
    </kbd>
  )
}

export default function ShortcutsModal({ open, onClose }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-10 backdrop-blur-sm sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="w-full max-w-lg animate-slide-up overflow-hidden rounded-2xl border border-border-bright bg-panel shadow-2xl"
      >
        <div className="relative border-b border-border-subtle bg-gradient-to-r from-brand/15 via-transparent to-token-cyan/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-brand/40 bg-brand/15 text-brand-bright">
              <Keyboard size={17} />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-sm font-semibold text-white">
                Keyboard Command Deck
              </h2>
              <p className="text-[10.5px] text-zinc-500">
                Move at terminal speed. No mouse required.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-md border border-border-subtle bg-card text-zinc-400 transition hover:text-white"
            aria-label="Close shortcuts"
          >
            <X size={14} />
          </button>
        </div>

        <div className="divide-y divide-border-subtle">
          {SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon
            return (
              <div
                key={shortcut.label}
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-card/50"
              >
                <Icon size={14} className="shrink-0 text-zinc-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-medium text-zinc-200">{shortcut.label}</p>
                  <p className="text-[10px] text-zinc-500">{shortcut.hint}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {shortcut.keys.map((key) => (
                    <Key key={key}>{key}</Key>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-subtle bg-card/40 px-5 py-3">
          <p className="text-[9.5px] text-zinc-500">
            Tip: click any tag on a tool card to search the arsenal for it.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-md border border-brand/40 bg-brand/15 px-3 py-1.5 text-[10px] font-semibold text-brand-bright transition hover:bg-brand/25"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
