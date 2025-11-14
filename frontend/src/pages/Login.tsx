import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, LogInIcon, UserPlusIcon, ArrowLeftIcon } from 'lucide-react';
import { authService } from '../lib/auth.service'; // Import the auth service

export function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert('Email dan password harus diisi!');
      setLoading(false);
      return;
    }

    if (activeTab === 'signup') {
      if (password !== confirmPassword) {
        alert('Password tidak sama!');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        alert('Password minimal 6 karakter!');
        setLoading(false);
        return;
      }
      // For signup, navigate to onboarding with credentials
      navigate('/onboarding', { state: { email, password } });
      setLoading(false);
      return;
    }

    // Login logic
    try {
      await authService.login(email, password);

      // Redirect to landing page after successful login
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Check if Google script is loaded
      if (typeof window === 'undefined' || !(window as any).google) {
        alert('Google Sign-In belum siap. Mohon tunggu beberapa detik dan coba lagi.');
        setLoading(false);
        return;
      }

      const result: any = await authService.googleSignIn();
      
      if (result.isNewUser) {
        // New user - redirect to onboarding with Google data
        navigate('/onboarding', { 
          state: { 
            email: result.user.email, 
            name: result.user.name,
            photoURL: result.user.photoURL,
            isGoogleAuth: true
          } 
        });
      } else {
        // Existing user - redirect to landing
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Google Sign-In gagal. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0" style={{
      backgroundImage: "url('https://cdn.antaranews.com/cache/1200x800/2023/01/31/WhatsApp-Image-2023-01-30-at-09.03.47.jpeg?w=1200')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E2557]/60 via-[#4A9B9B]/50 to-[#5B7B6F]/60" />
      </div>
      <div className="w-full max-w-sm relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-semibold">Kembali</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Reog Commerce
          </h1>
          <p className="text-white/90 text-base">Pasar Seni & Budaya Reog</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-white/30">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-white/60 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-white/90 text-[#4A9B9B] shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-white/90 text-[#4A9B9B] shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2557] mb-2">
                Email
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B] focus:border-transparent transition-all" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2557] mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B] focus:border-transparent transition-all" 
                  required
                />
              </div>
            </div>

            {/* Confirm Password (Signup only) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-[#2E2557] mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B] focus:border-transparent transition-all" 
                    required
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#2E2557] via-[#4A9B9B] to-[#5B7B6F] text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                'Memproses...'
              ) : activeTab === 'login' ? (
                <>
                  <LogInIcon className="w-5 h-5" />
                  Masuk ke Akun
                </>
              ) : (
                <>
                  <UserPlusIcon className="w-5 h-5" />
                  Daftar Akun
                </>
              )}
            </button>
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Google Auth Button (Placeholder for future implementation) */}
            <button 
              type="button"
              onClick={handleGoogleAuth}
              className="w-full border-2 border-[#2E2557] text-[#2E2557] py-4 rounded-xl font-bold hover:bg-[#2E2557] hover:text-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {activeTab === 'login' ? 'Masuk' : 'Daftar'} dengan Google
            </button>
            
            {/* Hidden div for Google Sign-In button render */}
            <div id="google-signin-button" className="hidden"></div>
          </form>

          {activeTab === 'signup' && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Dengan mendaftar, Anda menyetujui{' '}
              <span className="text-[#4A9B9B] font-semibold cursor-pointer">
                Syarat & Ketentuan
              </span>{' '}
              kami
            </p>
          )}
        </div>

        <p className="text-center text-white/80 text-sm mt-6">
          Jelajahi dan beli produk serta event Reog terbaik
        </p>
      </div>
    </div>;
}
