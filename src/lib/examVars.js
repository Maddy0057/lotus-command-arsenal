export const STORAGE_KEY = 'lotus:arsenal_vars'

export const DEFAULT_VARS = Object.freeze({
  TARGET: '192.168.45.10',
  LHOST: '192.168.45.5',
  LPORT: '4444',
  DOMAIN: 'corp.local',
  DC_IP: '192.168.45.20',
  DC_FQDN: 'dc01.corp.local',
  USER: 'student',
  PASSWORD: 'Password123!',
  NTLM_HASH: 'aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0',
  DOMAIN_SID: 'S-1-5-21-1337-1337-1337',
  KRB5CCNAME: '/tmp/krb5cc_1000',
  WORDLIST: '/usr/share/wordlists/rockyou.txt',
})

export const VAR_META = {
  TARGET: { label: 'TARGET IP', short: 'TARGET', description: 'Primary exam target' },
  LHOST: { label: 'ATTACKER IP', short: 'LHOST', description: 'Kali tunnel / listener IP' },
  LPORT: { label: 'LISTENER PORT', short: 'LPORT', description: 'Default reverse shell port' },
  DOMAIN: { label: 'DOMAIN NAME', short: 'DOMAIN', description: 'Active Directory domain' },
  DC_IP: { label: 'DC IP', short: 'DC_IP', description: 'Domain controller address' },
  DC_FQDN: { label: 'DC FQDN', short: 'DC_FQDN', description: 'Domain controller FQDN' },
  USER: { label: 'USER', short: 'USER', description: 'Known or guessed username' },
  PASSWORD: { label: 'PASSWORD', short: 'PASSWORD', description: 'Known or sprayed password' },
  NTLM_HASH: { label: 'NTLM HASH', short: 'NTLM_HASH', description: 'LM:NTLM hash pair' },
  DOMAIN_SID: { label: 'DOMAIN SID', short: 'DOMAIN_SID', description: 'Domain security identifier' },
  KRB5CCNAME: { label: 'KRB5CCNAME', short: 'KRB5CCNAME', description: 'Kerberos credential cache' },
  WORDLIST: { label: 'WORDLIST', short: 'WORDLIST', description: 'Password / fuzz wordlist path' },
}

export const PRESETS = [
  {
    id: 'oscp',
    label: 'OSCP Exam',
    short: 'OSCP',
    hint: '192.168.45.X',
    values: {
      TARGET: '192.168.45.10',
      LHOST: '192.168.45.5',
      LPORT: '4444',
      DOMAIN: 'corp.local',
      DC_IP: '192.168.45.20',
      DC_FQDN: 'dc01.corp.local',
      USER: 'student',
      PASSWORD: 'Password123!',
      NTLM_HASH: DEFAULT_VARS.NTLM_HASH,
      DOMAIN_SID: DEFAULT_VARS.DOMAIN_SID,
      KRB5CCNAME: '/tmp/krb5cc_1000',
      WORDLIST: '/usr/share/wordlists/rockyou.txt',
    },
  },
  {
    id: 'htb',
    label: 'HTB ProLabs',
    short: 'HTB',
    hint: '10.10.14.X / 10.10.11.X',
    values: {
      TARGET: '10.10.11.10',
      LHOST: '10.10.14.5',
      LPORT: '4444',
      DOMAIN: 'htb.local',
      DC_IP: '10.10.11.20',
      DC_FQDN: 'dc01.htb.local',
      USER: 'htb.user',
      PASSWORD: 'Password123!',
      NTLM_HASH: DEFAULT_VARS.NTLM_HASH,
      DOMAIN_SID: DEFAULT_VARS.DOMAIN_SID,
      KRB5CCNAME: '/tmp/krb5cc_1000',
      WORDLIST: '/usr/share/wordlists/rockyou.txt',
    },
  },
  {
    id: 'ad-lab',
    label: 'Active Directory Lab',
    short: 'AD Lab',
    hint: '10.0.0.X / corp.local',
    values: {
      TARGET: '10.0.0.10',
      LHOST: '10.0.0.5',
      LPORT: '4444',
      DOMAIN: 'corp.local',
      DC_IP: '10.0.0.20',
      DC_FQDN: 'dc01.corp.local',
      USER: 'student',
      PASSWORD: 'Password123!',
      NTLM_HASH: DEFAULT_VARS.NTLM_HASH,
      DOMAIN_SID: DEFAULT_VARS.DOMAIN_SID,
      KRB5CCNAME: '/tmp/krb5cc_1000',
      WORDLIST: '/usr/share/wordlists/rockyou.txt',
    },
  },
]

