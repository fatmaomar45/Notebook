'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useApp } from '@/app/context/AppContext';
import LoginButton from '@/app/components/login-button';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFlow />
    </Suspense>
  );
}

function LoginFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const reason = searchParams.get('reason');
  const { login, isLoggedIn } = useApp();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' || isLoggedIn) {
      router.replace(nextPath);
    }
  }, [isLoggedIn, status, router, nextPath]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    reason === 'timeout' ? 'Your session timed out. Please log in again.' : null
  );
  const [loading, setLoading] = useState(false);

  if (isLoggedIn || status === 'authenticated') {
    return null;
  }

  const submitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (!email || !password) {
        setError('Email and password are required.');
        return;
      }
      login(email);
      router.replace(nextPath);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fdfaf7] text-[#3a2e2b]">
      {/* Left Branding Panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#cc9b91] flex-col justify-center items-center p-12">
        <h1 className="text-white text-6xl font-serif mb-12 italic tracking-wide">Becoming Her</h1>
        <div className="relative w-[28rem] h-[28rem] transition-transform duration-300 hover:scale-105 flex justify-center items-center">
          <Image src="/The_most_beautiful_pictures-removebg-preview.png" alt="Black Roses" fill sizes="(max-width: 768px) 20rem, 28rem" className="object-contain w-full h-full" />
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="font-serif text-5xl font-medium tracking-tight text-[#3a2e2b] mb-3">
              Welcome Back
            </h2>
            <p className="text-sm tracking-widest text-[#927e7a] uppercase">
              Continue your journal journey
            </p>
          </div>

          {info && (
            <div className="mb-4 p-3 text-xs rounded-lg bg-[#f3e9e6] text-[#7a5a55] border border-[#e2cdc8]">{info}</div>
          )}
          {error && (
            <div className="mb-4 p-3 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200">{error}</div>
          )}

          {/* Regular Credentials Form */}
          <form onSubmit={submitCredentials} className="space-y-5">
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-[#c5b4b1]" />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3.5 border border-[#eadeda] rounded-xl bg-[#faf6f4] text-sm focus:outline-none focus:border-[#cc9b91] focus:bg-white focus:ring-4 focus:ring-[#cc9b91]/10 transition-all duration-200"
              />
            </div>

            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-[#c5b4b1]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-12 py-3.5 border border-[#eadeda] rounded-xl bg-[#faf6f4] text-sm focus:outline-none focus:border-[#cc9b91] focus:bg-white focus:ring-4 focus:ring-[#cc9b91]/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#c5b4b1] hover:text-[#927e7a] focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#cc9b91] hover:bg-[#bc897f] disabled:opacity-60 text-white text-sm font-medium rounded-full py-4 px-6 flex justify-center items-center gap-2 shadow-md shadow-[#cc9b91]/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{loading ? 'LOGGING IN\u2026' : 'LOGIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Luxury-Styled Divider line */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#eadeda]"></div>
            </div>
            <span className="relative bg-[#fdfaf7] px-4 text-xs font-medium uppercase tracking-widest text-[#927e7a]">
              or
            </span>
          </div>

          {/* Social Sign-In Area */}
          <div className="flex justify-center w-full">
            <LoginButton />
          </div>

          <div className="text-center mt-8 text-xs text-[#927e7a]">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-[#cc9b91] hover:underline font-semibold ml-1">Create account</a>
          </div>
        </div>
      </div>
    </div>
  );
}
