import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_VARS,
  PRESETS,
  RESET_PRESET,
  interpolateVars,
  loadVars,
  sanitizeVars,
  saveVars,
} from '../lib/examVars'

const ExamVarsContext = createContext(null)

export function ExamVarsProvider({ children }) {
  const [vars, setVars] = useState(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_VARS }
    return loadVars()
  })
  const [activePreset, setActivePreset] = useState('oscp')

  useEffect(() => {
    saveVars(vars)
  }, [vars])

  const setVar = useCallback((key, value) => {
    setVars((current) => ({ ...current, [key]: String(value ?? '') }))
    setActivePreset(null)
  }, [])

  const applyPreset = useCallback((presetOrId) => {
    const preset =
      typeof presetOrId === 'string'
        ? [...PRESETS, RESET_PRESET].find((item) => item.id === presetOrId)
        : presetOrId
    if (!preset) return
    setVars({ ...DEFAULT_VARS, ...preset.values })
    setActivePreset(preset.id === 'reset' ? null : preset.id)
  }, [])

  const resetDefaults = useCallback(() => {
    setVars({ ...DEFAULT_VARS })
    setActivePreset(null)
  }, [])

  const replaceVars = useCallback((next) => {
    setVars(sanitizeVars(next))
    setActivePreset(null)
  }, [])

  const interpolate = useCallback((text) => interpolateVars(text, vars), [vars])

  const value = useMemo(
    () => ({
      vars,
      setVar,
      applyPreset,
      resetDefaults,
      replaceVars,
      interpolate,
      activePreset,
      defaults: DEFAULT_VARS,
      presets: PRESETS,
    }),
    [vars, setVar, applyPreset, resetDefaults, replaceVars, interpolate, activePreset],
  )

  return <ExamVarsContext.Provider value={value}>{children}</ExamVarsContext.Provider>
}

export function useExamVars() {
  const context = useContext(ExamVarsContext)
  if (!context) {
    throw new Error('useExamVars must be used inside an ExamVarsProvider')
  }
  return context
}
