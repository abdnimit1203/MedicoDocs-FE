'use client'

import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { LogIn, LogOut, Plus } from 'lucide-react'

interface NavbarProps {
  onOpenCreateModal: () => void
  isNavigating?: boolean
}

export function Navbar({ onOpenCreateModal, isNavigating }: NavbarProps) {
  const { user, loading, loginWithGoogle, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#17201D] shadow-xs">
      {/* Navigation progress bar */}
      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8F1D2C] via-[#741522] to-[#20A878] animate-pulse" />
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Branding & Logo — Logo preserved exactly */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 relative rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="MedicoDocs by AB Logo"
              width={40}
              height={40}
              className="object-contain hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-none flex items-center gap-1">
              <span className="text-[#17201D]">Medico</span>
              <span className="text-[#8F1D2C]">Docs</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F8E9EC] text-[#8F1D2C] border border-[#8F1D2C]/20 tracking-normal shrink-0">
                by AB
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-[#68736F] font-medium leading-tight mt-0.5 truncate">
              Your health. Organized. Secure.
            </p>
          </div>
        </div>

        {/* User Auth Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {user ? (
            <>
              <button
                onClick={onOpenCreateModal}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs rounded-full shadow-xs transition-all hover:shadow shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Add Record</span>
                <span className="xs:hidden">Add</span>
              </button>

              <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F8E9EC] border border-[#8F1D2C]/30 text-xs flex items-center justify-center font-bold text-[#8F1D2C] shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            !loading && (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#17201D] hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-xs transition-all hover:scale-105 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-[#20A878]" />
                <span className="whitespace-nowrap">Sign in</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
