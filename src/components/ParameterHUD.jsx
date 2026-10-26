import { useState } from 'react'
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
        'group flex h-9 cursor-text items-center gap-2 rounded-md border border-border-subtle bg-white px-2.5 transition focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20',
        field.wide && 'sm:col-span-2',
      )}
    >
      <Icon
        size={12}
        className="shrink-0 text-zinc-400 transition group-focus-within:text-brand"
      />
      <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500 transition group-focus-within:text-brand">
        {field.label}
      </span>
      <span className="hidden shrink-0 rounded-sm bg-panel px-1 py-0.5 font-mono text-[8.5px] text-zinc-400 transition group-focus-within:text-brand/80 md:inline">
        ${field.key}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder}
        spellCheck={false}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent font-mono text-[12px] font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
      />
    </label>
  )
}

export default function ParameterHUD() {
  const { vars, setVar, applyPreset, resetDefaults, activePreset, presets } = useExamVars()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="border-b border-border-subtle bg-panel">
      <div className="mx-auto max-w-[1800px] px-4 py-2.5 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 pr-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 animate-glow-pulse rounded-full bg-emerald-600" />
            </span>
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-zinc-700">
              Parameter HUD
            </span>
            <span className="hidden rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-emerald-700 sm:inline">
              Live interpolation
            </span>
          </div>

          <div className="no-scrollbar ml-auto flex items-center gap-1.5 overflow-x-auto">
            {presets.map((preset) => {
              const active = activePreset === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  title={preset.hint}
                  className={cn(
                    'focus-ring inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] font-medium transition',
                    active
                      ? 'border-brand-border bg-brand-tint text-brand'
                      : 'border-border-subtle bg-white text-zinc-700 hover:border-brand-light hover:text-brand',
                  )}
                >
                  {active && <Check size={10} />}
                  {preset.label}
                  <span className="hidden font-mono text-[8.5px] text-zinc-400 lg:inline">{preset.hint}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={resetDefaults}
              className="focus-ring inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-border-subtle bg-white px-2.5 py-1 text-[10px] font-medium text-zinc-700 transition hover:border-red-300 hover:text-red-600"
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
              'focus-ring inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[10.5px] font-medium transition',
              drawerOpen
                ? 'border-brand-border bg-brand-tint text-brand'
                : 'border-border-subtle bg-white text-zinc-700 hover:border-brand-light hover:text-brand',
            )}
          >
            <Server size={12} />
            Active Directory &amp; Kerberos Parameters
            <span className="rounded-sm bg-panel px-1 font-mono text-[9px] text-zinc-500">8</span>
            <ChevronDown
              size={12}
              className={cn('transition-transform duration-200', drawerOpen && 'rotate-180')}
            />
          </button>
          <span className="hidden items-center gap-1.5 font-mono text-[9.5px] text-zinc-400 sm:flex">
            Tokens auto-inject into every command · <span className="text-brand">$TARGET</span>
            <span className="text-zinc-300">·</span>
            <span className="text-brand">$LHOST</span>
            <span className="text-zinc-300">·</span>
            <span className="text-brand">$DOMAIN</span>
          </span>
          <span className="ml-auto font-mono text-[9px] text-zinc-400">
            12 variables · persisted locally
          </span>
        </div>

        <div
          aria-hidden={!drawerOpen}
          className={cn(
            'overflow-hidden transition-all duration-200',
            drawerOpen
              ? 'mt-2.5 max-h-[640px] border-t border-border-subtle pt-2.5 opacity-100'
              : 'pointer-events-none mt-0 max-h-0 border-t border-transparent pt-0 opacity-0',
          )}
        >
          <div className="pb-1">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-sm border border-brand-border bg-brand-tint text-brand">
                  <Server size={12} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-900">
                    Active Directory &amp; Kerberos Parameters
                  </p>
                  <p className="text-[9.5px] text-zinc-500">
                    Kerberos, LDAP, SMB, spraying and cracking tokens for domain operations.
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
                <VarField key={field.key} field={field} value={vars[field.key] ?? ''} onChange={setVar} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
