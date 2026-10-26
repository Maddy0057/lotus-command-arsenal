import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ParameterHUD from './components/ParameterHUD'
import Sidebar from './components/Sidebar'
import CommandViewer from './components/CommandViewer'
import ShortcutsModal from './components/ShortcutsModal'
import { buildArsenal, findCategoryForTool, findTool } from './lib/arsenal'
import { useExamVars } from './context/ExamVarsContext'

const ARSENAL = buildArsenal()
const FIRST_TOOL = ARSENAL.tools[0]

function focusToolSearch() {
  const candidates = Array.from(document.querySelectorAll('[data-tool-search]'))
  const target = candidates.find((element) => element.offsetParent !== null) || candidates[0]
  if (!target) return
  target.focus()
  target.select?.()
}

export default function App() {
  const { vars } = useExamVars()
  const [selectedToolId, setSelectedToolId] = useState(FIRST_TOOL?.id ?? null)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [rawMode, setRawMode] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const selectedTool = useMemo(
    () => findTool(ARSENAL.tools, selectedToolId),
    [selectedToolId],
  )
  const selectedCategory = useMemo(
    () => findCategoryForTool(ARSENAL.categories, selectedTool),
    [selectedTool],
  )

  const handleSelectTool = useCallback((toolId) => {
    setSelectedToolId(toolId)
    setMobileOpen(false)
  }, [])

  const handleFilterChange = useCallback(
    (filterId) => {
      setActiveFilter(filterId)
      if (filterId === 'all') return
      const category = ARSENAL.categories.find((item) => item.filterId === filterId)
      if (!category || category.tools.length === 0) return
      if (!category.tools.some((tool) => tool.id === selectedToolId)) {
        setSelectedToolId(category.tools[0].id)
      }
    },
    [selectedToolId],
  )

  const handleTagClick = useCallback((tag) => {
    setActiveFilter('all')
    setSearch(tag)
    if (window.innerWidth < 1024) setMobileOpen(true)
    window.setTimeout(focusToolSearch, 90)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const tagName = target?.tagName
      const typing =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        target?.isContentEditable
      const modifier = event.ctrlKey || event.metaKey

      if (modifier && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (window.innerWidth < 1024) setMobileOpen(true)
        window.setTimeout(focusToolSearch, 80)
        return
      }

      if (modifier && event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault()
        setRawMode((current) => !current)
        return
      }

      if (event.key === '/' && !typing) {
        event.preventDefault()
        if (window.innerWidth < 1024) setMobileOpen(true)
        window.setTimeout(focusToolSearch, 80)
        return
      }

      if (event.key === '?' && !typing) {
        event.preventDefault()
        setShortcutsOpen(true)
        return
      }

      if (event.key === 'Escape') {
        setShortcutsOpen(false)
        setMobileOpen(false)
        if (typing) target.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 shadow-[0_8px_24px_-20px_rgba(28,25,23,0.35)]">
        <Header
          stats={ARSENAL.stats}
          rawMode={rawMode}
          onToggleRaw={() => setRawMode((current) => !current)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <ParameterHUD />
      </div>

      <div className="mx-auto max-w-[1800px] px-4 py-5 lg:px-6">
        <div className="flex items-start gap-5">
          <aside className="hidden w-[302px] shrink-0 lg:block">
            <div className="sticky top-[214px]">
              <Sidebar
                categories={ARSENAL.categories}
                search={search}
                onSearchChange={setSearch}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                selectedToolId={selectedTool?.id}
                selectedCategoryId={selectedCategory?.id}
                onSelectTool={handleSelectTool}
                onCloseMobile={() => setMobileOpen(false)}
              />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {selectedTool && (
              <CommandViewer
                tool={selectedTool}
                category={selectedCategory}
                vars={vars}
                rawMode={rawMode}
                onRawModeChange={setRawMode}
                onTagClick={handleTagClick}
              />
            )}
          </main>
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle px-1 py-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">
            LOTUS // ARSENAL · Offensive Security &amp; Active Directory Field Manual
          </p>
          <p className="font-mono text-[9px] text-zinc-400">
            44 tools · 2,043 commands · interpolated locally · no telemetry
          </p>
        </footer>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-zinc-900/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-[350px] animate-fade-in border-r border-border-subtle bg-canvas shadow-xl">
            <Sidebar
              mobile
              categories={ARSENAL.categories}
              search={search}
              onSearchChange={setSearch}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              selectedToolId={selectedTool?.id}
              selectedCategoryId={selectedCategory?.id}
              onSelectTool={handleSelectTool}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
