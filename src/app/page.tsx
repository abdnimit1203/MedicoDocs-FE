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
  Users,
  Clock,
  Loader2,
  LogIn,
  UserPlus,
} from 'lucide-react'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
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
        <p className="text-xs font-semibold text-[#68736F]">Loading MedicoDocs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#17201D] font-sans flex flex-col justify-between w-full max-w-full overflow-x-hidden">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-8 space-y-8 sm:space-y-12 w-full min-w-0">
          {/* Hero Section with Subtle Medical Red Stripe Pattern */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xs bg-medical-stripes">
            <div className="max-w-xl mx-auto space-y-4 sm:space-y-5 relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative mx-auto rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="MedicoDocs Logo"
                  width={96}
                  height={96}
                  className="object-contain hover:scale-105 transition-transform"
                  priority
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#3B988E]">
                  <span className="text-[#8F1D2C]">Medico</span>
                  <span className="text-[#3B988E]">Docs</span> by AB
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#17201D] leading-tight">
                  Organize Your Medical Records & Prescriptions
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#68736F] max-w-md mx-auto leading-relaxed">
                  A private medical vault for you and your family. Keep reports, doctor visit notes, and prescriptions organized in one timeline.
                </p>
              </div>

              {/* Primary Conversion CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-sm mx-auto w-full">
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Vault</span>
                </Link>

                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#17201D] font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all"
                >
                  <UserPlus className="w-4 h-4 text-[#8F1D2C]" />
                  <span>Create Account</span>
                </Link>
              </div>
            </div>
          </section>

          {/* 4 Product Explanation Feature Cards */}
          <section className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#17201D]">
                Built for Personal & Family Health
              </h2>
              <p className="text-xs text-[#68736F]">
                Simple, secure, and accessible whenever you visit a doctor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
              {/* Card 1 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-[#8F1D2C]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#17201D]">Medical Records</h3>
                <p className="text-xs text-[#68736F] leading-relaxed">
                  Keep prescriptions, lab reports, and medical documents organized in one place.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-[#3B988E]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F2] text-[#3B988E] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#17201D]">Secure & Private</h3>
                <p className="text-xs text-[#68736F] leading-relaxed">
                  Your medical data is strictly isolated and encrypted per user account.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-[#8F1D2C]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#17201D]">For You & Family</h3>
                <p className="text-xs text-[#68736F] leading-relaxed">
                  Manage health records for Self, Father, Mother, Wife, Child, and Sibling.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-[#3B988E]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F2] text-[#3B988E] flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#17201D]">Timeline & History</h3>
                <p className="text-xs text-[#68736F] leading-relaxed">
                  Quickly review visit history month-by-month and track health progress over time.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Clean Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 text-center text-xs text-[#68736F]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-[#17201D]">
            <span className="text-[#8F1D2C]">Medico</span><span className="text-[#3B988E]">Docs</span> <span className="text-xs font-normal text-[#68736F]">by AB</span>
          </p>
          <p>© {new Date().getFullYear()} MedicoDocs. Your health. Organized. Secure.</p>
        </div>
      </footer>
    </div>
  )
}
