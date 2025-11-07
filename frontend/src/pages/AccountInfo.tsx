import { useState, useEffect } from 'react';
import { ArrowLeftIcon, SaveIcon, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  origin: string;
  category: string;
}

export function AccountInfo() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    origin: '',
    category: ''
  });

  const categories = [
    'Mahasiswa',
    'Umum',
    'Seniman',
    'Pengrajin',
    'Kolektor',
    'Penyelenggara Event',
    'Lainnya'
  ];

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu');
      navigate('/profile');
      return;
    }

    // Load user data from localStorage
    const savedUser = localStorage.getItem('userAccount');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    } else {
      // No user data, redirect to onboarding
      navigate('/onboarding');
    }
  }, [navigate]);

  const handleSave = () => {
    if (!userData.name || !userData.email || !userData.origin || !userData.category) {
      alert('Semua field harus diisi!');
      return;
    }

    // Save to localStorage
    localStorage.setItem('userAccount', JSON.stringify(userData));
    alert('Informasi akun berhasil disimpan!');
    navigate('/profile');
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">Informasi Akun</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E97DB4] to-[#C75B8A] flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
            {userData.name ? userData.name.charAt(0).toUpperCase() : <UserIcon className="w-12 h-12" />}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E97DB4] focus:ring-2 focus:ring-[#E97DB4]/20 outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E97DB4] focus:ring-2 focus:ring-[#E97DB4]/20 outline-none transition-all"
              />
            </div>

            {/* Origin */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tempat Asal
              </label>
              <input
                type="text"
                value={userData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                placeholder="Kota/Kabupaten asal"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E97DB4] focus:ring-2 focus:ring-[#E97DB4]/20 outline-none transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={userData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E97DB4] focus:ring-2 focus:ring-[#E97DB4]/20 outline-none transition-all"
              >
                <option value="">Pilih kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">ℹ️ Info:</span> Informasi ini akan digunakan untuk personalisasi pengalaman Anda di ReogCommerce.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-[#4A9B9B] to-[#3a8080] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <SaveIcon className="w-5 h-5" />
            Simpan Perubahan
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
