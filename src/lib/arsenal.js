import arsenal from '../data/arsenal.json'

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'battlecards', label: 'Battlecards', prefix: '00' },
  { id: 'scanning', label: 'Scanning', prefix: '01' },
  { id: 'web', label: 'Web', prefix: '02' },
  { id: 'exploit', label: 'Exploit', prefix: '03' },
  { id: 'shells', label: 'Shells', prefix: '04' },
  { id: 'privesc', label: 'PrivEsc', prefix: '05' },
  { id: 'active-directory', label: 'Active Directory', prefix: '06' },
  { id: 'pivoting', label: 'Pivoting', prefix: '07' },
  { id: 'cracking', label: 'Cracking', prefix: '08' },
]

const FILTER_BY_PREFIX = CATEGORY_FILTERS.reduce((acc, filter) => {
  if (filter.prefix) acc[filter.prefix] = filter
  return acc
}, {})

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

    const tools = (category.tools || []).map((tool) => {
      const commandCount = (tool.sections || []).reduce(
        (total, section) => total + (section.commands?.length || 0),
        0,
      )

      return {
        ...tool,
        categoryId: category.id,
        categoryTitle: category.title,
        categoryIndex: index,
        categoryLabel: filter?.label || category.title,
        commandCount,
        searchHaystack: buildHaystack(tool),
      }
    })

    return {
      ...category,
      index,
      prefix,
      filterId: filter?.id || 'all',
      label: filter?.label || category.title,
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
    },
  }
}

export function findTool(tools, id) {
  return tools.find((tool) => tool.id === id) || tools[0]
}

export function findCategoryForTool(categories, tool) {
  return categories.find((category) => category.id === tool?.categoryId) || categories[0]
}
