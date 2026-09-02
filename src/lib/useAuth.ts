import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type AuthState = {
  session: Session | null
  loading: boolean
  email: string | null
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return 'Comptes non configurés sur ce déploiement.'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return 'Comptes non configurés sur ce déploiement.'
    const { error } = await supabase.auth.signUp({ email, password })
    return error?.message ?? null
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  return {
    session,
    loading,
    email: session?.user.email ?? null,
    signIn,
    signUp,
    signOut,
  }
}

/** Jeton à joindre aux appels de l'API : c'est lui que le serveur vérifie. */
export function bearer(session: Session | null): Record<string, string> {
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}
