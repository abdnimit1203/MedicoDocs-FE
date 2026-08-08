'use client'

import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6'
import { Bot, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white/90 backdrop-blur-md border-t border-slate-200 py-6 px-4 text-[#68736F] relative z-20 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span>Developed with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <Bot className="w-3.5 h-3.5 text-[#3B988E] animate-bounce" />
          <span>by</span>
          <Link
            href="https://abdullah-portfolio-frontend.netlify.app/"
            target="_blank"
            className="font-bold text-[#8F1D2C] hover:text-[#741522] transition-colors"
          >
            Abdullah Ibne Ali
          </Link>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span>
            © {currentYear} <span className="font-extrabold text-[#17201D]">MedicoDocs by AB</span>. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-5 text-slate-500">
          <Link
            href="https://www.facebook.com/abd.nimit"
            target="_blank"
            className="hover:text-[#8F1D2C] hover:scale-110 transition-all duration-300"
            title="Facebook Profile"
          >
            <FaFacebook className="w-4 h-4" />
          </Link>
          <Link
            href="https://www.instagram.com/abd_nimit"
            target="_blank"
            className="hover:text-[#8F1D2C] hover:scale-110 transition-all duration-300"
            title="Instagram Profile"
          >
            <FaInstagram className="w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/abdnimit1203"
            target="_blank"
            className="hover:text-[#8F1D2C] hover:scale-110 transition-all duration-300"
            title="GitHub Profile"
          >
            <FaGithub className="w-4 h-4" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/abdullah-ibne-ali"
            target="_blank"
            className="hover:text-[#8F1D2C] hover:scale-110 transition-all duration-300"
            title="LinkedIn Profile"
          >
            <FaLinkedin className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
