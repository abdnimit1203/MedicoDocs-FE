'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { fetchWithAuth } from '@/lib/api'

export interface IDbUser {
  _id: string
  firebaseUid: string
  email: string
  displayName: string
  photoURL: string
  provider: string
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  dbUser: IDbUser | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, pass: string) => Promise<void>
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  getToken: async () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<IDbUser | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUserWithBackend = async (currentUser: User, extraInfo?: { displayName?: string; provider?: string }) => {
    try {
      const token = await currentUser.getIdToken()
      const syncRes = await fetchWithAuth('/auth/sync', token, {
        method: 'POST',
        body: JSON.stringify({
          displayName: extraInfo?.displayName || currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
          provider: extraInfo?.provider || currentUser.providerData[0]?.providerId || 'password',
        }),
      })

      if (syncRes.success && syncRes.data) {
        setDbUser(syncRes.data)
      }
    } catch (err) {
      console.warn('Backend user sync error:', err)
    }
  }

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Firebase persistence warning:', err)
    })

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await syncUserWithBackend(currentUser)
      } else {
        setDbUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      if (cred.user) {
        await syncUserWithBackend(cred.user, { provider: 'google.com' })
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err)
      throw err
    }
  }

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass)
      if (cred.user) {
        await syncUserWithBackend(cred.user, { provider: 'password' })
      }
    } catch (err) {
      console.error('Email Login Error:', err)
      throw err
    }
  }

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass)
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name })
        await syncUserWithBackend(cred.user, { displayName: name, provider: 'password' })
      }
    } catch (err) {
      console.error('Email Register Error:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setDbUser(null)
    } catch (err) {
      console.error('Logout Error:', err)
    }
  }

  const getToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null
    try {
      return await auth.currentUser.getIdToken()
    } catch (err) {
      console.error('Error getting ID token:', err)
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
