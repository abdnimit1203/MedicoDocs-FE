'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LogIn, LogOut, Plus, FileText, Pill, Clock } from 'lucide-react'

interface NavbarProps {
  onOpenCreateModal?: () => void
  isNavigating?: boolean
  activeTab?: 'all' | 'prescriptions' | 'timeline'
  onTabChange?: (tab: 'all' | 'prescriptions' | 'timeline') => void
}

export function Navbar({
  onOpenCreateModal,
  isNavigating,
  activeTab = 'all',
  onTabChange,
}: NavbarProps) {
  const { user, loading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#17201D] shadow-xs">
      {/* Progress Bar */}
      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8F1D2C] via-[#741522] to-[#20A878] animate-pulse" />
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo — Logo preserved exactly */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 sm:gap-3 min-w-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 relative rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="MedicoDocs by AB Logo"
              width={40}
              height={40}
              className="object-contain group-hover:scale-105 transition-transform"
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
        </Link>

        {/* Authenticated Dashboard Navigation Tabs (Desktop / Tablet) */}
        {user && onTabChange && (
          <nav className="hidden md:flex items-center gap-1 bg-[#F8F9F7] p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onTabChange('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#8F1D2C] text-white shadow-xs'
                  : 'text-[#68736F] hover:text-[#17201D]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Records</span>
            </button>

            <button
              onClick={() => onTabChange('prescriptions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'prescriptions'
                  ? 'bg-[#8F1D2C] text-white shadow-xs'
                  : 'text-[#68736F] hover:text-[#17201D]'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Prescriptions</span>
            </button>

            <button
              onClick={() => onTabChange('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-[#8F1D2C] text-white shadow-xs'
                  : 'text-[#68736F] hover:text-[#17201D]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {user ? (
            <>
              {onOpenCreateModal && (
                <button
                  onClick={onOpenCreateModal}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs rounded-full shadow-xs transition-all shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Add Record</span>
                  <span className="xs:hidden">Add</span>
                </button>
              )}

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
                  className="p-1 sm:p-1.5 text-[#68736F] hover:text-rose-600 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            !loading && (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#8F1D2C] hover:bg-[#741522] text-white text-xs font-bold rounded-full shadow-xs transition-all hover:scale-105 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-white" />
                <span>Sign In</span>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
