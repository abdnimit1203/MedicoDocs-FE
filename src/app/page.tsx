'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { fetchWithAuth, IMedicalRecord } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { RecordCard } from '@/components/RecordCard'
import { RecordModal } from '@/components/RecordModal'
import { MedicalTimeline } from '@/components/MedicalTimeline'
import {
  Search,
  Plus,
  Calendar,
  ShieldCheck,
  FileText,
  LogIn,
  Users,
  Clock,
  Pill,
  Bot,
  Loader2,
} from 'lucide-react'

const RELATIONSHIPS = ['All', 'Self', 'Father', 'Mother', 'Wife', 'Child', 'Sibling', 'Other']
const CATEGORIES = ['All', 'General', 'Disease', 'Condition', 'Specialty']

export default function Home() {
  const { user, loading: authLoading, loginWithGoogle, getToken } = useAuth()

  const [records, setRecords] = useState<IMedicalRecord[]>([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRelationship, setSelectedRelationship] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'all' | 'prescriptions' | 'timeline'>('all')
  const [showTimeline, setShowTimeline] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeRecord, setActiveRecord] = useState<IMedicalRecord | null>(null)

  const loadRecords = useCallback(async () => {
    if (!user) return
    setLoadingRecords(true)

    try {
      const token = await getToken()
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      if (selectedRelationship !== 'All') params.append('relationship', selectedRelationship)
      if (selectedCategory !== 'All') params.append('category', selectedCategory)

      const endpoint = `/records?${params.toString()}`
      const response = await fetchWithAuth(endpoint, token)

      if (response.success) {
        setRecords(response.data || [])
      }
    } catch (err) {
      console.error('Error fetching records:', err)
    } finally {
      setLoadingRecords(false)
    }
  }, [user, getToken, searchQuery, selectedRelationship, selectedCategory])

  useEffect(() => {
    if (user) {
      loadRecords()
    } else {
      setRecords([])
    }
  }, [user, loadRecords])

  const handleSaveRecord = async (recordData: Partial<IMedicalRecord>) => {
    const token = await getToken()
    if (recordData._id) {
      await fetchWithAuth(`/records/${recordData._id}`, token, {
        method: 'PUT',
        body: JSON.stringify(recordData),
      })
    } else {
      await fetchWithAuth('/records', token, {
        method: 'POST',
        body: JSON.stringify(recordData),
      })
    }
    await loadRecords()
  }

  const handleDeleteRecord = async (id: string) => {
    const token = await getToken()
    await fetchWithAuth(`/records/${id}`, token, {
      method: 'DELETE',
    })
    await loadRecords()
  }

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#17201D] font-sans pb-16 w-full max-w-full overflow-x-hidden">
      <Navbar
        onOpenCreateModal={() => {
          setActiveRecord(null)
          setIsModalOpen(true)
        }}
        isNavigating={loadingRecords}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 space-y-3.5 sm:space-y-4 w-full min-w-0">
        {authLoading ? (
          /* Loading Auth State */
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#8F1D2C]" />
            <p className="text-xs font-semibold text-[#68736F]">Initializing MedicoDocs...</p>
          </div>
        ) : !user ? (
          /* Unauthenticated Landing View — Exact Logo & Medical Red Accent */
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

              <button
                onClick={loginWithGoogle}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#17201D] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all hover:scale-105"
              >
                <LogIn className="w-4 h-4 text-[#20A878]" />
                <span>Sign in with Google</span>
              </button>
            </div>

            {/* 3 Core Feature Cards with Medical Red & Medical Green highlights */}
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
                <p className="text-[11px] text-[#68736F] leading-snug">
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
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Quick Feature Bar */}
            <div className="bg-white p-1 sm:p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar w-full min-w-0">
              <button
                onClick={() => {
                  setActiveTab('all')
                  setShowTimeline(false)
                }}
                className={`flex-1 min-w-[90px] sm:min-w-[100px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'all' && !showTimeline
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'text-[#68736F] hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>All Records</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('prescriptions')
                  setShowTimeline(false)
                }}
                className={`flex-1 min-w-[100px] sm:min-w-[110px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'prescriptions' && !showTimeline
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'text-[#68736F] hover:bg-slate-50'
                }`}
              >
                <Pill className="w-3.5 h-3.5 shrink-0" />
                <span>Prescriptions</span>
              </button>

              <button
                onClick={() => {
                  setShowTimeline(true)
                  setActiveTab('timeline')
                }}
                className={`flex-1 min-w-[90px] sm:min-w-[100px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  showTimeline
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'text-[#68736F] hover:bg-slate-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Timeline</span>
              </button>

              <button
                disabled
                title="AI Assistant coming soon"
                className="flex-1 min-w-[100px] sm:min-w-[110px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed shrink-0"
              >
                <Bot className="w-3.5 h-3.5 shrink-0" />
                <span>AI Assistant</span>
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="space-y-2 sm:space-y-2.5 w-full min-w-0">
              <div className="relative flex items-center gap-2 w-full min-w-0">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search doctor, patient, medicine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-w-0 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C] shadow-xs transition-colors"
                  />
                </div>

                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                    showTimeline
                      ? 'bg-[#F8E9EC] text-[#8F1D2C] border-[#8F1D2C]/30 shadow-xs'
                      : 'bg-white text-[#68736F] border-slate-200 hover:text-[#17201D] shadow-xs'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">Timeline</span>
                </button>
              </div>

              {/* Family Member Filter Pills — Bounded Horizontal Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full min-w-0">
                <span className="text-[11px] font-bold text-[#68736F] shrink-0 pr-1">
                  Member:
                </span>
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setSelectedRelationship(rel)}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 border ${
                      selectedRelationship === rel
                        ? 'bg-[#8F1D2C] text-white border-[#8F1D2C] shadow-xs font-bold'
                        : 'bg-white text-[#68736F] border-slate-200 hover:text-[#17201D]'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>

              {/* Category Filter Pills — Bounded Horizontal Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full min-w-0">
                <span className="text-[11px] font-bold text-[#68736F] shrink-0 pr-1">
                  Category:
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 sm:px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all shrink-0 border ${
                      selectedCategory === cat
                        ? 'bg-slate-200 text-[#17201D] border-slate-300 font-bold'
                        : 'bg-white text-[#68736F] border-slate-200 hover:text-[#17201D]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Timeline View */}
            {showTimeline && (
              <MedicalTimeline
                records={records}
                onSelectRecord={(rec) => {
                  setActiveRecord(rec)
                  setIsModalOpen(true)
                }}
              />
            )}

            {/* Records List / Grid */}
            {loadingRecords ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-28 bg-white border border-slate-200 rounded-xl animate-pulse w-full"
                  />
                ))}
              </div>
            ) : records.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {records.map((rec) => (
                  <RecordCard
                    key={rec._id}
                    record={rec}
                    onClick={(r) => {
                      setActiveRecord(r)
                      setIsModalOpen(true)
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-10 sm:py-12 text-center bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-3 shadow-xs w-full">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-[#17201D]">
                  No medical records found
                </h3>
                <p className="text-xs text-[#68736F] max-w-xs mx-auto">
                  Click the button below to record your first doctor visit or upload a prescription photo.
                </p>
                <button
                  onClick={() => {
                    setActiveRecord(null)
                    setIsModalOpen(true)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs rounded-full transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Record</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Record Create / Edit Modal */}
      <RecordModal
        isOpen={isModalOpen}
        record={activeRecord}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        onDelete={handleDeleteRecord}
      />
    </div>
  )
}
