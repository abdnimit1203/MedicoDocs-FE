'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { user, loading, loginWithEmail, loginWithGoogle } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)
    try {
      await loginWithEmail(email.trim(), password)
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Invalid email or password. Please check your credentials.')
      } else {
        setError(msg || 'Failed to sign in. Please try again.')
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
            Sign in to Medico<span className="text-[#8F1D2C]">Docs</span>
          </h2>
          <p className="text-xs font-semibold text-[#68736F] mt-1">
            Access your secure personal & family medical vault
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
                Email Address
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
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
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
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-bold text-[#8F1D2C] hover:underline inline-flex items-center gap-1"
            >
              <span>Create account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
