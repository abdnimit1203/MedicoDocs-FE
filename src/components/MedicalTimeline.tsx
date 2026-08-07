'use client'

import React, { useState, useMemo } from 'react'
import { IMedicalRecord } from '@/lib/api'
import { Calendar, ChevronRight } from 'lucide-react'

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
    <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs space-y-4 w-full max-w-full min-w-0">
      {/* Timeline Header & Year Selector */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2 w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Calendar className="w-4 h-4 text-[#8F1D2C] shrink-0" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#17201D] truncate">
            Medical History Timeline
          </h3>
        </div>

        {/* Year Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] sm:max-w-[200px] no-scrollbar shrink-0">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all shrink-0 ${
                selectedYear === year
                  ? 'bg-[#8F1D2C] text-white border-[#8F1D2C] font-bold shadow-xs'
                  : 'bg-white text-[#68736F] border-slate-200 hover:text-[#17201D]'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline Spine */}
      <div className="relative pl-5 sm:pl-6 space-y-4 before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 w-full min-w-0">
        {MONTH_NAMES.map((monthName, monthIdx) => {
          const monthRecords = monthGroupedRecords[monthIdx] || []
          const hasRecords = monthRecords.length > 0

          return (
            <div key={monthName} className="relative group w-full min-w-0">
              {/* Month Spine Bullet Marker */}
              <div
                className={`absolute -left-[20px] sm:-left-[21px] top-1 w-3 h-3 rounded-full border-2 transition-all ${
                  hasRecords
                    ? 'bg-[#20A878] border-white ring-4 ring-[#E8F7F0]'
                    : 'bg-white border-slate-300'
                }`}
              />

              <div className="flex items-start gap-2 sm:gap-3 w-full min-w-0">
                {/* Month Name */}
                <span
                  className={`text-xs font-bold w-8 sm:w-9 pt-0.5 shrink-0 ${
                    hasRecords ? 'text-[#8F1D2C] font-mono' : 'text-[#68736F]'
                  }`}
                >
                  {monthName}
                </span>

                {/* Event Markers for Month */}
                <div className="flex-1 min-w-0 w-full">
                  {hasRecords ? (
                    <div className="flex flex-wrap gap-1.5 w-full">
                      {monthRecords.map((rec) => (
                        <button
                          key={rec._id}
                          onClick={() => onSelectRecord(rec)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-[#F8E9EC] border border-slate-200 hover:border-[#8F1D2C]/40 text-xs text-[#17201D] transition-all text-left group/btn shadow-xs max-w-full"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8F1D2C] shrink-0" />
                          <span className="font-semibold truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[200px]">
                            {rec.patientName} ({rec.doctorName || rec.category})
                          </span>
                          <ChevronRight className="w-3 h-3 text-[#68736F] group-hover/btn:text-[#8F1D2C] transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-4 border-b border-dashed border-slate-100" />
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
