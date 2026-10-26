import {
  Bug,
  GitFork,
  Globe,
  KeyRound,
  Radar,
  Server,
  Shield,
  Swords,
  Terminal,
} from 'lucide-react'
import arsenal from '../data/arsenal.json'

const EMOJI_PATTERN = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu
const TECHNICAL_ARROWS = /^[\u2190-\u21FF]$/

export function stripEmoji(value) {
  if (typeof value !== 'string' || value.length === 0) return value ?? ''

  return value
    .replace(EMOJI_PATTERN, (match) => (TECHNICAL_ARROWS.test(match) ? match : ' '))
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/^[.\-–—:|]+\s*/, '')
    .trim()
}

export const CATEGORY_META = {
  '00': {
    label: 'Battlecards',
    title: 'Instant Exam Battlecards',
    icon: Swords,
  },
  '01': {
    label: 'Port Scanning',
    title: 'Port Scanning & Fingerprinting',
    icon: Radar,
  },
  '02': {
    label: 'Web Fuzzing',
    title: 'Web Fuzzing & Discovery',
    icon: Globe,
  },
  '03': {
    label: 'Exploitation',
    title: 'Exploitation & Vulnerabilities',
    icon: Bug,
  },
  '04': {
    label: 'Remote Access',
    title: 'Shells, Listeners & Remote Access',
    icon: Terminal,
  },
  '05': {
    label: 'Privilege Escalation',
    title: 'Privilege Escalation & Local Auditing',
    icon: Shield,
  },
  '06': {
    label: 'Active Directory',
    title: 'Active Directory & Kerberos',
    icon: Server,
  },
  '07': {
    label: 'Network Spraying & Pivoting',
    title: 'Network Spraying & Pivoting',
    icon: GitFork,
  },
  '08': {
    label: 'Password Cracking',
    title: 'Password Cracking & Wordlists',
    icon: KeyRound,
  },
}

const FILTER_DEFS = [
  { id: 'battlecards', prefix: '00' },
  { id: 'scanning', prefix: '01' },
  { id: 'web', prefix: '02' },
  { id: 'exploit', prefix: '03' },
  { id: 'shells', prefix: '04' },
  { id: 'privesc', prefix: '05' },
  { id: 'active-directory', prefix: '06' },
  { id: 'pivoting', prefix: '07' },
  { id: 'cracking', prefix: '08' },
]

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  ...FILTER_DEFS.map((filter) => ({
    ...filter,
    label: CATEGORY_META[filter.prefix]?.label || filter.id,
    icon: CATEGORY_META[filter.prefix]?.icon,
  })),
]

const FILTER_BY_PREFIX = CATEGORY_FILTERS.reduce((acc, filter) => {
  if (filter.prefix) acc[filter.prefix] = filter
  return acc
}, {})

function sanitizeCommand(command) {
  return {
    ...command,
    command: stripEmoji(command.command),
    comment: stripEmoji(command.comment),
    full: stripEmoji(command.full),
  }
}

function sanitizeSection(section) {
  return {
    ...section,
    title: stripEmoji(section.title),
    commands: (section.commands || []).map(sanitizeCommand),
  }
}

function sanitizeTool(tool) {
  const callout = tool.callout || {}

  return {
    ...tool,
    shortName: stripEmoji(tool.shortName),
    fullTitle: stripEmoji(tool.fullTitle),
    tags: (tool.tags || []).map(stripEmoji).filter(Boolean),
    callout: {
      why: stripEmoji(callout.why),
      where: stripEmoji(callout.where),
      when: stripEmoji(callout.when),
    },
    sections: (tool.sections || []).map(sanitizeSection),
  }
}

function buildHaystack(tool) {
  const callout = tool.callout || {}
  const parts = [
    tool.shortName,
    tool.fullTitle,
    tool.id,
    ...(tool.tags || []),
    callout.why,
    callout.where,
    callout.when,
  ]

  for (const section of tool.sections || []) {
    parts.push(section.title)
    for (const command of section.commands || []) {
      parts.push(command.command, command.comment)
    }
  }

  return parts.filter(Boolean).join(' ').toLowerCase()
}

export function buildArsenal() {
  const categories = arsenal.map((category, index) => {
    const prefix = category.id.slice(0, 2)
    const filter = FILTER_BY_PREFIX[prefix]
    const meta = CATEGORY_META[prefix]
    const title = meta?.title || stripEmoji(category.title)
    const label = meta?.label || stripEmoji(category.title)

    const tools = (category.tools || []).map((rawTool) => {
      const tool = sanitizeTool(rawTool)
      const commandCount = (tool.sections || []).reduce(
        (total, section) => total + (section.commands?.length || 0),
        0,
      )

      return {
        ...tool,
        categoryId: category.id,
        categoryTitle: title,
        categoryIndex: index,
        categoryLabel: label,
        commandCount,
        searchHaystack: buildHaystack(tool),
      }
    })

    return {
      ...category,
      title,
      label,
      number: prefix,
      icon: meta?.icon || Terminal,
      index,
      prefix,
      filterId: filter?.id || 'all',
      tools,
      toolCount: tools.length,
      commandCount: tools.reduce((total, tool) => total + tool.commandCount, 0),
    }
  })

  const tools = categories.flatMap((category) => category.tools)

  return {
    categories,
    tools,
    stats: {
      tools: tools.length,
      commands: categories.reduce((total, category) => total + category.commandCount, 0),
      categories: categories.length,
      domains: categories.length,
    },
  }
}

export function findTool(tools, id) {
  return tools.find((tool) => tool.id === id) || tools[0]
}

export function findCategoryForTool(categories, tool) {
  return categories.find((category) => category.id === tool?.categoryId) || categories[0]
}