export const RESET_PRESET = {
  id: 'reset',
  label: 'Reset Defaults',
  hint: 'Restore factory values',
  values: { ...DEFAULT_VARS },
}

const VARIABLE_KEYS = Object.keys(DEFAULT_VARS)

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildMatcher(vars) {
  const keys = Object.keys(vars)
    .filter((key) => VARIABLE_KEYS.includes(key) && vars[key] !== undefined && vars[key] !== null)
    .sort((a, b) => b.length - a.length)

  if (keys.length === 0) return null

  const alternation = keys.map(escapeRegExp).join('|')
  return new RegExp(
    `\\$\\{(${alternation})\\}|\\{\\{(${alternation})\\}\\}|<(${alternation})>|\\$(${alternation})(?![A-Za-z0-9_])`,
    'g',
  )
}

export function interpolateVars(text, vars = DEFAULT_VARS) {
  if (typeof text !== 'string' || text.length === 0) return text ?? ''
  const matcher = buildMatcher(vars)
  if (!matcher) return text

  return text.replace(matcher, (match, braced, doubleBraced, angled, bare) => {
    const key = braced || doubleBraced || angled || bare
    const value = vars[key]
    return value === undefined || value === null ? match : String(value)
  })
}

export function interpolateWithTokens(text, vars = DEFAULT_VARS) {
  if (typeof text !== 'string' || text.length === 0) return []
  const matcher = buildMatcher(vars)
  if (!matcher) return [{ text, type: 'text' }]

  const chunks = []
  let lastIndex = 0
  let match

  while ((match = matcher.exec(text)) !== null) {
    const [raw, braced, doubleBraced, angled, bare] = match
    const key = braced || doubleBraced || angled || bare
    const value = vars[key]

    if (value === undefined || value === null) continue

    if (match.index > lastIndex) {
      chunks.push({ text: text.slice(lastIndex, match.index), type: 'text' })
    }

    chunks.push({ text: String(value), type: 'var', raw, key })
    lastIndex = match.index + raw.length
  }

  if (lastIndex < text.length) {
    chunks.push({ text: text.slice(lastIndex), type: 'text' })
  }

  return chunks.length > 0 ? chunks : [{ text, type: 'text' }]
}

export function sanitizeVars(candidate) {
  const next = { ...DEFAULT_VARS }
  if (!candidate || typeof candidate !== 'object') return next

  for (const key of VARIABLE_KEYS) {
    const value = candidate[key]
    if (typeof value === 'string' || typeof value === 'number') {
      next[key] = String(value)
    }
  }
  return next
}

export function loadVars() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_VARS }
    return sanitizeVars(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_VARS }
  }
}

export function saveVars(vars) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vars))
  } catch {
    /* storage may be unavailable */
  }
}

export function extractTags(tool) {
  const direct = (tool?.tags || []).filter((tag) => tag && tag !== '##' && !tag.startsWith('#'))
  if (direct.length > 0) return [...new Set(direct)].slice(0, 8)

  const headerLine = (tool?.rawMarkdown || '').split('\n').find((line) => line.trim().startsWith('#')) || ''
  const parsed = (headerLine.match(/#[A-Za-z0-9][\w-]*/g) || [])
    .map((tag) => tag.slice(1).toLowerCase())
    .filter((tag) => tag && tag !== 'tools' && tag !== 'cheatsheet')

  if (parsed.length > 0) return [...new Set(parsed)].slice(0, 8)

  return (tool?.id || '')
    .split('-')
    .filter(Boolean)
    .slice(0, 3)
}
