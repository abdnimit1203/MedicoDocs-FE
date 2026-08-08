'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import { Footer } from '@/components/layout/Footer'
import { ShieldCheck, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'

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

export default function LoginPage() {
  const { user, authInitializing, loginWithEmail, loginWithGoogle } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
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

    if (!email.trim() || !password) {
      const errText = 'Please enter your email and password.'
      setError(errText)
      toast.error(errText)
      return
    }

    setIsSubmitting(true)
    try {
      await loginWithEmail(email.trim(), password)
      toast.success('Signed in successfully!')
      router.replace('/dashboard')
    } catch (err: any) {
      const msg = err.message || ''
      let userMsg = 'Failed to sign in. Please try again.'
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        userMsg = 'Invalid email or password. Please check your credentials.'
      }
      setError(userMsg)
      toast.error(userMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await loginWithGoogle()
      toast.success('Signed in with Google!')
      router.replace('/dashboard')
    } catch (err: any) {
      const msg = err.message || 'Google Sign-In failed.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#17201D] font-sans flex flex-col justify-between items-center w-full max-w-full overflow-x-hidden">
      <div className="flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-6 w-full">
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

        {/* Main Card */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-[#F8E9EC] text-[#8F1D2C] rounded-full mx-auto flex items-center justify-center border border-[#8F1D2C]/10 shadow-xs relative">
              <ShieldCheck className="w-10 h-10 text-[#8F1D2C]" />
              <div className="w-2.5 h-2.5 bg-[#20A878] rounded-full absolute bottom-1 right-2 border-2 border-white" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#17201D] tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-[#68736F] font-medium mt-1">
                Log in to your account to continue.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-[#F8E9EC] border border-[#8F1D2C]/30 rounded-2xl text-xs text-[#8F1D2C] font-semibold text-center">
              {error}
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-[#17201D] placeholder:text-slate-400 focus:outline-none focus:border-[#8F1D2C] focus:ring-4 focus:ring-[#8F1D2C]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#8F1D2C] p-1 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#68736F] font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[#8F1D2C] focus:ring-[#8F1D2C]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => toast.success('Password reset link can be sent to your email.')}
                className="text-xs font-bold text-[#68736F] hover:text-[#8F1D2C] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#8F1D2C] hover:bg-[#741522] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-[#68736F] font-medium text-[11px]">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3 bg-white hover:bg-slate-50 text-[#17201D] font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5"
          >
            <GoogleLogo className="w-4 h-4 shrink-0" />
            <span>Continue with Google</span>
          </button>

          <div className="pt-2 text-center text-xs text-[#68736F] font-medium">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-bold text-[#8F1D2C] hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
