'use client'

import React from 'react'
import { IMedicalRecord } from '@/lib/api'
import { Calendar, User, Stethoscope, Image as ImageIcon, MapPin } from 'lucide-react'

interface RecordCardProps {
  record: IMedicalRecord
  onClick: (record: IMedicalRecord) => void
}

const relationshipColors: Record<string, string> = {
  Self: 'bg-teal-50 text-teal-700 border-teal-200',
  Father: 'bg-blue-50 text-blue-700 border-blue-200',
  Mother: 'bg-purple-50 text-purple-700 border-purple-200',
  Wife: 'bg-rose-50 text-rose-700 border-rose-200',
  Child: 'bg-amber-50 text-amber-800 border-amber-200',
  Sibling: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
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
      className="group bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-teal-500/50 rounded-xl p-3.5 transition-all cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Header: Patient & Relationship */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-bold text-sm text-slate-900 truncate">
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
          <div className="flex items-center gap-1.5 text-xs text-slate-700 mb-1">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate font-medium">
              {record.doctorName || 'Doctor unspecified'}
              {record.doctorSpecialty ? ` (${record.doctorSpecialty})` : ''}
            </span>
          </div>
        )}

        {/* Clinic Location */}
        {record.clinicLocation && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{record.clinicLocation}</span>
          </div>
        )}

        {/* Notes Preview */}
        {record.medicinesOrNotes && (
          <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 rounded px-2 py-1 mb-2 border border-slate-100 font-normal">
            {record.medicinesOrNotes}
          </p>
        )}
      </div>

      {/* Footer: Dates & Thumbnail indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-1 font-medium">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {record.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">
              {record.category}
            </span>
          )}

          {record.imageRef?.url || record.imageRef?.thumbnail ? (
            <div className="w-5 h-5 relative rounded overflow-hidden border border-teal-500/40 shrink-0 bg-slate-100 flex items-center justify-center">
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
