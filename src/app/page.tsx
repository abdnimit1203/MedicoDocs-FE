'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  ShieldCheck,
  FileText,
  Users,
  Clock,
  LogIn,
  UserPlus,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

export default function Home() {
  const { user, authInitializing } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !authInitializing) {
      router.replace('/dashboard')
    }
  }, [user, authInitializing, router])

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#17201D] font-sans flex flex-col justify-between w-full max-w-full overflow-x-hidden relative">
      {/* Background Soft Radial Glow Orbs */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 relative z-10">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 space-y-10 sm:space-y-14 w-full min-w-0">
          {/* Hero Showcase Section */}
          <section className="space-y-6 text-center">
            {/* 3D Floating Dashboard Frame Showcase */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-r from-rose-400/20 via-slate-100 to-teal-400/20 rounded-3xl blur-xl opacity-70" />
              <div className="relative bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden text-left p-3 sm:p-5 space-y-3">
                {/* Browser Frame Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-[#68736F]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-slate-700 ml-1">MedicoDocs.ab</span>
                  </div>
                  <span className="font-bold text-[#8F1D2C] bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">Dashboard</span>
                </div>

                {/* Dashboard Showcase Content Mock */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#F8E9EC]/70 p-2.5 rounded-xl border border-[#8F1D2C]/15">
                    <span className="text-[10px] text-[#68736F] font-bold block">Total Prescriptions</span>
                    <span className="text-base font-extrabold text-[#8F1D2C]">28 Records</span>
                  </div>
                  <div className="bg-[#E6F4F2]/70 p-2.5 rounded-xl border border-[#3B988E]/15">
                    <span className="text-[10px] text-[#68736F] font-bold block">Family Profiles</span>
                    <span className="text-base font-extrabold text-[#3B988E]">5 Members</span>
                  </div>
                </div>

                {/* Recent Table Mock */}
                <div className="border border-slate-100 rounded-xl overflow-hidden text-[11px]">
                  <div className="bg-slate-50 p-2 font-bold text-[#68736F] border-b border-slate-100 flex justify-between">
                    <span>Prescriptions</span>
                    <span>Doctor / Date</span>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                    <div className="p-2 flex justify-between items-center">
                      <span className="font-semibold text-[#17201D]">General Routine Checkup</span>
                      <span className="text-slate-400">Dr. Jenkins • Jul 14</span>
                    </div>
                    <div className="p-2 flex justify-between items-center bg-slate-50/50">
                      <span className="font-semibold text-[#17201D]">CBC Lab Test Report</span>
                      <span className="text-slate-400">Quest Lab • Jun 28</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Main Copy */}
            <div className="max-w-xl mx-auto space-y-4 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-extrabold tracking-wider uppercase">
                <span className="text-[#8F1D2C]">MEDICO</span>
                <span className="text-[#3B988E]">DOCS</span>
                <span className="text-slate-500 font-bold">BY AB</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17201D] leading-tight">
                Organize Your Medical Records & <span className="text-[#8F1D2C]">Prescriptions</span>
              </h1>

              <p className="text-xs sm:text-sm font-medium text-[#68736F] max-w-md mx-auto leading-relaxed">
                A private medical vault for you and your family. Keep reports, doctor visit notes, and prescriptions organized in one timeline.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-row items-center justify-center gap-3 pt-2 max-w-sm mx-auto w-full">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Vault</span>
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white hover:bg-slate-50 border-2 border-[#3B988E] text-[#3B988E] font-bold text-xs sm:text-sm rounded-full transition-all hover:scale-105"
                >
                  <UserPlus className="w-4 h-4 text-[#3B988E]" />
                  <span>Create Account</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Trust & Proof Bar Section */}
          <section className="space-y-4 pt-2">
            {/* 3 Horizontal Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-semibold">
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>End-to-End Encryption</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 ml-1">
                  -65%
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-semibold">
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-[#3B988E] flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span>Multi-Profile Support</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-[#3B988E] ml-1">
                  +30%
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-semibold">
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-[#3B988E] flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>Timeline Visualization</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-[#3B988E] ml-1">
                  +30%
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#17201D]">
                Quick Trust & Proof Bar
              </h2>
              <p className="text-xs text-[#68736F]">
                Simple, secure, and accessible whenever you visit a doctor.
              </p>
            </div>
          </section>

          {/* 4 Feature Cards Vertical Stack */}
          <section className="space-y-4">
            {/* Card 1: Medical Records */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5 hover:border-[#8F1D2C]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center font-bold shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#17201D]">
                Medical Records
              </h3>
              <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed">
                Keep prescriptions, lab reports, and medical documents organized in one place.
              </p>
            </div>

            {/* Card 2: Secure & Private */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5 hover:border-[#3B988E]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F4F2] text-[#3B988E] flex items-center justify-center font-bold shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#17201D]">
                Secure & Private
              </h3>
              <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed">
                Your medical data is strictly isolated and encrypted per user account.
              </p>
            </div>

            {/* Card 3: For You & Family */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5 hover:border-[#8F1D2C]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center font-bold shadow-2xs">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#17201D]">
                For You & Family
              </h3>
              <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed">
                Manage health records for Self, Father, Mother, Wife, Husband, Child, and Sibling.
              </p>
            </div>

            {/* Card 4: Timeline & History with Overlapping Floating Calendar Widget */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5 hover:border-[#3B988E]/30 transition-all relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F4F2] text-[#3B988E] flex items-center justify-center font-bold shadow-2xs">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#17201D]">
                Timeline & History
              </h3>
              <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed max-w-sm">
                Quickly review visit history month-by-month and track health progress over time.
              </p>

              {/* Floating Mini Calendar Card Widget matching reference screenshot */}
              <div className="sm:absolute bottom-4 right-4 mt-4 sm:mt-0 bg-white border border-slate-200 rounded-2xl p-3 shadow-lg max-w-[210px] ml-auto text-[10px]">
                <div className="flex items-center justify-between font-bold text-[#17201D] mb-1.5 pb-1 border-b border-slate-100">
                  <span>Calendar 2026</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <ChevronLeft className="w-3 h-3" />
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-medium text-slate-400 text-[9px] mb-1">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-bold text-[#17201D] text-[10px]">
                  <span className="text-slate-300">28</span><span className="text-slate-300">29</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  <span>6</span><span>7</span><span>8</span><span className="w-5 h-5 rounded-full bg-[#8F1D2C] text-white flex items-center justify-center mx-auto">9</span><span>10</span><span>11</span><span>12</span>
                  <span>13</span><span>14</span><span className="w-5 h-5 rounded-full bg-[#E6F4F2] text-[#3B988E] flex items-center justify-center mx-auto">15</span><span>16</span><span>17</span><span>18</span><span>19</span>
                  <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Signature Footer */}
      <Footer />
    </div>
  )
}
