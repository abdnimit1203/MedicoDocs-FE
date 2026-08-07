'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import {
  ShieldCheck,
  FileText,
  LogIn,
  Users,
  UserPlus,
  ArrowRight,
  Loader2,
  LayoutDashboard,
} from 'lucide-react'

export default function Home() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8F1D2C]" />
        <p className="text-xs font-semibold text-[#68736F]">Initializing MedicoDocs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#17201D] font-sans pb-16 w-full max-w-full overflow-x-hidden">
      <Navbar onOpenCreateModal={() => router.push('/dashboard')} />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 space-y-4 w-full min-w-0">
        {user ? (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-extrabold text-[#17201D]">
              Welcome back, {user.displayName || user.email}!
            </h2>
            <p className="text-xs text-[#68736F]">
              Your medical records vault is ready.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-sm rounded-full shadow-xs transition-all hover:scale-105"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          </div>
        ) : (
          /* Public Unauthenticated Landing View */
          <div className="py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-xl mx-auto text-center px-1 w-full min-w-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="MedicoDocs Logo"
                  width={96}
                  height={96}
                  className="object-contain hover:scale-105 transition-transform"
                  priority
                />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17201D]">
                  Medico<span className="text-[#8F1D2C]">Docs</span>{' '}
                  <span className="text-xs sm:text-sm font-bold text-[#68736F]">by AB</span>
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#68736F] mt-1 px-2">
                  Your health. Organized. Secure. Always with you.
                </p>
              </div>

              {/* Authentication Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 max-w-md mx-auto w-full">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all hover:scale-105"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-[#17201D] font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all"
                >
                  <LogIn className="w-4 h-4 text-[#8F1D2C]" />
                  <span>Sign In</span>
                </Link>
              </div>

              <div className="pt-1">
                <button
                  onClick={loginWithGoogle}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#17201D] hover:text-[#8F1D2C] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#20A878]" />
                  <span>Or continue with Google Sign-In</span>
                  <ArrowRight className="w-3 h-3 text-[#8F1D2C]" />
                </button>
              </div>
            </div>

            {/* 3 Core Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left w-full min-w-0">
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-[#8F1D2C]/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-[#17201D]">Medical Records</h3>
                <p className="text-[11px] text-[#68736F] leading-snug">
                  All your prescriptions and reports in one place.
                </p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-[#20A878]/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#E8F7F0] text-[#20A878] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-[#17201D]">Secure & Private</h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Your data is encrypted and always protected.
                </p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-[#8F1D2C]/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-[#17201D]">For You & Family</h3>
                <p className="text-[11px] text-[#68736F] leading-snug">
                  Manage your health and your loved ones.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
