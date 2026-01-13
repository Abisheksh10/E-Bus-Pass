import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data?.user || null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshMe()
  }, [refreshMe])

  async function signup({ username, email, password }) {
    await api.post('/auth/register', { username, email, password })
    // typical UX: go to login after signup; we keep user null until they log in
  }

  async function login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password })
    // backend sets httpOnly cookie; update local user based on /auth/me for source of truth
    await refreshMe()
    return data
  }

  async function adminLogin({ mail, password }) {
    const { data } = await api.post('/auth/admin/login', { mail, password })
    await refreshMe()
    return data
  }

  async function logout() {
    await api.post('/auth/logout')
    setUser(null)
  }

  const value = { user, loading, signup, login, adminLogin, logout, refreshMe }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
