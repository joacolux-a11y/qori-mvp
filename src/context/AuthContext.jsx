import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as api from '../lib/backend.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [progreso, setProgreso] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProgreso = useCallback(async (id) => {
    const uid = id || user?.id
    if (!uid) return
    setProgreso(await api.getProgreso(uid))
  }, [user])

  useEffect(() => {
    (async () => {
      const s = await api.getSession()
      setUser(s)
      if (s) setProgreso(await api.getProgreso(s.id))
      setLoading(false)
    })()
  }, [])

  const signUp = async (data) => {
    const u = await api.signUp(data)
    setUser(u)
    setProgreso(await api.getProgreso(u.id))
    return u
  }
  const signIn = async (data) => {
    const u = await api.signIn(data)
    setUser(u)
    setProgreso(await api.getProgreso(u.id))
    return u
  }
  const signOut = async () => {
    await api.signOut()
    setUser(null)
    setProgreso(null)
  }
  const updatePerfil = async (patch) => {
    const u = await api.updatePerfil(user.id, patch)
    setUser(u)
    return u
  }
  const actualizarPlan = async (plan) => {
    const u = await api.setPlan(user.id, plan)
    setUser(u)
    return u
  }

  return (
    <AuthCtx.Provider value={{ user, progreso, loading, signUp, signIn, signOut, updatePerfil, actualizarPlan, refreshProgreso, setUser }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
