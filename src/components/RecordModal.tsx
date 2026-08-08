'use client'

import React, { useState, useEffect, useRef } from 'react'
import { IMedicalRecord } from '@/lib/api'
import { DocumentScanner } from './DocumentScanner'
import { LightboxViewer } from './LightboxViewer'
import {
  X,
  Save,
  Trash2,
  Edit,
  User,
  Stethoscope,
  MapPin,
  Calendar,
  Pill,
  FileText,
  ZoomIn,
  ImageOff,
  ArrowLeft,
  Check,
  Plus,
} from 'lucide-react'

interface RecordModalProps {
  isOpen: boolean
  record?: IMedicalRecord | null
  existingRecords?: IMedicalRecord[]
  onClose: () => void
  onSave: (recordData: Partial<IMedicalRecord>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

type ModalMode = 'VIEW' | 'EDIT' | 'CREATE'

const DEFAULT_SPECIALTIES = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Dentistry',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'ENT / Otolaryngology',
  'Ophthalmology',
  'Gynecology & Obstetrics',
  'Psychiatry',
  'Endocrinology',
  'Gastroenterology',
  'Urology',
  'Pulmonology',
]

const DEFAULT_CLINICS = [
  'City Care Clinic',
  'Apollo Hospital',
  'General Hospital',
  'Medicare Specialty Center',
  'Community Health Clinic',
  'Lifeline Medical Center',
]

export function RecordModal({
  isOpen,
  record,
  existingRecords = [],
  onClose,
  onSave,
  onDelete,
}: RecordModalProps) {
  const [mode, setMode] = useState<ModalMode>('CREATE')

  // Form State
  const [patientName, setPatientName] = useState('')
  const [relationship, setRelationship] = useState('Self')
  const [doctorName, setDoctorName] = useState('')
  const [doctorSpecialty, setDoctorSpecialty] = useState('')
  const [clinicLocation, setClinicLocation] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [prescriptionDate, setPrescriptionDate] = useState('')
  const [category, setCategory] = useState('General')
  const [imageRef, setImageRef] = useState<{
    url?: string
    thumbnail?: string
    dimensions?: { width?: number; height?: number }
  }>({})

  // Structured Medicines & Clinical Notes (Phase 4)
  const [medicineInput, setMedicineInput] = useState('')
  const [dosageInput, setDosageInput] = useState('')
  const [medicinesList, setMedicinesList] = useState<{ name: string; dosage: string }[]>([])
  const [clinicalNotes, setClinicalNotes] = useState('')

  // Autocomplete Suggestions State
  const [showSpecialtySuggestions, setShowSpecialtySuggestions] = useState(false)
  const [showClinicSuggestions, setShowClinicSuggestions] = useState(false)
  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false)

