'use client';

import { useActionState } from 'react';
import { register } from '@/actions/authActions';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, {
    success: false,
    error: '',
  });

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-[#FDF7F8] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side Editorial Image (Polaroid Style) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="polaroid-frame rotate-[-3deg]">
            <div className="relative h-[480px] rounded overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                alt="Beauty Salon Luxury Experience"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="pt-3 text-center">
              <span className="font-script text-3xl text-[#B8737D]">Beauty Technicians</span>
              <p className="text-[10px] uppercase tracking-widest text-[#6B4D54] mt-0.5">
                Accra Luxury Salon
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Sign Up Card */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8D5D8] shadow-[0_15px_35px_rgba(184,115,125,0.1)]">
          <div className="text-center mb-8">
            <span className="font-script text-4xl text-[#B8737D]">Exclusive Clientele</span>
            <h1 className="font-display text-3xl font-semibold text-[#3D262B] mt-0.5">
              Create Your Account
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-2 font-medium">
              Join Beauty Technicians for bespoke pampering & easy online booking.
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
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8288]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-[#E8D5D8] bg-[#FDF7F8] focus:ring-2 focus:ring-[#B8737D] focus:border-[#B8737D] outline-none text-xs text-[#3D262B]"
                  placeholder="e.g. Ama Mensah"
                />
              </div>
            </div>

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
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8288]">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-[#E8D5D8] bg-[#FDF7F8] focus:ring-2 focus:ring-[#B8737D] focus:border-[#B8737D] outline-none text-xs text-[#3D262B]"
                  placeholder="+233 24 000 0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8288]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-[#E8D5D8] bg-[#FDF7F8] focus:ring-2 focus:ring-[#B8737D] focus:border-[#B8737D] outline-none text-xs text-[#3D262B]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8288]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-[#E8D5D8] bg-[#FDF7F8] focus:ring-2 focus:ring-[#B8737D] focus:border-[#B8737D] outline-none text-xs text-[#3D262B]"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Prominent Rose Gold Create Account Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="btn-rose-gold w-full py-4 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Account Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-[#6B4D54] mt-6">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-[#B8737D] font-semibold hover:underline"
              >
                Sign In Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
