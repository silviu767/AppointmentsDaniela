/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { getCurrentUser, loginUser, registerUser } from '../api/client'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone?: string
  }) => Promise<User>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'dn_auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    let cancelled = false
    async function verifySession() {
      if (!token) {
        await Promise.resolve()
        if (!cancelled) {
          setUser(null)
          setLoading(false)
        }
        return
      }
      try {
        const u = await getCurrentUser(token)
        if (!cancelled) setUser(u)
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void verifySession()
    return () => {
      cancelled = true
    }
  }, [token])

  const login = async (email: string, password: string): Promise<User> => {
    const res = await loginUser(email, password)
    localStorage.setItem(TOKEN_KEY, res.access_token)
    setToken(res.access_token)
    const u = await getCurrentUser(res.access_token)
    setUser(u)
    return u
  }

  const register = async (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone?: string
  }): Promise<User> => {
    await registerUser(data)
    return login(data.email, data.password)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    if (!token) return
    const u = await getCurrentUser(token)
    setUser(u)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
