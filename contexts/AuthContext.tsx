"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type AuthRole = "USER" | "HOST" | "ADMIN"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: AuthRole
  roles: AuthRole[]
  phone?: string
  businessName?: string
}

interface SignupPayload {
  name: string
  email: string
  phone: string
  password: string
  accountType: Extract<AuthRole, "USER" | "HOST">
  businessName?: string
}

interface BecomeHostPayload {
  businessName: string
  phone?: string
}

interface StoredAccount extends AuthUser {
  password: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string, role: AuthRole) => Promise<AuthUser>
  signup: (payload: SignupPayload) => Promise<AuthUser>
  becomeHost: (payload: BecomeHostPayload) => AuthUser
  logout: () => void
  isAuthenticated: boolean
  isHost: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const SESSION_KEY = "user"
const ACCOUNTS_KEY = "registeredUsers"

function getBootstrapAccounts(): StoredAccount[] {
  return [
    hydrateAccount({
      id: "admin-gethotels-demo",
      email: "admin@gethotels.com",
      name: "GetHotels Admin",
      password: "Admin@123",
      role: "ADMIN",
      roles: ["ADMIN"],
    }),
  ]
}

function normalizeRoles(roles?: AuthRole[], role?: AuthRole) {
  const nextRoles = new Set<AuthRole>(roles ?? [])

  if (role) {
    nextRoles.add(role)
  }

  if (nextRoles.has("HOST")) {
    nextRoles.add("USER")
  }

  if (nextRoles.size === 0) {
    nextRoles.add("USER")
  }

  return Array.from(nextRoles)
}

function sanitizeUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    roles: normalizeRoles(account.roles, account.role),
    phone: account.phone,
    businessName: account.businessName,
  }
}

function createAuthUserFromApiUser(apiUser: {
  id: number | string
  email: string
  name: string
  role: "USER" | "ADMIN"
  phone?: string | null
  businessName?: string | null
  isHost: boolean
}) {
  const primaryRole: AuthRole = apiUser.isHost ? "HOST" : apiUser.role
  const roles = normalizeRoles(
    apiUser.isHost ? ["USER", "HOST"] : [apiUser.role],
    primaryRole,
  )

  return sanitizeUser(
    hydrateAccount({
      id: String(apiUser.id),
      email: apiUser.email,
      name: apiUser.name,
      role: primaryRole,
      roles,
      phone: apiUser.phone ?? undefined,
      businessName: apiUser.businessName ?? undefined,
    }),
  )
}

