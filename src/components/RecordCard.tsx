'use client'

import React from 'react'
import { IMedicalRecord } from '@/lib/api'
import { Calendar, User, Stethoscope, MapPin, Image as ImageIcon } from 'lucide-react'

interface RecordCardProps {
  record: IMedicalRecord
  onClick: (record: IMedicalRecord) => void
}

const relationshipColors: Record<string, string> = {
  Self: 'bg-[#F8E9EC] text-[#8F1D2C] border-[#8F1D2C]/30',
  Father: 'bg-blue-50 text-blue-800 border-blue-200',
  Mother: 'bg-purple-50 text-purple-800 border-purple-200',
  Wife: 'bg-rose-50 text-rose-800 border-rose-200',
  Child: 'bg-amber-50 text-amber-800 border-amber-200',
  Sibling: 'bg-[#E8F7F0] text-[#20A878] border-[#20A878]/30',
  Other: 'bg-slate-100 text-[#68736F] border-slate-200',
}

export function RecordCard({ record, onClick }: RecordCardProps) {
  const formattedDate = record.visitDate
    ? new Date(record.visitDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : record.prescriptionDate
    ? new Date(record.prescriptionDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(record.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

  const relColor = relationshipColors[record.relationship] || relationshipColors.Other

  return (
    <div
      onClick={() => onClick(record)}
      className="group bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-[#8F1D2C]/40 rounded-xl p-3.5 transition-all cursor-pointer shadow-xs relative overflow-hidden flex flex-col justify-between w-full max-w-full min-w-0"
    >
      <div className="min-w-0 w-full">
        {/* Card Header: Patient & Relationship */}
        <div className="flex items-center justify-between gap-2 mb-2 w-full">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <User className="w-3.5 h-3.5 text-[#68736F] shrink-0" />
            <span className="font-bold text-sm text-[#17201D] truncate">
              {record.patientName}
            </span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${relColor} shrink-0`}
          >
            {record.relationship}
          </span>
        </div>

        {/* Doctor & Specialty Info */}
        {(record.doctorName || record.doctorSpecialty) && (
          <div className="flex items-center gap-1.5 text-xs text-[#17201D] mb-1 min-w-0">
            <Stethoscope className="w-3.5 h-3.5 text-[#8F1D2C] shrink-0" />
            <span className="truncate font-semibold min-w-0">
              {record.doctorName || 'Doctor unspecified'}
              {record.doctorSpecialty ? ` (${record.doctorSpecialty})` : ''}
            </span>
          </div>
        )}

        {/* Clinic Location */}
        {record.clinicLocation && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#68736F] mb-1.5 min-w-0">
            <MapPin className="w-3 h-3 text-[#68736F]/70 shrink-0" />
            <span className="truncate min-w-0">{record.clinicLocation}</span>
          </div>
        )}

        {/* Notes Preview */}
        {record.medicinesOrNotes && (
          <p className="text-[11px] text-[#68736F] line-clamp-2 bg-[#F8F9F7] rounded-lg px-2 py-1 mb-2 border border-slate-200 min-w-0">
            {record.medicinesOrNotes}
          </p>
        )}
      </div>

      {/* Footer: Dates & Thumbnail indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-[#68736F] w-full">
        <div className="flex items-center gap-1 font-medium min-w-0">
          <Calendar className="w-3 h-3 text-[#68736F]/70 shrink-0" />
          <span className="truncate">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {record.category && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#17201D]">
              {record.category}
            </span>
          )}

          {record.imageRef?.url || record.imageRef?.thumbnail ? (
            <div className="w-5 h-5 relative rounded overflow-hidden border border-[#8F1D2C]/30 shrink-0 bg-slate-100 flex items-center justify-center">
              <img
                src={record.imageRef.thumbnail || record.imageRef.url}
                alt="Document thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
          )}
        </div>
      </div>
    </div>
  )
}
