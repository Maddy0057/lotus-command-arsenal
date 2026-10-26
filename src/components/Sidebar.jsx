import { useEffect, useMemo, useState } from 'react'
import {
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Layers,
  Search,
  X,
} from 'lucide-react'
import { CATEGORY_FILTERS } from '../lib/arsenal'
import { cn } from '../lib/utils'

export default function Sidebar({
  categories,
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  selectedToolId,
  selectedCategoryId,
  onSelectTool,
  onCloseMobile,
  mobile = false,
}) {
  const [expanded, setExpanded] = useState(() => {
    const initial = new Set()
    if (selectedCategoryId) initial.add(selectedCategoryId)
    else if (categories[0]) initial.add(categories[0].id)
    return initial
  })

  const query = search.trim().toLowerCase()

  useEffect(() => {
    if (!selectedCategoryId) return
    setExpanded((current) => {
      if (current.has(selectedCategoryId)) return current
      const next = new Set(current)
      next.add(selectedCategoryId)
      return next
    })
  }, [selectedCategoryId])

  useEffect(() => {
    if (activeFilter === 'all') return
    const match = categories.find((category) => category.filterId === activeFilter)
    if (!match) return
    setExpanded((current) => {
      if (current.has(match.id)) return current
      const next = new Set(current)
      next.add(match.id)
      return next
    })
  }, [activeFilter, categories])

  const visibleCategories = useMemo(() => {
    return categories
      .filter((category) => activeFilter === 'all' || category.filterId === activeFilter)
      .map((category) => ({
        ...category,
        filteredTools: query
          ? category.tools.filter((tool) => tool.searchHaystack.includes(query))
          : category.tools,
      }))
      .filter((category) => category.filteredTools.length > 0)
  }, [categories, activeFilter, query])

  const totalVisibleTools = visibleCategories.reduce(
    (total, category) => total + category.filteredTools.length,
    0,
  )

  const toggleCategory = (id) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => {
    setExpanded((current) => {
      const next = new Set(current)
      visibleCategories.forEach((category) => next.add(category.id))
      return next
    })
  }

  const collapseAll = () => {
    setExpanded((current) => {
      const next = new Set(current)
      visibleCategories.forEach((category) => next.delete(category.id))
      return next
    })
  }

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-panel shadow-panel',
        mobile ? 'h-full max-h-none rounded-none border-0 bg-panel' : 'max-h-[calc(100vh-232px)]',
      )}
    >
      <div className="border-b border-border-subtle bg-panel p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Tool Index
          </span>
          {mobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="focus-ring grid h-7 w-7 place-items-center rounded-sm border border-border-subtle bg-card text-zinc-400 transition hover:text-white"
              aria-label="Close navigator"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="group relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 transition group-focus-within:text-brand-bright"
          />
          <input
            data-tool-search
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tools and commands…"
            spellCheck={false}
            className="focus-ring w-full rounded-md border border-border-subtle bg-card py-2 pl-8 pr-14 font-mono text-[11.5px] text-zinc-100 placeholder:text-zinc-600 transition focus:border-brand/50"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-sm text-zinc-500 transition hover:bg-card-hover hover:text-white"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border border-border-bright bg-panel px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
              Ctrl K
            </kbd>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {CATEGORY_FILTERS.map((filter) => {
            const FilterIcon = filter.icon
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={cn(
                  'focus-ring inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-[9.5px] font-medium transition',
                  activeFilter === filter.id
                    ? 'border-brand/50 bg-brand/10 text-brand-bright'
                    : 'border-transparent bg-card/60 text-zinc-500 hover:bg-card-hover hover:text-zinc-200',
                )}
              >
                {FilterIcon ? <FilterIcon size={9} className="shrink-0" /> : <Layers size={9} className="shrink-0" />}
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-3 py-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-600">
          {query ? `${totalVisibleTools} matches` : `${totalVisibleTools} tools`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={expandAll}
            className="focus-ring flex items-center gap-1 rounded-sm px-1.5 py-1 text-[9px] text-zinc-500 transition hover:bg-card-hover hover:text-zinc-200"
          >
            <ChevronsUpDown size={10} />
            Expand
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="focus-ring flex items-center gap-1 rounded-sm px-1.5 py-1 text-[9px] text-zinc-500 transition hover:bg-card-hover hover:text-zinc-200"
          >
            <ChevronsDownUp size={10} />
            Collapse
          </button>
        </div>
      </div>

      <div className="scroll-area min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {visibleCategories.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-[11px] font-medium text-zinc-400">No tools found</p>
            <p className="mt-1 text-[10px] text-zinc-600">
              Try a tool name, tag, port, or command fragment.
            </p>
          </div>
        )}

        <div className="space-y-0.5">
          {visibleCategories.map((category) => {
            const open = query.length > 0 || expanded.has(category.id)
            const activeCategory = category.id === selectedCategoryId
            const CategoryIcon = category.icon || Layers

            return (
              <div key={category.id}>
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    'focus-ring group flex w-full items-center gap-1.5 rounded-md border-l-2 px-2 py-1.5 text-left transition',
                    activeCategory
                      ? 'border-l-brand bg-brand/5'
                      : 'border-l-transparent hover:bg-card/80',
                  )}
                  aria-expanded={open}
                >
                  <ChevronRight
                    size={12}
                    className={cn(
                      'shrink-0 text-zinc-600 transition-transform duration-200 group-hover:text-zinc-400',
                      open && 'rotate-90',
                    )}
                  />
                  <span className="w-4 shrink-0 font-mono text-[8.5px] text-zinc-600">
                    {category.number}
                  </span>
                  <CategoryIcon
                    size={13}
                    className={cn(
                      'shrink-0 transition',
                      activeCategory || open ? 'text-brand-bright/80' : 'text-zinc-500',
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium text-zinc-400 transition group-hover:text-zinc-200">
                    {category.label}
                  </span>
                  <span className="rounded-sm border border-border-subtle bg-card px-1 py-0.5 font-mono text-[8.5px] text-zinc-500">
                    {category.filteredTools.length}
                  </span>
                </button>

                {open && (
                  <div className="ml-3.5 space-y-0.5 border-l border-border-subtle py-0.5 pl-2">
                    {category.filteredTools.map((tool) => {
                      const active = tool.id === selectedToolId
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => onSelectTool(tool.id)}
                          className={cn(
                            'group relative flex w-full items-start gap-1.5 rounded-sm px-2 py-1.5 text-left transition',
                            active
                              ? 'bg-brand/10 text-white'
                              : 'text-zinc-500 hover:bg-card/80 hover:text-zinc-200',
                          )}
                        >
                          <span
                            className={cn(
                              'absolute -left-2.5 top-1.5 h-[calc(100%-12px)] w-[2px] rounded-full transition',
                              active ? 'bg-brand-bright' : 'bg-transparent',
                            )}
                          />
                          <span
                            className={cn(
                              'mt-1 h-1 w-1 shrink-0 rounded-full transition',
                              active ? 'bg-brand-bright' : 'bg-zinc-700 group-hover:bg-zinc-500',
                            )}
                          />
                          <span className="min-w-0 flex-1 text-[10.5px] leading-[1.45]">{tool.shortName}</span>
                          <span
                            className={cn(
                              'mt-0.5 shrink-0 font-mono text-[8.5px]',
                              active ? 'text-brand-bright/80' : 'text-zinc-700',
                            )}
                          >
                            {tool.commandCount}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border-subtle bg-panel px-3 py-2">
        <p className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.12em] text-zinc-600">
          <span>9 domains</span>
          <span className="text-terminal-green/70">live · persisted</span>
        </p>
      </div>
    </div>
  )
}