function hydrateAccount(raw: Partial<StoredAccount>): StoredAccount {
  const roles = normalizeRoles(raw.roles, raw.role)
  const preferredRole = raw.role && roles.includes(raw.role) ? raw.role : roles[0]

  return {
    id: raw.id ?? crypto.randomUUID(),
    email: raw.email ?? "",
    name: raw.name ?? raw.email?.split("@")[0] ?? "Guest",
    role: preferredRole,
    roles,
    phone: raw.phone,
    businessName: raw.businessName,
    password: raw.password ?? "",
  }
}

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") {
    return []
  }

  const bootstrapAccounts = getBootstrapAccounts()
  const storedAccounts = localStorage.getItem(ACCOUNTS_KEY)
  if (!storedAccounts) {
    writeAccounts(bootstrapAccounts)
    return bootstrapAccounts
  }

  try {
    const parsedAccounts = JSON.parse(storedAccounts) as Partial<StoredAccount>[]
    const hydratedAccounts = parsedAccounts.map(hydrateAccount)
    const mergedAccounts = [...hydratedAccounts]

    for (const bootstrapAccount of bootstrapAccounts) {
      if (!mergedAccounts.some(account => account.email.toLowerCase() === bootstrapAccount.email.toLowerCase())) {
        mergedAccounts.push(bootstrapAccount)
      }
    }

    if (mergedAccounts.length !== hydratedAccounts.length) {
      writeAccounts(mergedAccounts)
    }

    return mergedAccounts
  } catch (error) {
    console.error("Failed to parse stored accounts:", error)
    localStorage.removeItem(ACCOUNTS_KEY)
    writeAccounts(bootstrapAccounts)
    return bootstrapAccounts
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function persistSession(nextUser: AuthUser | null, setUser: (user: AuthUser | null) => void) {
  setUser(nextUser)

  if (nextUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    return
  }

  localStorage.removeItem(SESSION_KEY)
}

function loginFromLocalAccount(email: string, password: string, role: AuthRole) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = readAccounts()
  const existingAccount = accounts.find(account => account.email.toLowerCase() === normalizedEmail)

  if (!existingAccount) {
    throw new Error(role === "ADMIN" ? "Admin account not found" : "Account not found. Please sign up first")
  }

  if (existingAccount.password !== password) {
    throw new Error("Incorrect email or password")
  }

  const roles = normalizeRoles(existingAccount.roles, existingAccount.role)
  if (!roles.includes(role)) {
    throw new Error(
      role === "HOST"
        ? "This account does not have host access yet"
        : role === "ADMIN"
          ? "This account is not authorized for admin access"
          : "This account cannot use that login mode"
    )
  }

  const nextAccount = hydrateAccount({ ...existingAccount, role, roles })
  const nextAccounts = accounts.map(account => (account.id === nextAccount.id ? nextAccount : account))
  writeAccounts(nextAccounts)
  return sanitizeUser(nextAccount)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const hydrateSession = async () => {
      const storedUser = localStorage.getItem(SESSION_KEY)

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as Partial<AuthUser>
          const hydratedUser = sanitizeUser(hydrateAccount(parsedUser))
          if (!cancelled) {
            setUser(hydratedUser)
          }
          localStorage.setItem(SESSION_KEY, JSON.stringify(hydratedUser))
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          localStorage.removeItem(SESSION_KEY)
        }
      }

      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("No active server session")
        }

        const payload = await response.json()
        const nextUser = createAuthUserFromApiUser(payload.user)
        if (!cancelled) {
          persistSession(nextUser, setUser)
        }
      } catch {
        if (!storedUser && !cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void hydrateSession()

    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string, role: AuthRole) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to login. Please try again.")
      }

      const nextUser = createAuthUserFromApiUser(payload.user)
      const allowedRoles = normalizeRoles(nextUser.roles, nextUser.role)

      if (!allowedRoles.includes(role)) {
        throw new Error(
          role === "HOST"
            ? "This account does not have host access yet"
            : role === "ADMIN"
              ? "This account is not authorized for admin access"
              : "This account cannot use that login mode"
        )
      }

      persistSession(nextUser, setUser)
      return nextUser
    } catch (error) {
      if (error instanceof Error && !/Failed to fetch|NetworkError|Load failed/i.test(error.message)) {
        throw error
      }

      const nextUser = loginFromLocalAccount(email, password, role)
      persistSession(nextUser, setUser)
      return nextUser
    }
  }

  const signup = async ({ name, email, phone, password, accountType, businessName }: SignupPayload) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        role: accountType === "HOST" ? "host" : "user",
        businessName: accountType === "HOST" ? businessName?.trim() : undefined,
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to create account. Please try again.")
    }

    const nextUser = createAuthUserFromApiUser(payload.user)
    const fallbackAccount = hydrateAccount({
      id: nextUser.id,
      email: nextUser.email,
      name: nextUser.name,
      password,
      role: nextUser.role,
      roles: nextUser.roles,
      phone: nextUser.phone,
      businessName: nextUser.businessName,
    })
    const accounts = readAccounts()
    const nextAccounts = [
      ...accounts.filter(account => account.email.toLowerCase() !== fallbackAccount.email.toLowerCase()),
      fallbackAccount,
    ]
    writeAccounts(nextAccounts)
    persistSession(nextUser, setUser)
    return nextUser
  }

  const becomeHost = ({ businessName, phone }: BecomeHostPayload) => {
    if (!user) {
      throw new Error("Please log in to activate host access")
    }

    const accounts = readAccounts()
    const existingAccount = accounts.find(account => account.id === user.id || account.email.toLowerCase() === user.email.toLowerCase())
    const nextAccount = hydrateAccount({
      ...(existingAccount ?? user),
      password: existingAccount?.password ?? "",
      role: "HOST",
      roles: normalizeRoles([...(existingAccount?.roles ?? user.roles), "HOST"], "HOST"),
      businessName: businessName.trim(),
      phone: phone?.trim() || existingAccount?.phone || user.phone,
    })

    const nextAccounts = existingAccount
      ? accounts.map(account => (account.id === existingAccount.id ? nextAccount : account))
      : [...accounts, nextAccount]

    writeAccounts(nextAccounts)
    const nextUser = sanitizeUser(nextAccount)
    persistSession(nextUser, setUser)
    return nextUser
  }

  const logout = () => {
    void fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined)

    persistSession(null, setUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        becomeHost,
        logout,
        isAuthenticated: !!user,
        isHost: !!user?.roles.includes("HOST"),
        isAdmin: !!user?.roles.includes("ADMIN"),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
