'use client'

import React, { useState, useMemo } from 'react'
import { IMedicalRecord } from '@/lib/api'
import { Calendar, ChevronRight, Stethoscope, User } from 'lucide-react'

interface MedicalTimelineProps {
  records: IMedicalRecord[]
  onSelectRecord: (record: IMedicalRecord) => void
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function MedicalTimeline({ records, onSelectRecord }: MedicalTimelineProps) {
  // Extract unique years from records
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>()
    records.forEach((r) => {
      const dateStr = r.visitDate || r.prescriptionDate || r.createdAt
      if (dateStr) {
        const year = new Date(dateStr).getFullYear()
        if (!isNaN(year)) yearsSet.add(year)
      }
    })
    const currentYear = new Date().getFullYear()
    yearsSet.add(currentYear)
    return Array.from(yearsSet).sort((a, b) => b - a)
  }, [records])

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0] || new Date().getFullYear()
  )

  // Group records for selected year by month
  const monthGroupedRecords = useMemo(() => {
    const grouped: Record<number, IMedicalRecord[]> = {}
    for (let m = 0; m < 12; m++) grouped[m] = []

    records.forEach((r) => {
      const dateStr = r.visitDate || r.prescriptionDate || r.createdAt
      if (!dateStr) return
      const date = new Date(dateStr)
      if (date.getFullYear() === selectedYear) {
        const m = date.getMonth()
        grouped[m].push(r)
      }
    })

    return grouped
  }, [records, selectedYear])

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
      {/* Timeline Header & Year Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
            Medical History Timeline
          </h3>
        </div>

        {/* Year Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all shrink-0 ${
                selectedYear === year
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline Spine */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {MONTH_NAMES.map((monthName, monthIdx) => {
          const monthRecords = monthGroupedRecords[monthIdx] || []
          const hasRecords = monthRecords.length > 0

          return (
            <div key={monthName} className="relative group">
              {/* Month Spine Bullet Marker */}
              <div
                className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 transition-all ${
                  hasRecords
                    ? 'bg-teal-400 border-slate-900 ring-4 ring-teal-500/20'
                    : 'bg-slate-900 border-slate-800'
                }`}
              />

              <div className="flex items-start gap-3">
                {/* Month Name */}
                <span
                  className={`text-xs font-bold w-9 pt-0.5 ${
                    hasRecords ? 'text-teal-300 font-mono' : 'text-slate-600'
                  }`}
                >
                  {monthName}
                </span>

                {/* Event Markers for Month */}
                <div className="flex-1 min-w-0">
                  {hasRecords ? (
                    <div className="flex flex-wrap gap-1.5">
                      {monthRecords.map((rec) => (
                        <button
                          key={rec._id}
                          onClick={() => onSelectRecord(rec)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-xs text-slate-200 transition-all text-left group/btn"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                          <span className="font-medium truncate max-w-[120px] sm:max-w-[160px]">
                            {rec.patientName} ({rec.doctorName || rec.category})
                          </span>
                          <ChevronRight className="w-3 h-3 text-slate-600 group-hover/btn:text-teal-400 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-4 border-b border-dashed border-slate-800/40" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
