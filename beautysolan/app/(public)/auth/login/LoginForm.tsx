'use client';

import { useActionState } from 'react';
import { login } from '@/actions/authActions';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    error: '',
  });

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-[#FDF7F8] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side Aesthetic Editorial Image */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="polaroid-frame rotate-[3deg]">
            <div className="relative h-[440px] rounded overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80"
                alt="Beauty Salon Luxury Experience"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="pt-3 text-center">
              <span className="font-script text-3xl text-[#B8737D]">Welcome Back</span>
              <p className="text-[10px] uppercase tracking-widest text-[#6B4D54] mt-0.5">
                Accra Luxury Salon
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Login Card */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8D5D8] shadow-[0_15px_35px_rgba(184,115,125,0.1)]">
          <div className="text-center mb-8">
            <span className="font-script text-4xl text-[#B8737D]">Exclusive Access</span>
            <h1 className="font-display text-3xl font-semibold text-[#3D262B] mt-0.5">
              Sign In to Your Account
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-2 font-medium">
              Access your appointment schedule & member privileges.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs font-medium border border-red-200 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8288]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-[#E8D5D8] bg-[#FDF7F8] focus:ring-2 focus:ring-[#B8737D] focus:border-[#B8737D] outline-none text-xs text-[#3D262B]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B]">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-[11px] text-[#B8737D] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8288]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-[#E8D5D8] bg-[#FDF7F8] focus:ring-2 focus:ring-[#B8737D] focus:border-[#B8737D] outline-none text-xs text-[#3D262B]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="btn-rose-gold w-full py-4 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-[#6B4D54] mt-6">
              Don't have an account yet?{' '}
              <Link
                href="/auth/register"
                className="text-[#B8737D] font-semibold hover:underline"
              >
                Create Account Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
