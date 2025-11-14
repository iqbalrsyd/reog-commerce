import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { CheckCircleIcon, UserIcon, MapPinIcon, TagIcon } from 'lucide-react';
import { authService } from '../lib/auth.service'; // Import the auth service

export function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation(); // Get location object to access state
  const { email, password } = location.state || {}; // Extract email and password from state

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'Mahasiswa', icon: '🎓', color: 'from-blue-500 to-blue-600' },
    { value: 'Umum', icon: '👤', color: 'from-gray-500 to-gray-600' },
    { value: 'Seniman', icon: '🎨', color: 'from-purple-500 to-purple-600' },
    { value: 'Pengrajin', icon: '🛠️', color: 'from-amber-500 to-amber-600' },
    { value: 'Kolektor', icon: '💎', color: 'from-emerald-500 to-emerald-600' },
    { value: 'Penyelenggara Event', icon: '🎪', color: 'from-pink-500 to-pink-600' },
    { value: 'Lainnya', icon: '✨', color: 'from-indigo-500 to-indigo-600' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.origin || !formData.category) {
      alert('Semua field harus diisi!');
      return;
    }

    if (!email || !password) {
      alert('Email dan password tidak ditemukan. Silakan coba login/daftar ulang.');
      navigate('/login'); // Redirect to login if credentials are missing
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        email,
        password,
        name: formData.name,
        origin: formData.origin,
        category: formData.category,
        // phoneNumber can be added if collected in onboarding
      };

      await authService.register(registrationData);

      // Show success and redirect
      setStep(4);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: "url('https://cdn.antaranews.com/cache/1200x800/2023/01/31/WhatsApp-Image-2023-01-30-at-09.03.47.jpeg?w=1200')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E2557]/60 via-[#4A9B9B]/50 to-[#5B7B6F]/60" />
      </div>

      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 border-2 border-white/30">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? 'w-12 bg-[#4A9B9B]' : 'w-8 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E97DB4] to-[#C75B8A] rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Selamat Datang! 🎉
              </h2>
              <p className="text-gray-600">
                Mari lengkapi profil Anda untuk pengalaman yang lebih personal
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#4A9B9B] focus:ring-2 focus:ring-[#4A9B9B]/20 outline-none transition-all"
              />
            </div>

            <button
              onClick={() => formData.name && setStep(2)}
              disabled={!formData.name || loading}
              className="w-full bg-gradient-to-r from-[#4A9B9B] to-[#3a8080] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4A9B9B] to-[#3a8080] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Dari Mana Anda?
              </h2>
              <p className="text-gray-600">
                Bantu kami mengenal Anda lebih baik
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tempat Asal
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                placeholder="Kota/Kabupaten asal"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#4A9B9B] focus:ring-2 focus:ring-[#4A9B9B]/20 outline-none transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kembali
              </button>
              <button
                onClick={() => formData.origin && setStep(3)}
                disabled={!formData.origin || loading}
                className="flex-1 bg-gradient-to-r from-[#4A9B9B] to-[#3a8080] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E97DB4] to-[#C75B8A] rounded-full flex items-center justify-center mx-auto mb-4">
                <TagIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Kategori Anda
              </h2>
              <p className="text-gray-600">
                Pilih yang paling sesuai dengan Anda
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleChange('category', cat.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.category === cat.value
                      ? 'border-[#4A9B9B] bg-[#4A9B9B]/10 shadow-lg transform scale-[0.98]'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {cat.value}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.category || loading}
                className="flex-1 bg-gradient-to-r from-[#4A9B9B] to-[#3a8080] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mendaftar...' : 'Selesai'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Akun Berhasil Dibuat! 🎊
            </h2>
            <p className="text-gray-600 mb-4">
              Selamat bergabung di ReogCommerce
            </p>
            <div className="animate-pulse text-[#4A9B9B] font-semibold">
              Mengalihkan ke profil...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
