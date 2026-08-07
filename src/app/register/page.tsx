'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { UserPlus, Mail, Lock, User as UserIcon, Loader2, ArrowRight, LogIn } from 'lucide-react'

export default function RegisterPage() {
  const { user, loading, registerWithEmail, loginWithGoogle } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

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
      router.push('/dashboard')
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
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8F1D2C]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#17201D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Branding Logo */}
        <div className="w-16 h-16 relative mx-auto rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="MedicoDocs Logo"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#17201D]">
            Create Account on Medico<span className="text-[#8F1D2C]">Docs</span>
          </h2>
          <p className="text-xs font-semibold text-[#68736F] mt-1">
            Start organizing your personal & family medical records
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200 rounded-2xl space-y-6">
          {error && (
            <div className="p-3 bg-[#F8E9EC] border border-[#8F1D2C]/30 rounded-xl text-xs text-[#8F1D2C] font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17201D] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17201D] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17201D] mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17201D] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[#68736F] font-semibold">Or</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#17201D] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-[#20A878]" />
            <span>Continue with Google</span>
          </button>

          <div className="pt-2 text-center text-xs text-[#68736F]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#8F1D2C] hover:underline inline-flex items-center gap-1"
            >
              <span>Sign in</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