  const specialtyRef = useRef<HTMLDivElement>(null)
  const clinicRef = useRef<HTMLDivElement>(null)
  const doctorRef = useRef<HTMLDivElement>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Click away listener for suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target as Node)) {
        setShowSpecialtySuggestions(false)
      }
      if (clinicRef.current && !clinicRef.current.contains(event.target as Node)) {
        setShowClinicSuggestions(false)
      }
      if (doctorRef.current && !doctorRef.current.contains(event.target as Node)) {
        setShowDoctorSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // User-specific suggestions from user's own existing records
  const userSpecialties = Array.from(
    new Set(
      [...DEFAULT_SPECIALTIES, ...existingRecords.map((r) => r.doctorSpecialty).filter(Boolean)] as string[]
    )
  )

  const userClinics = Array.from(
    new Set(
      [...DEFAULT_CLINICS, ...existingRecords.map((r) => r.clinicLocation).filter(Boolean)] as string[]
    )
  )

  const userDoctors = Array.from(
    new Set(
      existingRecords.map((r) => r.doctorName).filter(Boolean) as string[]
    )
  )

  const filteredSpecialties = userSpecialties.filter((s) =>
    s.toLowerCase().includes(doctorSpecialty.toLowerCase())
  )

  const filteredClinics = userClinics.filter((c) =>
    c.toLowerCase().includes(clinicLocation.toLowerCase())
  )

  const filteredDoctors = userDoctors.filter((d) =>
    d.toLowerCase().includes(doctorName.toLowerCase())
  )

  useEffect(() => {
    if (record) {
      setMode('VIEW')
      setPatientName(record.patientName || '')
      setRelationship(record.relationship || 'Self')
      setDoctorName(record.doctorName || '')
      setDoctorSpecialty(record.doctorSpecialty || '')
      setClinicLocation(record.clinicLocation || '')
      setVisitDate(record.visitDate ? record.visitDate.substring(0, 10) : '')
      setPrescriptionDate(
        record.prescriptionDate ? record.prescriptionDate.substring(0, 10) : ''
      )
      setCategory(record.category || 'General')
      setImageRef(record.imageRef || {})

      // Parse medicinesOrNotes if structured or plain string
      const notesRaw = record.medicinesOrNotes || ''
      setClinicalNotes(notesRaw)
      setMedicinesList([])
    } else {
      setMode('CREATE')
      setPatientName('')
      setRelationship('Self')
      setDoctorName('')
      setDoctorSpecialty('')
      setClinicLocation('')
      setVisitDate(new Date().toISOString().substring(0, 10))
      setPrescriptionDate('')
      setCategory('General')
      setClinicalNotes('')
      setMedicinesList([])
      setImageRef({})
    }
    setIsLightboxOpen(false)
  }, [record, isOpen])

  if (!isOpen) return null

  const handleAddMedicine = () => {
    if (!medicineInput.trim()) return
    setMedicinesList([
      ...medicinesList,
      { name: medicineInput.trim(), dosage: dosageInput.trim() },
    ])
    setMedicineInput('')
    setDosageInput('')
  }

  const handleRemoveMedicine = (index: number) => {
    setMedicinesList(medicinesList.filter((_, i) => i !== index))
  }

  const serializeMedicinesAndNotes = (): string => {
    const medText = medicinesList.map((m) => `• ${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join('\n')
    if (medText && clinicalNotes.trim()) {
      return `Prescribed Medicines:\n${medText}\n\nClinical Notes & Diagnosis:\n${clinicalNotes.trim()}`
    } else if (medText) {
      return `Prescribed Medicines:\n${medText}`
    } else {
      return clinicalNotes.trim()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim()) return

    setIsSaving(true)
    try {
      const combinedNotes = serializeMedicinesAndNotes()
      await onSave({
        _id: record?._id,
        patientName: patientName.trim(),
        relationship,
        doctorName: doctorName.trim(),
        doctorSpecialty: doctorSpecialty.trim(),
        clinicLocation: clinicLocation.trim(),
        visitDate: visitDate || undefined,
        prescriptionDate: prescriptionDate || undefined,
        category,
        medicinesOrNotes: combinedNotes,
        imageRef,
      })
      onClose()
    } catch (err) {
      console.error('Save record error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!record?._id || !onDelete) return
    if (!confirm('Are you sure you want to delete this medical record?')) return

    setIsDeleting(true)
    try {
      await onDelete(record._id)
      onClose()
    } catch (err) {
      console.error('Delete record error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const hasImage = Boolean(imageRef?.url || imageRef?.thumbnail)
  const displayImageUrl = imageRef?.url || imageRef?.thumbnail || ''

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#17201D]/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="bg-white border border-slate-200 w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden text-[#17201D] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Modal Header */}
          <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-[#F8F9F7]">
            <div className="flex items-center gap-2">
              {mode === 'EDIT' && (
                <button
                  onClick={() => setMode('VIEW')}
                  className="p-1 rounded-lg text-[#68736F] hover:text-[#17201D] hover:bg-slate-200 transition-colors mr-1"
                  title="Back to view mode"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h2 className="font-bold text-sm text-[#17201D] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8F1D2C]" />
                <span>
                  {mode === 'VIEW'
                    ? 'Medical Record Details'
                    : mode === 'EDIT'
                    ? 'Edit Medical Record'
                    : 'New Medical Record'}
                </span>
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#68736F] hover:text-[#17201D] hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ====================================================== */}
          {/* MODE 1: VIEW MODE (Read-only presentation + Lightbox) */}
          {/* ====================================================== */}
          {mode === 'VIEW' ? (
            <div className="p-4 space-y-4 overflow-y-auto flex-1 w-full max-w-full">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#68736F] block">
                    Patient Name
                  </span>
                  <h3 className="text-base font-extrabold text-[#17201D] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8F1D2C]" />
                    <span>{patientName}</span>
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F8E9EC] text-[#8F1D2C] border border-[#8F1D2C]/30">
                    {relationship}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#17201D]">
                    {category}
                  </span>
                </div>
              </div>

              {/* Doctor & Clinic Info */}
              {(doctorName || doctorSpecialty || clinicLocation) && (
                <div className="bg-[#F8F9F7] p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  {doctorName && (
                    <div className="flex items-center gap-2 text-[#17201D]">
                      <Stethoscope className="w-4 h-4 text-[#8F1D2C] shrink-0" />
                      <span className="font-bold">
                        {doctorName}
                        {doctorSpecialty ? ` (${doctorSpecialty})` : ''}
                      </span>
                    </div>
                  )}
                  {clinicLocation && (
                    <div className="flex items-center gap-2 text-[#68736F]">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{clinicLocation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dates */}
              {(visitDate || prescriptionDate) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {visitDate && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10px] font-bold text-[#68736F] uppercase tracking-wider block">
                        Visit Date
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-[#17201D]">
                        <Calendar className="w-3.5 h-3.5 text-[#3B988E]" />
                        <span>{visitDate}</span>
                      </div>
                    </div>
                  )}

                  {prescriptionDate && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10px] font-bold text-[#68736F] uppercase tracking-wider block">
                        Rx Date
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-[#17201D]">
                        <Pill className="w-3.5 h-3.5 text-[#8F1D2C]" />
                        <span>{prescriptionDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Medicines / Clinical Notes */}
              {clinicalNotes && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#17201D] block">
                    Medicines & Clinical Notes
                  </span>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-[#17201D] leading-relaxed whitespace-pre-line">
                    {clinicalNotes}
                  </div>
                </div>
              )}

              {/* Prescription Document Display */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#17201D] block">
                  Prescription Document
                </span>

                {hasImage ? (
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="group relative rounded-xl border border-slate-200 bg-slate-900 overflow-hidden cursor-pointer shadow-xs hover:border-[#8F1D2C] transition-all max-h-56 flex items-center justify-center"
                  >
                    <img
                      src={displayImageUrl}
                      alt="Prescription Document"
                      className="max-h-56 w-full object-contain group-hover:scale-102 transition-transform duration-200"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs font-bold">
                      <ZoomIn className="w-6 h-6 text-white" />
                      <span>Tap to view full resolution</span>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                      <ZoomIn className="w-3 h-3" />
                      <span>Inspect Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 rounded-xl border border-dashed border-slate-200 bg-[#F8F9F7] text-center space-y-1 text-[#68736F]">
                    <ImageOff className="w-6 h-6 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold">No prescription image attached</p>
                  </div>
                )}
              </div>

              {/* View Mode Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                {onDelete ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMode('EDIT')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Record</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ====================================================== */
            /* MODE 2 & 3: FORM INPUT MODE (CREATE or EDIT)           */
            /* ====================================================== */
            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 w-full max-w-full">
              {/* Patient & Relationship */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  >
                    <option value="Self">Self</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Wife">Wife</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Doctor & Specialty with Autocomplete Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Doctor Name */}
                <div className="relative" ref={doctorRef}>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    value={doctorName}
                    onFocus={() => setShowDoctorSuggestions(true)}
                    onChange={(e) => {
                      setDoctorName(e.target.value)
                      setShowDoctorSuggestions(true)
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                  {showDoctorSuggestions && filteredDoctors.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-36 overflow-y-auto py-1">
                      {filteredDoctors.map((doc) => (
                        <button
                          type="button"
                          key={doc}
                          onClick={() => {
                            setDoctorName(doc)
                            setShowDoctorSuggestions(false)
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#F8E9EC] hover:text-[#8F1D2C] text-[#17201D] font-medium transition-colors flex items-center justify-between"
                        >
                          <span>{doc}</span>
                          <Check className="w-3 h-3 text-[#20A878] opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Doctor Specialty Autocomplete */}
                <div className="relative" ref={specialtyRef}>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={doctorSpecialty}
                    onFocus={() => setShowSpecialtySuggestions(true)}
                    onChange={(e) => {
                      setDoctorSpecialty(e.target.value)
                      setShowSpecialtySuggestions(true)
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                  {showSpecialtySuggestions && filteredSpecialties.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto py-1">
                      {filteredSpecialties.map((spec) => (
                        <button
                          type="button"
                          key={spec}
                          onClick={() => {
                            setDoctorSpecialty(spec)
                            setShowSpecialtySuggestions(false)
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#F8E9EC] hover:text-[#8F1D2C] text-[#17201D] font-medium transition-colors flex items-center justify-between"
                        >
                          <span>{spec}</span>
                          <Check className="w-3 h-3 text-[#20A878] opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Clinic & Category with Autocomplete */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative" ref={clinicRef}>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Clinic / Hospital Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Hospital"
                    value={clinicLocation}
                    onFocus={() => setShowClinicSuggestions(true)}
                    onChange={(e) => {
                      setClinicLocation(e.target.value)
                      setShowClinicSuggestions(true)
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                  {showClinicSuggestions && filteredClinics.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto py-1">
                      {filteredClinics.map((clinic) => (
                        <button
                          type="button"
                          key={clinic}
                          onClick={() => {
                            setClinicLocation(clinic)
                            setShowClinicSuggestions(false)
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#F8E9EC] hover:text-[#8F1D2C] text-[#17201D] font-medium transition-colors flex items-center justify-between"
                        >
                          <span>{clinic}</span>
                          <Check className="w-3 h-3 text-[#20A878] opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  >
                    <option value="General">General</option>
                    <option value="Disease">Disease</option>
                    <option value="Condition">Condition</option>
                    <option value="Specialty">Specialty</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Prescription Date
                  </label>
                  <input
                    type="date"
                    value={prescriptionDate}
                    onChange={(e) => setPrescriptionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                </div>
              </div>

              {/* Phase 4: Prescribed Medicines & Clinical Notes Structure */}
              <div className="space-y-3 bg-[#F8F9F7] p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17201D] flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-[#8F1D2C]" />
                    <span>Prescribed Medicines</span>
                  </label>
                  <span className="text-[10px] text-[#68736F] font-semibold">Structured Entry</span>
                </div>

                {/* Quick Add Medicine Row */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Medicine (e.g. Amoxicillin)"
                    value={medicineInput}
                    onChange={(e) => setMedicineInput(e.target.value)}
                    className="flex-1 min-w-0 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#8F1D2C]"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (500mg 3x/day)"
                    value={dosageInput}
                    onChange={(e) => setDosageInput(e.target.value)}
                    className="w-32 sm:w-36 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#8F1D2C]"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="px-2.5 py-1.5 bg-[#8F1D2C] hover:bg-[#741522] text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Medicines List Badges */}
                {medicinesList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {medicinesList.map((m, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-[#17201D]"
                      >
                        <span className="font-bold text-[#8F1D2C]">{m.name}</span>
                        {m.dosage && <span className="text-[#68736F] text-[11px]">({m.dosage})</span>}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(idx)}
                          className="text-slate-400 hover:text-rose-600 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Clinical Notes & Advice Textarea */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#68736F] mb-1">
                    Clinical Notes & Diagnosis / Advice
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Diagnosis: Acute Pharyngitis. Advice: Drink warm water, rest for 5 days..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C] resize-none"
                  />
                </div>
              </div>

              {/* Document Scanner Component (Preserving ImageKit Upload) */}
              <DocumentScanner
                initialImage={imageRef}
                onImageCaptured={(scannedImg) => setImageRef(scannedImg)}
              />

              {/* Form Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => (mode === 'EDIT' ? setMode('VIEW') : onClose())}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#68736F] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {isSaving
                      ? 'Saving...'
                      : mode === 'EDIT'
                      ? 'Save Changes'
                      : 'Save Record'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Lightbox Image Viewer */}
      <LightboxViewer
        isOpen={isLightboxOpen}
        imageUrl={displayImageUrl}
        title={`${patientName}'s Prescription`}
        subtitle={doctorName ? `Doctor: ${doctorName}` : undefined}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  )
}
