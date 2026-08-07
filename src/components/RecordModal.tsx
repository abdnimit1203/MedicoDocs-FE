'use client'

import React, { useState, useEffect } from 'react'
import { IMedicalRecord } from '@/lib/api'
import { DocumentScanner } from './DocumentScanner'
import { X, Save, Trash2, User } from 'lucide-react'

interface RecordModalProps {
  isOpen: boolean
  record?: IMedicalRecord | null
  onClose: () => void
  onSave: (recordData: Partial<IMedicalRecord>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function RecordModal({
  isOpen,
  record,
  onClose,
  onSave,
  onDelete,
}: RecordModalProps) {
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

  useEffect(() => {
    if (record) {
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden text-slate-900 animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <span>{record ? 'Medical Record Details' : 'New Medical Record'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Patient & Relationship */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Jenkins"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specialty
              </label>
              <input
                type="text"
                placeholder="e.g. Cardiology"
                value={doctorSpecialty}
                onChange={(e) => setDoctorSpecialty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Clinic & Category */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinic / Hospital Location
              </label>
              <input
                type="text"
                placeholder="e.g. City Care Clinic"
                value={clinicLocation}
                onChange={(e) => setClinicLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              >
                <option value="General">General</option>
                <option value="Disease">Disease</option>
                <option value="Condition">Condition</option>
                <option value="Specialty">Specialty</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visit Date
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prescription Date
              </label>
              <input
                type="date"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Medicines & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medicines / Clinical Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Prescribed Amoxicillin 500mg (3x daily), rest 5 days..."
              value={medicinesOrNotes}
              onChange={(e) => setMedicinesOrNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white resize-none transition-colors"
            />
          </div>

          {/* Document Scanner Component (Milestone 7) */}
          <DocumentScanner
            initialImage={imageRef}
            onImageCaptured={(scannedImg) => setImageRef(scannedImg)}
          />

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {record?._id && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Record'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
