'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchWithAuth, IMedicalRecord, DocumentType, ITestResultItem } from '@/lib/api'
import { toast } from 'react-hot-toast'
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
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Activity,
  FlaskConical,
} from 'lucide-react'

interface RecordModalProps {
  isOpen: boolean
  initialDocumentType?: DocumentType
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
  initialDocumentType = 'visit',
  record,
  existingRecords = [],
  onClose,
  onSave,
  onDelete,
}: RecordModalProps) {
  const { getToken } = useAuth()
  const [mode, setMode] = useState<ModalMode>('CREATE')

  // Core Document Fields
  const [documentType, setDocumentType] = useState<DocumentType>(initialDocumentType)
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

  // Medical Visit Specific Fields
  const [testsOrdered, setTestsOrdered] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  // Test Report Specific Fields
  const [testName, setTestName] = useState('')
  const [labName, setLabName] = useState('')
  const [testResults, setTestResults] = useState<ITestResultItem[]>([])
  const [paramInput, setParamInput] = useState('')
  const [valInput, setValInput] = useState('')
  const [unitInput, setUnitInput] = useState('')
  const [refInput, setRefInput] = useState('')
  const [flagInput, setFlagInput] = useState('NORMAL')

  // Medicines & Clinical Notes
  const [medicineInput, setMedicineInput] = useState('')
  const [dosageInput, setDosageInput] = useState('')
  const [medicinesList, setMedicinesList] = useState<{ name: string; dosage: string }[]>([])
  const [clinicalNotes, setClinicalNotes] = useState('')

  // Gemini AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null)
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null)
  const [uncertainFields, setUncertainFields] = useState<string[]>([])

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

  // User-specific suggestions
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
    setAiSuccessMessage(null)
    setAiErrorMessage(null)
    setUncertainFields([])

    if (record) {
      setMode('VIEW')
      setDocumentType(record.documentType || 'visit')
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
      setTestsOrdered(record.testsOrdered || '')
      setFollowUpDate(record.followUpDate ? record.followUpDate.substring(0, 10) : '')
      setTestName(record.testName || '')
      setLabName(record.labName || '')
      setTestResults(record.testResults || [])
      setClinicalNotes(record.medicinesOrNotes || '')
      setMedicinesList([])
    } else {
      setMode('CREATE')
      setDocumentType(initialDocumentType)
      setPatientName('')
      setRelationship('Self')
      setDoctorName('')
      setDoctorSpecialty('')
      setClinicLocation('')
      setVisitDate(new Date().toISOString().substring(0, 10))
      setPrescriptionDate('')
      setCategory('General')
      setClinicalNotes('')
      setTestsOrdered('')
      setFollowUpDate('')
      setTestName('')
      setLabName('')
      setTestResults([])
      setMedicinesList([])
      setImageRef({})
    }
    setIsLightboxOpen(false)
  }, [record, isOpen, initialDocumentType])

  if (!isOpen) return null

  // Gemini AI Prescription or Test Report Analysis
  const handleAnalyzeWithGemini = async () => {
    if (!imageRef?.url && !imageRef?.thumbnail) {
      setAiErrorMessage('Please upload a document image first before running AI analysis.')
      return
    }

    setIsAnalyzing(true)
    setAiSuccessMessage(null)
    setAiErrorMessage(null)
    setUncertainFields([])

    try {
      const token = await getToken()
      const targetImage = imageRef.url || imageRef.thumbnail || ''

      const endpoint =
        documentType === 'test_report'
          ? '/records/analyze-test-report'
          : '/records/analyze-prescription'

      const response = await fetchWithAuth(endpoint, token, {
        method: 'POST',
        body: JSON.stringify({ imageUrl: targetImage }),
      })

      if (response.success && response.data) {
        const aiData = response.data

        if (documentType === 'test_report') {
          if (aiData.testName) setTestName(aiData.testName)
          if (aiData.labName) setLabName(aiData.labName)
          if (aiData.patientName && !patientName.trim()) setPatientName(aiData.patientName)
          if (aiData.reportDate) setVisitDate(aiData.reportDate.substring(0, 10))
          if (aiData.summaryResult) setClinicalNotes(aiData.summaryResult)
          if (Array.isArray(aiData.testResults)) setTestResults(aiData.testResults)

          setAiSuccessMessage(
            `✨ Gemini AI Analysis Complete: Extracted test report details and ${
              aiData.testResults?.length || 0
            } parameter measurement(s). Please review and edit before saving.`
          )
          toast.success('✨ Gemini AI Test Report extraction complete!')
        } else {
          // Prescription Analysis
          if (aiData.doctorName) setDoctorName(aiData.doctorName)
          if (aiData.doctorSpecialty) setDoctorSpecialty(aiData.doctorSpecialty)
          if (aiData.clinicLocation) setClinicLocation(aiData.clinicLocation)
          if (aiData.patientName && !patientName.trim()) setPatientName(aiData.patientName)
          if (aiData.visitDate) setVisitDate(aiData.visitDate.substring(0, 10))
          if (aiData.prescriptionDate) setPrescriptionDate(aiData.prescriptionDate.substring(0, 10))
          if (aiData.category) setCategory(aiData.category)
          if (aiData.clinicalNotes) setClinicalNotes(aiData.clinicalNotes)

          if (Array.isArray(aiData.medicines) && aiData.medicines.length > 0) {
            const formattedMeds = aiData.medicines.map((m: any) => {
              const dosageParts = [
                m.strength,
                m.frequency,
                m.duration,
                m.instructions,
              ].filter(Boolean)
              return {
                name: m.name || 'Prescription Item',
                dosage: dosageParts.join(' | '),
              }
            })
            setMedicinesList(formattedMeds)
          }

          setAiSuccessMessage(
            `✨ Gemini AI Analysis Complete: Extracted prescription details and ${
              aiData.medicines?.length || 0
            } medicine(s). Please review and edit before saving.`
          )
          toast.success('✨ Gemini AI Prescription extraction complete!')
        }

        if (Array.isArray(aiData.uncertainFields)) {
          setUncertainFields(aiData.uncertainFields)
        }
      } else {
        throw new Error(response.error?.message || 'AI analysis did not return valid data.')
      }
    } catch (err: any) {
      console.error('Gemini AI Error:', err)
      const errText = err.message || 'Failed to analyze image with Gemini AI.'
      setAiErrorMessage(errText)
      toast.error(errText)
    } finally {
      setIsAnalyzing(false)
    }
  }

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

  const handleAddTestResult = () => {
    if (!paramInput.trim() || !valInput.trim()) return
    setTestResults([
      ...testResults,
      {
        parameter: paramInput.trim(),
        value: valInput.trim(),
        unit: unitInput.trim() || undefined,
        referenceRange: refInput.trim() || undefined,
        flag: flagInput,
      },
    ])
    setParamInput('')
    setValInput('')
    setUnitInput('')
    setRefInput('')
    setFlagInput('NORMAL')
  }

  const handleRemoveTestResult = (index: number) => {
    setTestResults(testResults.filter((_, i) => i !== index))
  }

  const serializeMedicinesAndNotes = (): string => {
    const medText = medicinesList.map((m) => `• ${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join('\n')
    if (medText && clinicalNotes.trim()) {
      return `Prescribed Medicines:\n${medText}\n\nClinical Notes:\n${clinicalNotes.trim()}`
    } else if (medText) {
      return `Prescribed Medicines:\n${medText}`
    } else {
      return clinicalNotes.trim()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim()) {
      toast.error('Patient Name is required.')
      return
    }

    setIsSaving(true)
    try {
      const combinedNotes = serializeMedicinesAndNotes()
      await onSave({
        _id: record?._id,
        patientName: patientName.trim(),
        relationship,
        documentType,
        doctorName: doctorName.trim(),
        doctorSpecialty: doctorSpecialty.trim(),
        clinicLocation: clinicLocation.trim(),
        visitDate: visitDate || undefined,
        prescriptionDate: prescriptionDate || undefined,
        category,
        medicinesOrNotes: combinedNotes,
        imageRef,
        testName: testName.trim(),
        labName: labName.trim(),
        testsOrdered: testsOrdered.trim(),
        followUpDate: followUpDate || undefined,
        testResults,
      })
      toast.success(record?._id ? 'Medical record updated successfully!' : 'Medical record created successfully!')
      onClose()
    } catch (err: any) {
      console.error('Save record error:', err)
      toast.error(err.message || 'Failed to save medical record.')
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
      toast.success('Medical record deleted successfully.')
      onClose()
    } catch (err: any) {
      console.error('Delete record error:', err)
      toast.error(err.message || 'Failed to delete medical record.')
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
                {documentType === 'prescription' ? (
                  <Pill className="w-4 h-4 text-[#3B988E]" />
                ) : documentType === 'test_report' ? (
                  <Activity className="w-4 h-4 text-purple-600" />
                ) : (
                  <Stethoscope className="w-4 h-4 text-[#8F1D2C]" />
                )}
                <span>
                  {mode === 'VIEW'
                    ? `${documentType === 'prescription' ? 'Prescription' : documentType === 'test_report' ? 'Test Report' : 'Medical Visit'} Details`
                    : mode === 'EDIT'
                    ? `Edit ${documentType === 'prescription' ? 'Prescription' : documentType === 'test_report' ? 'Test Report' : 'Medical Visit'}`
                    : `New ${documentType === 'prescription' ? 'Prescription' : documentType === 'test_report' ? 'Test Report' : 'Medical Visit'}`}
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#17201D] capitalize">
                    {documentType.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Test Report Header if test_report */}
              {documentType === 'test_report' && (testName || labName) && (
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 space-y-1 text-xs">
                  {testName && (
                    <div className="flex items-center gap-2 text-purple-900 font-bold">
                      <Activity className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>{testName}</span>
                    </div>
                  )}
                  {labName && (
                    <div className="flex items-center gap-2 text-purple-700">
                      <FlaskConical className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>{labName}</span>
                    </div>
                  )}
                </div>
              )}

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
              {(visitDate || prescriptionDate || followUpDate) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {visitDate && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10px] font-bold text-[#68736F] uppercase tracking-wider block">
                        {documentType === 'prescription' ? 'Rx Date' : documentType === 'test_report' ? 'Report Date' : 'Visit Date'}
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-[#17201D]">
                        <Calendar className="w-3.5 h-3.5 text-[#3B988E]" />
                        <span>{visitDate}</span>
                      </div>
                    </div>
                  )}

                  {followUpDate && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10px] font-bold text-[#68736F] uppercase tracking-wider block">
                        Follow-up Date
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-[#8F1D2C]">
                        <Calendar className="w-3.5 h-3.5 text-[#8F1D2C]" />
                        <span>{followUpDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Test Results Table if present */}
              {testResults.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#17201D] block">
                    Test Parameter Measurements
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#F8F9F7] border-b border-slate-200 text-[#68736F] font-semibold text-[11px]">
                        <tr>
                          <th className="p-2">Parameter</th>
                          <th className="p-2">Result</th>
                          <th className="p-2">Ref Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {testResults.map((tr, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-semibold text-[#17201D]">{tr.parameter}</td>
                            <td className="p-2">
                              <span className="font-bold">{tr.value}</span> {tr.unit || ''}
                              {tr.flag && tr.flag !== 'NORMAL' && (
                                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-100 text-rose-700">
                                  {tr.flag}
                                </span>
                              )}
                            </td>
                            <td className="p-2 text-[#68736F] text-[11px]">{tr.referenceRange || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Prescribed Medicines (List Boxed Cards in View Mode) */}
              {medicinesList.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#17201D] flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-[#8F1D2C]" />
                    <span>Prescribed Medicines ({medicinesList.length})</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {medicinesList.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#F8E9EC]/70 border border-[#8F1D2C]/20 rounded-xl flex items-start gap-2 text-xs shadow-2xs"
                      >
                        <Pill className="w-4 h-4 text-[#8F1D2C] shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="font-extrabold text-[#8F1D2C] block truncate">{med.name}</span>
                          {med.dosage && (
                            <span className="text-[11px] font-semibold text-[#68736F] block mt-0.5">
                              {med.dosage}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnosis / Clinical Notes & Advice (View Mode) */}
              {clinicalNotes && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#17201D] block">
                    Diagnosis / Clinical Notes & Advice
                  </span>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#17201D] leading-relaxed whitespace-pre-line font-medium shadow-2xs">
                    {clinicalNotes}
                  </div>
                </div>
              )}

              {/* Prescription / Test Document Display */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#17201D] block">
                  Attached Document / Image
                </span>

                {hasImage ? (
                  <div className="space-y-2">
                    <div
                      onClick={() => setIsLightboxOpen(true)}
                      className="group relative rounded-xl border border-slate-200 bg-slate-900 overflow-hidden cursor-pointer shadow-xs hover:border-[#8F1D2C] transition-all max-h-56 flex items-center justify-center"
                    >
                      <img
                        src={displayImageUrl}
                        alt="Medical Document"
                        className="max-h-56 w-full object-contain group-hover:scale-102 transition-transform duration-200"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs font-bold">
                        <ZoomIn className="w-6 h-6 text-white" />
                        <span>Tap to view full resolution</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAnalyzeWithGemini}
                      disabled={isAnalyzing}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-[#8F1D2C] via-[#741522] to-[#3B988E] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Analyzing with Gemini AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>
                            {documentType === 'test_report'
                              ? 'Scan Test Report with Gemini AI'
                              : 'Scan Prescription with Gemini AI'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-[#68736F]">
                    No prescription or document image attached.
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
              {/* Top AI Scan Banner in Edit Mode if Image Exists */}
              {hasImage && (
                <div className="p-3 bg-gradient-to-r from-[#F8E9EC] via-[#E6F4F2] to-slate-50 border border-[#8F1D2C]/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8F1D2C] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#8F1D2C]" />
                      <span>Gemini 3.6 Flash AI Intelligence</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="text-[11px] font-bold text-[#3B988E] hover:underline"
                    >
                      View Image
                    </button>
                  </div>
                  <p className="text-[11px] text-[#68736F] leading-tight">
                    Scan prescription or lab report images to auto-populate medicine lists and diagnostic details below.
                  </p>
                  <button
                    type="button"
                    onClick={handleAnalyzeWithGemini}
                    disabled={isAnalyzing}
                    className="w-full py-2 px-3 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Analyzing with Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          {documentType === 'test_report'
                            ? 'Scan Test Report with Gemini AI'
                            : 'Scan Prescription with Gemini AI'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Patient Name & Relationship */}
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

              {/* FORM TYPE SPECIFIC FIELDS */}

              {/* 1. TEST REPORT SPECIFIC FORM */}
              {documentType === 'test_report' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#17201D] mb-1">
                        Test / Report Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Complete Blood Count (CBC)"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17201D] mb-1">
                        Diagnostic Lab / Hospital
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Quest Diagnostics"
                        value={labName}
                        onChange={(e) => setLabName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#17201D] mb-1">
                        Report Date
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {/* Extracted Test Parameter Items */}
                  <div className="space-y-2.5 bg-purple-50/50 p-3 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-700" />
                        <span>Test Parameters & Results</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <input
                        type="text"
                        placeholder="Parameter (e.g. Hemoglobin)"
                        value={paramInput}
                        onChange={(e) => setParamInput(e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 14.2)"
                        value={valInput}
                        onChange={(e) => setValInput(e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Unit (g/dL)"
                        value={unitInput}
                        onChange={(e) => setUnitInput(e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddTestResult}
                        className="px-2.5 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    {testResults.length > 0 && (
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {testResults.map((tr, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-100 text-xs"
                          >
                            <div>
                              <span className="font-bold text-[#17201D]">{tr.parameter}: </span>
                              <span className="font-extrabold text-purple-900">{tr.value}</span>{' '}
                              <span className="text-[#68736F] text-[11px]">{tr.unit || ''}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTestResult(idx)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 2. MEDICAL VISIT / PRESCRIPTION COMMON FORM */
                <div className="space-y-3">
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

                    {/* Specialty Autocomplete */}
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

                  {/* Clinic & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative" ref={clinicRef}>
                      <label className="block text-xs font-semibold text-[#17201D] mb-1">
                        Hospital / Clinic
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
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17201D] mb-1">
                        {documentType === 'prescription' ? 'Prescription Date' : 'Visit Date'}
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D] focus:outline-none focus:border-[#8F1D2C]"
                      />
                    </div>
                  </div>

                  {/* Additional Medical Visit Fields */}
                  {documentType === 'visit' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#17201D] mb-1">
                          Tests Ordered
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Blood Test, X-Ray"
                          value={testsOrdered}
                          onChange={(e) => setTestsOrdered(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#17201D] mb-1">
                          Follow-up Date
                        </label>
                        <input
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-[#17201D]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Prescribed Medicines Entry */}
                  <div className="space-y-3 bg-[#F8F9F7] p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#17201D] flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-[#8F1D2C]" />
                        <span>Prescribed Medicines</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={medicineInput}
                        onChange={(e) => setMedicineInput(e.target.value)}
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (500mg 3x/day)"
                        value={dosageInput}
                        onChange={(e) => setDosageInput(e.target.value)}
                        className="w-32 sm:w-36 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
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

                    {medicinesList.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {medicinesList.map((m, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Pill className="w-3.5 h-3.5 text-[#8F1D2C] shrink-0" />
                              <div className="min-w-0">
                                <span className="font-bold text-[#17201D] block truncate">{m.name}</span>
                                {m.dosage && <span className="text-[11px] text-[#68736F] block">{m.dosage}</span>}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(idx)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                              title="Remove item"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Diagnosis / Clinical Notes Textarea */}
              <div>
                <label className="block text-xs font-bold text-[#17201D] mb-1">
                  Diagnosis / Clinical Notes & Advice
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Diagnosis details, doctor instructions, dosage schedule, or clinical advice..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-[#17201D] focus:outline-none focus:border-[#8F1D2C] focus:ring-4 focus:ring-[#8F1D2C]/10 leading-relaxed min-h-[120px] resize-y shadow-2xs font-medium placeholder:text-slate-400"
                />
              </div>

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
        title={`${patientName}'s Medical Record`}
        subtitle={doctorName ? `Doctor: ${doctorName}` : testName ? `Test: ${testName}` : undefined}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  )
}
