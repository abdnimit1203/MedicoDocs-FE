'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchWithAuth, IMedicalRecord } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { RecordCard } from '@/components/RecordCard'
import { RecordModal } from '@/components/RecordModal'
import { MedicalTimeline } from '@/components/MedicalTimeline'
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Loader2,
  FileText,
  LogIn,
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
      // Update existing record
      await fetchWithAuth(`/records/${recordData._id}`, token, {
        method: 'PUT',
        body: JSON.stringify(recordData),
      })
    } else {
      // Create new record
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <Navbar
        onOpenCreateModal={() => {
          setActiveRecord(null)
          setIsModalOpen(true)
        }}
        isNavigating={loadingRecords}
      />

      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {!user && !authLoading ? (
          /* Unauthenticated Landing / Sign-In State */
          <div className="py-16 text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-900 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/5">
              <ShieldCheck className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Secure Personal Medical Records
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Store, search, and visually track medical visits and prescriptions for your entire family.
              </p>
            </div>

            <button
              onClick={loginWithGoogle}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-full shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Search & Filter Bar */}
            <div className="space-y-2.5">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search doctor, patient, medicine, specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 shadow-sm"
                  />
                </div>

                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                    showTimeline
                      ? 'bg-teal-500/10 text-teal-300 border-teal-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Timeline</span>
                </button>
              </div>

              {/* Family Member Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[11px] font-semibold text-slate-500 shrink-0 pr-1">
                  Member:
                </span>
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setSelectedRelationship(rel)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 border ${
                      selectedRelationship === rel
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[11px] font-semibold text-slate-500 shrink-0 pr-1">
                  Category:
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all shrink-0 border ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-teal-300 border-teal-500/40'
                        : 'bg-slate-950 text-slate-500 border-slate-800/80 hover:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Timeline View (Milestone 6) */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-28 bg-slate-900/40 border border-slate-800/60 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : records.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="py-12 text-center bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 space-y-3">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-300">
                  No medical records found
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click the button below to record your first doctor visit or upload a prescription photo.
                </p>
                <button
                  onClick={() => {
                    setActiveRecord(null)
                    setIsModalOpen(true)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-full transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Record</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Record Create / Edit Modal (Milestones 4, 5, 7) */}
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
