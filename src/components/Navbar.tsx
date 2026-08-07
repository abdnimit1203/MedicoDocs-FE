'use client'

import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { LogIn, LogOut, Plus, ShieldCheck } from 'lucide-react'

interface NavbarProps {
  onOpenCreateModal: () => void
  isNavigating?: boolean
}

export function Navbar({ onOpenCreateModal, isNavigating }: NavbarProps) {
  const { user, loading, loginWithGoogle, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Thin navigation progress indicator line */}
      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 animate-pulse" />
      )}

      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Branding & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 relative rounded-lg overflow-hidden border border-teal-500/30 bg-slate-800 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="MedicoDocs Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none text-white flex items-center gap-1.5">
              MedicoDocs
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                by AB
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 leading-tight">
              Personal Medical Vault
            </p>
          </div>
        </div>

        {/* User Auth Controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={onOpenCreateModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-full shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>

              <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-xs flex items-center justify-center font-bold text-teal-400">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            !loading && (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-medium rounded-full transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-400" />
                <span>Sign in with Google</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
