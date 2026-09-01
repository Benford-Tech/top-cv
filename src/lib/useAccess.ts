import { useCallback, useEffect, useState } from 'react'
import type { PlanId } from '../data/plans'
import type { Access } from './access'
import { activate, clearAccess, isActive, loadAccess } from './access'

/**
 * Suit la location en cours et fait battre une horloge pendant qu'elle court,
 * pour que le compte à rebours et l'expiration soient visibles sans recharger.
 */
export function useAccess() {
  const [access, setAccess] = useState<Access | null>(() => loadAccess())
  const [now, setNow] = useState(() => Date.now())

  const active = isActive(access, now)

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [active])

  // Un onglet resté ouvert toute la nuit doit constater l'expiration au retour.
  useEffect(() => {
    const refresh = () => setNow(Date.now())
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const start = useCallback((planId: PlanId) => {
    setAccess((current) => activate(planId, current))
    setNow(Date.now())
  }, [])

  const stop = useCallback(() => {
    clearAccess()
    setAccess(null)
  }, [])

  return {
    access,
    isActive: active,
    remainingMs: access ? Math.max(0, access.expiresAt - now) : 0,
    start,
    stop,
  }
}
