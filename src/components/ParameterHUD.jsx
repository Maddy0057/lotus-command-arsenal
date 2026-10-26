import { useEffect, useState } from 'react'
import {
  Check,
  ChevronDown,
  Globe,
  Hash,
  KeyRound,
  Lock,
  Radio,
  RotateCcw,
  Server,
  Shield,
  SlidersHorizontal,
  Target,
  User,
} from 'lucide-react'
import { useExamVars } from '../context/ExamVarsContext'
import { cn } from '../lib/utils'

const PRIMARY_FIELDS = [
  { key: 'TARGET', label: 'TARGET', placeholder: '192.168.45.10', icon: Target, width: 'w-[104px]' },
  { key: 'LHOST', label: 'LHOST', placeholder: '192.168.45.5', icon: Radio, width: 'w-[104px]' },
  { key: 'LPORT', label: 'LPORT', placeholder: '4444', icon: SlidersHorizontal, width: 'w-[56px]' },
  { key: 'DOMAIN', label: 'DOMAIN', placeholder: 'corp.local', icon: Globe, width: 'w-[92px]' },
]

const ENTERPRISE_FIELDS = [
  { key: 'DC_IP', label: 'DC_IP', placeholder: '192.168.45.20', icon: Server },
  { key: 'DC_FQDN', label: 'DC_FQDN', placeholder: 'dc01.corp.local', icon: Globe },
  { key: 'USER', label: 'USER', placeholder: 'student', icon: User },
  { key: 'PASSWORD', label: 'PASSWORD', placeholder: 'Password123!', icon: Lock },
  { key: 'NTLM_HASH', label: 'NTLM_HASH', placeholder: 'LM:NTLM', icon: Hash, wide: true },
  { key: 'DOMAIN_SID', label: 'DOMAIN_SID', placeholder: 'S-1-5-21-…', icon: Shield },
  { key: 'KRB5CCNAME', label: 'KRB5CCNAME', placeholder: '/tmp/krb5cc_1000', icon: KeyRound },
  { key: 'WORDLIST', label: 'WORDLIST', placeholder: '/usr/share/wordlists/rockyou.txt', icon: KeyRound, wide: true },
]

function CompactField({ field, value, onChange, fullWidth = false }) {
  const Icon = field.icon

  return (
    <label
      className={cn(
        'group flex h-7 shrink-0 cursor-text items-center gap-1.5 rounded-md border border-border-subtle bg-white px-1.5 transition focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20',
        fullWidth ? 'w-full' : field.width,
        field.wide && 'sm:col-span-2',
      )}
      title={`${field.label} — $${field.key}`}
    >
      <Icon size={11} className="shrink-0 text-zinc-400 transition group-focus-within:text-brand" />
      <span className="shrink-0 whitespace-nowrap font-mono text-[8.5px] font-semibold uppercase tracking-[0.08em] text-zinc-500 transition group-focus-within:text-brand">
        {field.label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder}
        spellCheck={false}
        autoComplete="off"
        className={cn(
          'min-w-0 flex-1 bg-transparent font-mono text-[11px] font-medium text-zinc-900 outline-none placeholder:text-zinc-400',
          !fullWidth && 'w-full',
        )}
      />
    </label>
  )
}

export default function ParameterHUD() {
  const { vars, setVar, applyPreset, resetDefaults, activePreset, presets } = useExamVars()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!drawerOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen])

  return (
    <div className="relative z-40 h-10 border-b border-border-subtle bg-panel">
      <div className="no-scrollbar mx-auto flex h-full max-w-[1800px] items-center gap-2 overflow-x-auto px-3 lg:px-6">
        <div className="flex shrink-0 items-center gap-1.5">
          {PRIMARY_FIELDS.map((field) => (
            <CompactField
              key={field.key}
              field={field}
              value={vars[field.key] ?? ''}
              onChange={setVar}
            />
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.14em] text-zinc-400 lg:inline">
            Presets
          </span>
          {presets.map((preset) => {
            const active = activePreset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                title={preset.hint}
                className={cn(
                  'focus-ring inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-md border px-2 font-mono text-[9.5px] font-medium transition',
                  active
                    ? 'border-brand-border bg-brand-tint text-brand'
                    : 'border-border-subtle bg-white text-zinc-700 hover:border-brand-light hover:text-brand',
                )}
              >
                {active && <Check size={9} />}
                {preset.short || preset.label}
              </button>
            )
          })}
          <button
            type="button"
            onClick={resetDefaults}
            className="focus-ring inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-border-subtle bg-white px-2 font-mono text-[9.5px] font-medium text-zinc-700 transition hover:border-red-300 hover:text-red-600"
            title="Restore factory parameter values"
          >
            <RotateCcw size={9} />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen((open) => !open)}
            aria-expanded={drawerOpen}
            className={cn(
              'focus-ring inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2 font-mono text-[9.5px] font-medium transition',
              drawerOpen
                ? 'border-brand-border bg-brand-tint text-brand'
                : 'border-border-subtle bg-white text-zinc-700 hover:border-brand-light hover:text-brand',
            )}
          >
            <Server size={10} />
            Active Directory (8)
            <ChevronDown
              size={10}
              className={cn('transition-transform duration-200', drawerOpen && 'rotate-180')}
            />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-[92px] z-30 bg-zinc-900/10"
            onClick={() => setDrawerOpen(false)}
            role="presentation"
          />
          <div className="absolute right-2 top-full z-50 w-[min(920px,calc(100vw-1rem))] animate-fade-in rounded-b-xl border border-border-subtle bg-white p-4 shadow-xl sm:right-4">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-border-subtle pb-2.5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-sm border border-brand-border bg-brand-tint text-brand">
                  <Server size={12} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-900">
                    Active Directory &amp; Kerberos Parameters
                  </p>
                  <p className="text-[9.5px] text-zinc-500">
                    Domain, credential, and cracking tokens injected across every command.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="focus-ring shrink-0 rounded-sm border border-border-subtle bg-white px-2 py-1 text-[9.5px] text-zinc-600 transition hover:border-brand-light hover:text-brand"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {ENTERPRISE_FIELDS.map((field) => (
                <CompactField
                  key={field.key}
                  field={field}
                  value={vars[field.key] ?? ''}
                  onChange={setVar}
                  fullWidth
                />
              ))}
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[9px] text-zinc-400">
              Tokens auto-inject into every command ·
              <span className="text-brand">$DC_IP</span>
              <span className="text-zinc-300">·</span>
              <span className="text-brand">$USER</span>
              <span className="text-zinc-300">·</span>
              <span className="text-brand">$NTLM_HASH</span>
              <span className="ml-auto">12 variables · persisted locally</span>
            </p>
          </div>
        </>
      )}
    </div>
  )
}
