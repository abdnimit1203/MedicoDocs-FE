'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
  FileText,
  Clock,
  Pill,
  Bot,
  Loader2,
  FolderPlus,
  AlertCircle,
} from 'lucide-react'

const RELATIONSHIPS = ['All', 'Self', 'Father', 'Mother', 'Wife', 'Child', 'Sibling', 'Other']
const CATEGORIES = ['All', 'General', 'Disease', 'Condition', 'Specialty']

export default function DashboardPage() {
  const { user, authInitializing, getToken, logout } = useAuth()
  const router = useRouter()

  const [records, setRecords] = useState<IMedicalRecord[]>([])
  const [initialFetchDone, setInitialFetchDone] = useState(false)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedRelationship, setSelectedRelationship] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'all' | 'prescriptions' | 'timeline'>('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeRecord, setActiveRecord] = useState<IMedicalRecord | null>(null)

  // Auth Protection Guard
  useEffect(() => {
    if (!authInitializing && !user) {
      router.replace('/login')
    }
  }, [user, authInitializing, router])

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Fetch records from backend
  const loadRecords = useCallback(async () => {
    if (!user) return
    if (!initialFetchDone) {
      setLoadingRecords(true)
    } else {
      setIsSearching(true)
    }
    setFetchError(null)

    try {
      const token = await getToken()
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (selectedRelationship !== 'All') params.append('relationship', selectedRelationship)
      if (selectedCategory !== 'All') params.append('category', selectedCategory)

      const endpoint = `/records?${params.toString()}`
      const response = await fetchWithAuth(endpoint, token)

      if (response.success) {
        setRecords(response.data || [])
      }
    } catch (err: any) {
      console.error('Error fetching records:', err)
      if (err.status === 401) {
        setFetchError('Session expired. Redirecting to login...')
        setTimeout(() => logout(), 1500)
      } else {
        setFetchError(err.message || 'Failed to load medical records.')
      }
    } fontally: {
      setLoadingRecords(false)
      setIsSearching(false)
      setInitialFetchDone(true)
    }
  }, [user, getToken, debouncedSearch, selectedRelationship, selectedCategory, initialFetchDone, logout])

  useEffect(() => {
    if (user && !authInitializing) {
      loadRecords()
    }
  }, [user, authInitializing, loadRecords])

  // Instant Client-Side Filter for zero-delay UX while debounced query runs
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      if (selectedRelationship !== 'All' && rec.relationship !== selectedRelationship) {
        return false
      }
      if (selectedCategory !== 'All' && rec.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const matchName = rec.patientName?.toLowerCase().includes(q)
        const matchDoctor = rec.doctorName?.toLowerCase().includes(q)
        const matchSpecialty = rec.doctorSpecialty?.toLowerCase().includes(q)
        const matchClinic = rec.clinicLocation?.toLowerCase().includes(q)
        const matchNotes = rec.medicinesOrNotes?.toLowerCase().includes(q)
        const matchCat = rec.category?.toLowerCase().includes(q)
        return matchName || matchDoctor || matchSpecialty || matchClinic || matchNotes || matchCat
      }
      return true
    })
  }, [records, selectedRelationship, selectedCategory, searchQuery])

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

  if (authInitializing || (!user && authInitializing)) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8F1D2C]" />
        <p className="text-xs font-semibold text-[#68736F]">Verifying session...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#17201D] font-sans pb-16 w-full max-w-full overflow-x-hidden">
      {/* Authenticated Application Header */}
      <Navbar
        onOpenCreateModal={() => {
          setActiveRecord(null)
          setIsModalOpen(true)
        }}
        isNavigating={isSearching}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 space-y-3.5 sm:space-y-4 w-full min-w-0">
        {/* Mobile Navigation Tabs */}
        <div className="md:hidden bg-white p-1 sm:p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar w-full min-w-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#8F1D2C] text-white shadow-xs'
                : 'text-[#68736F] hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>Records</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'prescriptions'
                ? 'bg-[#8F1D2C] text-white shadow-xs'
                : 'text-[#68736F] hover:bg-slate-50'
            }`}
          >
            <Pill className="w-3.5 h-3.5 shrink-0" />
            <span>Prescriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'timeline'
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
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed shrink-0"
          >
            <Bot className="w-3.5 h-3.5 shrink-0" />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {fetchError && (
          <div className="p-3 bg-[#F8E9EC] border border-[#8F1D2C]/30 rounded-xl text-xs text-[#8F1D2C] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{fetchError}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="space-y-2 sm:space-y-2.5 w-full min-w-0">
          <div className="relative flex items-center gap-2 w-full min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor, patient, medicine, specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-w-0 pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C] shadow-xs transition-colors"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8F1D2C] absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            <button
              onClick={() => setActiveTab(activeTab === 'timeline' ? 'all' : 'timeline')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                activeTab === 'timeline'
                  ? 'bg-[#F8E9EC] text-[#8F1D2C] border-[#8F1D2C]/30 shadow-xs'
                  : 'bg-white text-[#68736F] border-slate-200 hover:text-[#17201D] shadow-xs'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Timeline</span>
            </button>
          </div>

          {/* Family Member Filter Pills */}
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

          {/* Category Filter Pills */}
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
        {activeTab === 'timeline' ? (
          <MedicalTimeline
            records={filteredRecords}
            onSelectRecord={(rec) => {
              setActiveRecord(rec)
              setIsModalOpen(true)
            }}
          />
        ) : loadingRecords && !initialFetchDone ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-28 bg-white border border-slate-200 rounded-xl animate-pulse w-full"
              />
            ))}
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {filteredRecords.map((rec) => (
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
          /* Polished Medical Empty State */
          <div className="py-12 sm:py-16 text-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-xs w-full max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#F8E9EC] text-[#8F1D2C] rounded-2xl flex items-center justify-center mx-auto">
              <FolderPlus className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#17201D]">
                {searchQuery.trim() || selectedRelationship !== 'All' || selectedCategory !== 'All'
                  ? 'No matching records found'
                  : 'Your medical history starts here'}
              </h3>
              <p className="text-xs text-[#68736F] leading-relaxed max-w-xs mx-auto">
                {searchQuery.trim() || selectedRelationship !== 'All' || selectedCategory !== 'All'
                  ? 'Try clearing your search query or filter pills to see all medical records.'
                  : 'Add your first prescription or medical record to keep everything organized for you and your family.'}
              </p>
            </div>

            <button
              onClick={() => {
                if (searchQuery.trim() || selectedRelationship !== 'All' || selectedCategory !== 'All') {
                  setSearchQuery('')
                  setSelectedRelationship('All')
                  setSelectedCategory('All')
                } else {
                  setActiveRecord(null)
                  setIsModalOpen(true)
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs rounded-full transition-all shadow-xs hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>
                {searchQuery.trim() || selectedRelationship !== 'All' || selectedCategory !== 'All'
                  ? 'Clear Search & Filters'
                  : 'Add First Record'}
              </span>
            </button>
          </div>
        )}
      </main>

      {/* Record Create / Edit Modal */}
      <RecordModal
        isOpen={isModalOpen}
        record={activeRecord}
        existingRecords={records}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        onDelete={handleDeleteRecord}
      />
    </div>
  )
}
