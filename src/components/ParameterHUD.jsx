import { useState } from 'react'
import {
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
  Zap,
} from 'lucide-react'
import { useExamVars } from '../context/ExamVarsContext'
import { cn } from '../lib/utils'

const PRIMARY_FIELDS = [
  { key: 'TARGET', label: 'TARGET IP', placeholder: '192.168.45.10', icon: Target },
  { key: 'LHOST', label: 'ATTACKER IP', placeholder: '192.168.45.5', icon: Radio },
  { key: 'LPORT', label: 'LISTENER PORT', placeholder: '4444', icon: SlidersHorizontal },
  { key: 'DOMAIN', label: 'DOMAIN NAME', placeholder: 'corp.local', icon: Globe },
]

const ENTERPRISE_FIELDS = [
  { key: 'DC_IP', label: 'DC IP', placeholder: '192.168.45.20', icon: Server },
  { key: 'DC_FQDN', label: 'DC FQDN', placeholder: 'dc01.corp.local', icon: Globe },
  { key: 'USER', label: 'USER', placeholder: 'student', icon: User },
  { key: 'PASSWORD', label: 'PASSWORD', placeholder: 'Password123!', icon: Lock },
  { key: 'NTLM_HASH', label: 'NTLM HASH', placeholder: 'LM:NTLM', icon: Hash, wide: true },
  { key: 'DOMAIN_SID', label: 'DOMAIN SID', placeholder: 'S-1-5-21-...', icon: Shield },
  { key: 'KRB5CCNAME', label: 'KRB5CCNAME', placeholder: '/tmp/krb5cc_1000', icon: KeyRound },
  { key: 'WORDLIST', label: 'WORDLIST', placeholder: '/usr/share/wordlists/rockyou.txt', icon: KeyRound, wide: true },
]

function VarField({ field, value, onChange }) {
  const Icon = field.icon

  return (
    <label
      className={cn(
        'group relative block cursor-text rounded-lg border border-border-subtle bg-card/70 px-3 py-2 transition focus-within:border-brand/60 focus-within:bg-card focus-within:shadow-[0_0_0_1px_rgba(113,112,255,0.35)]',
        field.wide && 'sm:col-span-2',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500 transition group-focus-within:text-brand-bright">
          <Icon size={11} className="shrink-0" />
          {field.label}
        </span>
        <span className="font-mono text-[9px] text-zinc-600 transition group-focus-within:text-brand-bright/80">
          ${field.key}
        </span>
      </span>
      <input
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder}
        spellCheck={false}
        autoComplete="off"
        className="mt-0.5 w-full bg-transparent font-mono text-[12.5px] font-medium text-zinc-100 outline-none placeholder:text-zinc-600"
      />
    </label>
  )
}

export default function ParameterHUD() {
  const { vars, setVar, applyPreset, resetDefaults, activePreset, presets } = useExamVars()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="relative border-b border-border-subtle bg-panel/85 glass">
      <div className="mx-auto max-w-[1800px] px-4 py-2.5 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 pr-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-60" />
              <span className="relative inline-flex h-2 w-2 animate-glow-pulse rounded-full bg-terminal-green" />
            </span>
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-zinc-300">
              Parameter HUD
            </span>
            <span className="hidden rounded border border-terminal-green/25 bg-terminal-green/10 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-terminal-green sm:inline">
              Live interpolation
            </span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            {presets.map((preset) => {
              const active = activePreset === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  title={preset.hint}
                  className={cn(
                    'focus-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium transition',
                    active
                      ? 'border-brand/50 bg-brand/15 text-brand-bright shadow-[0_0_18px_-6px_rgba(113,112,255,0.8)]'
                      : 'border-border-subtle bg-card/70 text-zinc-400 hover:border-border-bright hover:text-zinc-100',
                  )}
                >
                  {active && <Zap size={10} />}
                  {preset.label}
                  <span className="hidden font-mono text-[8.5px] text-zinc-600 lg:inline">{preset.hint}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={resetDefaults}
              className="focus-ring inline-flex items-center gap-1 rounded-full border border-border-subtle bg-card/70 px-2.5 py-1 text-[10px] font-medium text-zinc-400 transition hover:border-red-400/40 hover:text-red-300"
              title="Restore factory parameter values"
            >
              <RotateCcw size={10} />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PRIMARY_FIELDS.map((field) => (
            <VarField key={field.key} field={field} value={vars[field.key] ?? ''} onChange={setVar} />
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen((open) => !open)}
            aria-expanded={drawerOpen}
            className={cn(
              'focus-ring inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[10.5px] font-medium transition',
              drawerOpen
                ? 'border-brand/40 bg-brand/10 text-brand-bright'
                : 'border-border-subtle bg-card/60 text-zinc-400 hover:border-border-bright hover:text-zinc-100',
            )}
          >
            <span aria-hidden="true">🏰</span>
            Active Directory &amp; Enterprise Parameters
            <span className="rounded bg-panel px-1 font-mono text-[9px] text-zinc-500">8</span>
            <ChevronDown
              size={12}
              className={cn('transition-transform duration-200', drawerOpen && 'rotate-180')}
            />
          </button>
          <span className="hidden items-center gap-1.5 font-mono text-[9.5px] text-zinc-600 sm:flex">
            Tokens auto-inject into every command · <span className="text-token-cyan">$TARGET</span>
            <span className="text-zinc-700">·</span>
            <span className="text-token-cyan">$LHOST</span>
            <span className="text-zinc-700">·</span>
            <span className="text-token-cyan">$DOMAIN</span>
          </span>
          <span className="ml-auto font-mono text-[9px] text-zinc-600">
            12 variables · persisted locally
          </span>
        </div>
      </div>

      {drawerOpen && (
        <div className="absolute inset-x-0 top-full z-50 animate-fade-in border-b border-border-bright bg-panel/95 shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto max-w-[1800px] px-4 py-3 lg:px-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md border border-brand/30 bg-brand/10 text-[11px]">
                  🏰
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-200">
                    Active Directory &amp; Enterprise Parameters
                  </p>
                  <p className="text-[9.5px] text-zinc-500">
                    Kerberos, LDAP, SMB, spraying and cracking tokens for domain domination.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="focus-ring rounded-md border border-border-subtle bg-card px-2 py-1 text-[9.5px] text-zinc-400 transition hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {ENTERPRISE_FIELDS.map((field) => (
                <VarField key={field.key} field={field} value={vars[field.key] ?? ''} onChange={setVar} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
