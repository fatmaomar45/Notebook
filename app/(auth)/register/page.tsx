'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoggedIn } = useApp();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return null;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      register(email);
      router.replace('/');
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fdfaf7] text-[#3a2e2b]">
      <div className="hidden md:flex md:w-1/2 bg-[#cc9b91] flex-col justify-center items-center p-12">
        <h1 className="text-white text-4xl font-serif mb-8 italic tracking-wide">
          Becoming Her
        </h1>
        <div className="relative w-64 h-64 transition-transform duration-300 hover:scale-105 flex justify-center items-center">
          <Image
            src="/The_most_beautiful_pictures-removebg-preview.png"
            alt="Black Roses"
            fill
            sizes="(max-width: 768px) 20rem, 28rem"
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-[#3a2e2b] mb-2">
              Create Account
            </h2>
            <p className="text-xs tracking-widest text-[#927e7a] uppercase">
              Start your journal journey
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
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
                minLength={6}
                autoComplete="new-password"
                className="w-full pl-12 pr-12 py-3.5 border border-[#eadeda] rounded-xl bg-[#faf6f4] text-sm focus:outline-none focus:border-[#cc9b91] focus:bg-white focus:ring-4 focus:ring-[#cc9b91]/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#c5b4b1] hover:text-[#927e7a] focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-[#c5b4b1]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full pl-12 pr-12 py-3.5 border border-[#eadeda] rounded-xl bg-[#faf6f4] text-sm focus:outline-none focus:border-[#cc9b91] focus:bg-white focus:ring-4 focus:ring-[#cc9b91]/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-[#c5b4b1] hover:text-[#927e7a] focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#cc9b91] hover:bg-[#bc897f] text-white text-sm font-medium rounded-full py-4 px-6 flex justify-center items-center gap-2 shadow-md shadow-[#cc9b91]/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Creating...' : 'CREATE ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-8 text-xs text-[#927e7a]">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#cc9b91] hover:underline font-semibold ml-1"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
