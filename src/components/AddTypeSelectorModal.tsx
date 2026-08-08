'use client'

import React from 'react'
import { DocumentType } from '@/lib/api'
import { X, Stethoscope, Pill, Activity, ChevronRight } from 'lucide-react'

interface AddTypeSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: DocumentType) => void
}

export function AddTypeSelectorModal({
  isOpen,
  onClose,
  onSelectType,
}: AddTypeSelectorModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#17201D]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-xl p-5 space-y-4 text-[#17201D] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-base text-[#17201D]">
              What would you like to add?
            </h2>
            <p className="text-xs text-[#68736F] font-medium mt-0.5">
              Choose the type of health record to create
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#68736F] hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Option Selector Cards */}
        <div className="space-y-2.5">
          {/* Option 1: Medical Visit */}
          <button
            type="button"
            onClick={() => onSelectType('visit')}
            className="w-full p-3.5 bg-white hover:bg-[#F8F9F7] border border-slate-200 hover:border-[#8F1D2C]/40 rounded-2xl transition-all text-left flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center font-bold shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#17201D] group-hover:text-[#8F1D2C] transition-colors">
                  Medical Visit
                </h3>
                <p className="text-[11px] text-[#68736F]">
                  Doctor consultation, diagnosis, & notes
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#8F1D2C] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Option 2: Prescription */}
          <button
            type="button"
            onClick={() => onSelectType('prescription')}
            className="w-full p-3.5 bg-white hover:bg-[#F8F9F7] border border-slate-200 hover:border-[#8F1D2C]/40 rounded-2xl transition-all text-left flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F2] text-[#3B988E] flex items-center justify-center font-bold shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#17201D] group-hover:text-[#3B988E] transition-colors">
                  Prescription
                </h3>
                <p className="text-[11px] text-[#68736F]">
                  Rx document upload & Gemini AI scan
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#3B988E] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Option 3: Test Report */}
          <button
            type="button"
            onClick={() => onSelectType('test_report')}
            className="w-full p-3.5 bg-white hover:bg-[#F8F9F7] border border-slate-200 hover:border-[#8F1D2C]/40 rounded-2xl transition-all text-left flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#17201D] group-hover:text-purple-700 transition-colors">
                  Test Report
                </h3>
                <p className="text-[11px] text-[#68736F]">
                  Lab & diagnostic report AI extraction
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}
