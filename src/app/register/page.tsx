'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Lock, Loader2, Plus } from 'lucide-react'

function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

export default function RegisterPage() {
  const { user, authInitializing, registerWithEmail, loginWithGoogle } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && !authInitializing) {
      router.replace('/dashboard')
    }
  }, [user, authInitializing, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!email.trim()) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.')
      return
    }

    setIsSubmitting(true)
    try {
      await registerWithEmail(name.trim(), email.trim(), password)
      router.replace('/dashboard')
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('email-already-in-use')) {
        setError('An account with this email already exists. Please log in.')
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.')
      } else {
        setError(msg || 'Failed to create account. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await loginWithGoogle()
      router.replace('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#17201D] font-sans flex flex-col justify-center items-center py-10 px-4 sm:px-6 w-full max-w-full overflow-x-hidden">
      {/* Top Brand Logo */}
      <Link href="/" className="mb-6 flex items-center gap-2 group transition-transform hover:scale-105">
        <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="MedicoDocs Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>
        <span className="font-extrabold text-sm text-[#17201D]">
          <span className="text-[#8F1D2C]">Medico</span>
          <span className="text-[#3B988E]">Docs</span>
        </span>
      </Link>

      {/* Main Reference Card */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 w-full max-w-sm space-y-6">
        {/* Top Circular User + Badge Header (Matching reference right screen!) */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-[#E6F4F2] text-[#3B988E] rounded-full mx-auto flex items-center justify-center border border-[#3B988E]/10 shadow-xs relative">
            <User className="w-10 h-10 text-[#3B988E]" />
            <div className="w-6 h-6 bg-[#8F1D2C] text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#17201D] tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-[#68736F] font-medium mt-1">
              Sign up to get started with your dashboard.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-[#F8E9EC] border border-[#8F1D2C]/30 rounded-2xl text-xs text-[#8F1D2C] font-semibold text-center">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#17201D]">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C] focus:ring-4 focus:ring-[#8F1D2C]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#17201D]">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C] focus:ring-4 focus:ring-[#8F1D2C]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#17201D]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C] focus:ring-4 focus:ring-[#8F1D2C]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#17201D]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C] focus:ring-4 focus:ring-[#8F1D2C]/10 transition-all"
              />
            </div>
          </div>

          {/* Primary CTA Create Account */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-[#68736F] font-medium text-[11px]">Or</span>
          </div>
        </div>

        {/* Google Login with Official Multi-Color Google Logo */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-3 bg-white hover:bg-slate-50 text-[#17201D] font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5"
        >
          <GoogleLogo className="w-4 h-4 shrink-0" />
          <span>Continue with Google</span>
        </button>

        {/* Bottom Switch Link */}
        <div className="pt-2 text-center text-xs text-[#68736F] font-medium">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#8F1D2C] hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
