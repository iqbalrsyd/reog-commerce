import React from 'react';
import { Link } from 'react-router-dom';
export function Login() {
  return <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0" style={{
      backgroundImage: "url('https://cdn.antaranews.com/cache/1200x800/2023/01/31/WhatsApp-Image-2023-01-30-at-09.03.47.jpeg?w=1200')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E2557]/60 via-[#4A9B9B]/50 to-[#5B7B6F]/60" />
      </div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Reog Commerce
          </h1>
          <p className="text-white/90 text-base">Pasar Seni & Budaya Reog</p>
        </div>
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-white/50">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2557] mb-2">
                Email
              </label>
              <input type="email" placeholder="nama@email.com" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2557] mb-2">
                Password
              </label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B] focus:border-transparent transition-all" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-[#2E2557] via-[#4A9B9B] to-[#5B7B6F] text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-[1.02]">
              Masuk ke Akun
            </button>
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <button type="button" className="w-full border-2 border-[#2E2557] text-[#2E2557] py-4 rounded-xl font-bold hover:bg-[#2E2557] hover:text-white transition-all transform hover:scale-[1.02]">
              Masuk dengan Google
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#4A9B9B] font-bold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
        <p className="text-center text-white/80 text-sm mt-6">
          Jelajahi dan beli produk serta event Reog terbaik
        </p>
      </div>
    </div>;
}