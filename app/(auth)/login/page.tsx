'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const credentials = {
      email,
      password,
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Network error:', error);
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
            sizes="256px"
            loading="eager"
            className="object-contain"
          />
        </div>
      </div>

     
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-[#3a2e2b] mb-2">
              Welcome Back
            </h2>
            <p className="text-xs tracking-widest text-[#927e7a] uppercase">
              Continue your journal journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
           
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-[#c5b4b1]" />
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
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
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

           
            <div className="flex justify-end text-xs">
              <a href="#" className="text-[#cc9b91] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

          
            <button 
              type="submit" 
              className="w-full mt-2 bg-[#cc9b91] hover:bg-[#bc897f] text-white text-sm font-medium rounded-full py-4 px-6 flex justify-center items-center gap-2 shadow-md shadow-[#cc9b91]/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>LOGIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

     
          <div className="text-center mt-8 text-xs text-[#927e7a]">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-[#cc9b91] hover:underline font-semibold ml-1">
              Create account
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
