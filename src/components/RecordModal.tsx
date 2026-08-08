'use client'

import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'

interface RecordModalProps {
  isOpen: boolean
  record?: IMedicalRecord | null
  onClose: () => void
  onSave: (recordData: Partial<IMedicalRecord>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

type ModalMode = 'VIEW' | 'EDIT' | 'CREATE'

export function RecordModal({
  isOpen,
  record,
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
  const [medicinesOrNotes, setMedicinesOrNotes] = useState('')
  const [imageRef, setImageRef] = useState<{
    url?: string
    thumbnail?: string
    dimensions?: { width?: number; height?: number }
  }>({})

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

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
      setMedicinesOrNotes(record.medicinesOrNotes || '')
      setImageRef(record.imageRef || {})
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
      setMedicinesOrNotes('')
      setImageRef({})
    }
    setIsLightboxOpen(false)
  }, [record, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim()) return

    setIsSaving(true)
    try {
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
        medicinesOrNotes: medicinesOrNotes.trim(),
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
              {medicinesOrNotes && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#17201D] block">
                    Medicines & Clinical Notes
                  </span>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-[#17201D] leading-relaxed whitespace-pre-line">
                    {medicinesOrNotes}
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

              {/* Doctor & Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={doctorSpecialty}
                    onChange={(e) => setDoctorSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
                </div>
              </div>

              {/* Clinic & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] mb-1">
                    Clinic / Hospital Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City Care Clinic"
                    value={clinicLocation}
                    onChange={(e) => setClinicLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                  />
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

              {/* Medicines & Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#17201D] mb-1">
                  Medicines / Clinical Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prescribed Amoxicillin 500mg (3x daily)..."
                  value={medicinesOrNotes}
                  onChange={(e) => setMedicinesOrNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C] resize-none"
                />
              </div>

              {/* Document Scanner Component */}
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
