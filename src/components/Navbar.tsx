'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LogIn, LogOut, Plus, FileText, Pill, Stethoscope, Activity, User } from 'lucide-react'

export type NavTab = 'overview' | 'visits' | 'prescriptions' | 'test_reports' | 'profile'

interface NavbarProps {
  onOpenCreateModal?: () => void
  isNavigating?: boolean
  activeTab?: NavTab
  onTabChange?: (tab: NavTab) => void
}

export function Navbar({
  onOpenCreateModal,
  isNavigating,
  activeTab = 'overview',
  onTabChange,
}: NavbarProps) {
  const { user, loading, logout } = useAuth()

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#17201D] shadow-xs">
        {/* Progress Bar */}
        {isNavigating && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8F1D2C] via-[#3B988E] to-[#20A878] animate-pulse" />
        )}

        <div className="max-w-5xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 sm:gap-3 min-w-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 relative rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="MedicoDocs Logo"
                width={40}
                height={40}
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-none flex items-center gap-1">
                <span className="text-[#8F1D2C]">Medico</span>
                <span className="text-[#3B988E]">Docs</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E6F4F2] text-[#3B988E] border border-[#3B988E]/20 tracking-normal shrink-0">
                  by AB
                </span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-[#68736F] font-medium leading-tight mt-0.5 truncate">
                Your health. Organized. Secure.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          {user && onTabChange && (
            <nav className="hidden md:flex items-center gap-1 bg-[#F8F9F7] p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onTabChange('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'text-[#68736F] hover:text-[#17201D]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => onTabChange('visits')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'visits'
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'text-[#68736F] hover:text-[#17201D]'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Visits</span>
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
                onClick={() => onTabChange('test_reports')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'test_reports'
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'text-[#68736F] hover:text-[#17201D]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Test Reports</span>
              </button>

              <button
                onClick={() => onTabChange('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'text-[#68736F] hover:text-[#17201D]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                {/* Desktop + Add Record button (Hidden on Mobile) */}
                {onOpenCreateModal && (
                  <button
                    onClick={onOpenCreateModal}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs rounded-full shadow-xs transition-all hover:scale-105 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Record</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  <button
                    onClick={() => onTabChange && onTabChange('profile')}
                    className="focus:outline-none"
                    title="View Profile"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full border border-slate-300 object-cover shrink-0 hover:border-[#8F1D2C] transition-colors"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#F8E9EC] border border-[#8F1D2C]/30 text-xs flex items-center justify-center font-bold text-[#8F1D2C] shrink-0 hover:bg-[#8F1D2C] hover:text-white transition-colors">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1.5 text-[#68736F] hover:text-rose-600 transition-colors shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              !loading && (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#8F1D2C] hover:bg-[#741522] text-white text-xs font-bold rounded-full shadow-xs transition-all hover:scale-105 shrink-0"
                  >
                    <span>Sign In</span>
                  </Link>

                  <Link
                    href="/register"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-[#3B988E] hover:bg-[#3B988E]/10 text-[#3B988E] text-xs font-bold rounded-full transition-all shrink-0"
                  >
                    <span>Get Started</span>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      {/* Separate Floating Action Button (FAB) for Mobile & Quick Access */}
      {user && onOpenCreateModal && (
        <button
          type="button"
          onClick={onOpenCreateModal}
          aria-label="Add Health Record"
          title="Add Health Record"
          className="fixed bottom-[4.5rem] sm:bottom-20 right-5 sm:right-6 z-50 w-15 h-15 sm:w-16 sm:h-16 p-3.5 sm:p-4 rounded-full bg-[#8F1D2C] hover:bg-[#741522] text-white flex items-center justify-center shadow-xl shadow-[#8F1D2C]/35 hover:shadow-2xl hover:shadow-[#8F1D2C]/45 ring-4 ring-[#8F1D2C]/20 hover:ring-[#8F1D2C]/35 transition-all duration-200 hover:scale-105 active:scale-95 group"
        >
          <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.5] group-hover:rotate-90 transition-transform duration-200 shrink-0" />
        </button>
      )}

      {/* Fixed Bottom Navigation Bar for Mobile Devices */}
      {user && onTabChange && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 shadow-lg flex items-center justify-around max-w-5xl mx-auto">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'overview'
                ? 'text-[#8F1D2C]'
                : 'text-[#68736F] hover:text-[#17201D]'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#8F1D2C]' : 'text-slate-400'}`} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onTabChange('visits')}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'visits'
                ? 'text-[#8F1D2C]'
                : 'text-[#68736F] hover:text-[#17201D]'
            }`}
          >
            <Stethoscope className={`w-4 h-4 ${activeTab === 'visits' ? 'text-[#8F1D2C]' : 'text-slate-400'}`} />
            <span>Visits</span>
          </button>

          <button
            onClick={() => onTabChange('prescriptions')}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'prescriptions'
                ? 'text-[#8F1D2C]'
                : 'text-[#68736F] hover:text-[#17201D]'
            }`}
          >
            <Pill className={`w-4 h-4 ${activeTab === 'prescriptions' ? 'text-[#8F1D2C]' : 'text-slate-400'}`} />
            <span>Prescriptions</span>
          </button>

          <button
            onClick={() => onTabChange('test_reports')}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'test_reports'
                ? 'text-[#8F1D2C]'
                : 'text-[#68736F] hover:text-[#17201D]'
            }`}
          >
            <Activity className={`w-4 h-4 ${activeTab === 'test_reports' ? 'text-[#8F1D2C]' : 'text-slate-400'}`} />
            <span>Test Reports</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'profile'
                ? 'text-[#8F1D2C]'
                : 'text-[#68736F] hover:text-[#17201D]'
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-[#8F1D2C]' : 'text-slate-400'}`} />
            <span>Profile</span>
          </button>
        </nav>
      )}
    </>
  )
}
