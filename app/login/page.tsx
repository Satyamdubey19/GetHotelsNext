'use client';

import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Welcome Section */}
          <div className="hidden md:flex flex-col justify-center space-y-8">
            <div>
              <Link href="/" className="inline-block mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-2xl font-bold text-white shadow-xl hover:shadow-2xl transition transform hover:scale-105">
                  GH
                </div>
              </Link>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">Back</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Sign in to your GetHotels account and continue exploring amazing destinations
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-xl group-hover:bg-sky-200 transition transform group-hover:scale-110">
                  🏨
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Find Your Perfect Stay</p>
                  <p className="text-sm text-slate-500">Thousands of hotels worldwide</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-xl group-hover:bg-sky-200 transition transform group-hover:scale-110">
                  ✈️
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Plan Exciting Tours</p>
                  <p className="text-sm text-slate-500">Curated travel experiences</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-xl group-hover:bg-sky-200 transition transform group-hover:scale-110">
                  💰
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Best Prices Guaranteed</p>
                  <p className="text-sm text-slate-500">Get exclusive deals and discounts</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>
              <p className="text-slate-700 font-medium mb-3">
                "GetHotels made my vacation planning so easy and affordable. Highly recommended!"
              </p>
              <p className="text-sm text-slate-500">Sarah Johnson • Travel Enthusiast</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100 backdrop-blur-sm bg-opacity-95">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
                <p className="text-slate-600">Access your GetHotels account</p>
              </div>

              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
