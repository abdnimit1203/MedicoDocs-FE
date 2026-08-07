'use client'

import React from 'react'
import { IMedicalRecord } from '@/lib/api'
import { Calendar, User, Stethoscope, FileText, Image as ImageIcon, MapPin } from 'lucide-react'

interface RecordCardProps {
  record: IMedicalRecord
  onClick: (record: IMedicalRecord) => void
}

const relationshipColors: Record<string, string> = {
  Self: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Father: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Mother: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Wife: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Child: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Sibling: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
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
      className="group bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 rounded-xl p-3.5 transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Header: Patient & Relationship */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-sm text-slate-100 truncate">
              {record.patientName}
            </span>
          </div>

          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${relColor} shrink-0`}
          >
            {record.relationship}
          </span>
        </div>

        {/* Doctor & Specialty Info */}
        {(record.doctorName || record.doctorSpecialty) && (
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
            <Stethoscope className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate font-medium">
              {record.doctorName || 'Doctor unspecified'}
              {record.doctorSpecialty ? ` (${record.doctorSpecialty})` : ''}
            </span>
          </div>
        )}

        {/* Clinic Location */}
        {record.clinicLocation && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{record.clinicLocation}</span>
          </div>
        )}

        {/* Notes Preview */}
        {record.medicinesOrNotes && (
          <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950/40 rounded px-2 py-1 mb-2 border border-slate-800/50">
            {record.medicinesOrNotes}
          </p>
        )}
      </div>

      {/* Footer: Dates & Thumbnail indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {record.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {record.category}
            </span>
          )}

          {record.imageRef?.url || record.imageRef?.thumbnail ? (
            <div className="w-5 h-5 relative rounded overflow-hidden border border-teal-500/40 shrink-0 bg-slate-800 flex items-center justify-center">
              <img
                src={record.imageRef.thumbnail || record.imageRef.url}
                alt="Document thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
          )}
        </div>
      </div>
    </div>
  )
}
