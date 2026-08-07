'use client';

import { FileText, Shield, Sparkles, FolderPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Bar */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">
              MedicoDocs
            </h1>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">by AB</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Encrypted Local
          </span>
        </div>
      </header>

      {/* Quick Summary / Status Banner */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="medico-card p-5 bg-gradient-to-r from-sky-50 to-teal-50 dark:from-slate-900 dark:to-slate-800/80 border-sky-100 dark:border-slate-800"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Personal & Family Health Vault
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
              Quickly capture, organize, and retrieve prescription records for your family.
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-sky-500 shrink-0" />
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="medico-card medico-card-hover p-4 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer border-sky-200 dark:border-slate-700"
        >
          <div className="p-3 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300">
            <FolderPlus className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Add Record
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="medico-card medico-card-hover p-4 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer border-teal-200 dark:border-slate-700"
        >
          <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-300">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            View Documents
          </span>
        </motion.button>
      </div>

      {/* Empty State / Status */}
      <div className="medico-card p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            System Initialization Ready
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Milestone 1 project structure initialized. Local API connection point configured.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
