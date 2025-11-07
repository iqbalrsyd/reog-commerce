import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { StoreIcon, MapPinIcon, PhoneIcon, FileTextIcon } from 'lucide-react';

export function CreateOutlet() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'produk',
    description: '',
    location: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpan data outlet (untuk sementara di localStorage)
    localStorage.setItem('outlet', JSON.stringify(formData));
    // Redirect ke dashboard yang sesuai berdasarkan tipe
    if (formData.type === 'produk') {
      navigate('/product-dashboard');
    } else if (formData.type === 'event') {
      navigate('/event-dashboard');
    } else {
      // Default to product dashboard for 'keduanya'
      navigate('/product-dashboard');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2E2557] mb-2">Buat Outlet Baru</h1>
          <p className="text-gray-600 text-sm">
            Lengkapi informasi outlet Anda untuk mulai berjualan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Outlet */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2E2557] mb-2">
              <StoreIcon className="w-4 h-4 text-[#E97DB4]" />
              Nama Outlet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Toko Reog Ponorogo Jaya"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E97DB4] focus:border-transparent"
            />
          </div>

          {/* Tipe Outlet */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2E2557] mb-2">
              <FileTextIcon className="w-4 h-4 text-[#E97DB4]" />
              Tipe Outlet
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E97DB4] focus:border-transparent bg-white"
            >
              <option value="produk">Produk</option>
              <option value="event">Event</option>
              <option value="keduanya">Produk & Event</option>
            </select>
          </div>

          {/* Deskripsi */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2E2557] mb-2">
              <FileTextIcon className="w-4 h-4 text-[#E97DB4]" />
              Deskripsi Outlet
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ceritakan tentang outlet Anda..."
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E97DB4] focus:border-transparent resize-none"
            />
          </div>

          {/* Lokasi */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2E2557] mb-2">
              <MapPinIcon className="w-4 h-4 text-[#E97DB4]" />
              Lokasi
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Ponorogo, Jawa Timur"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E97DB4] focus:border-transparent"
            />
          </div>

          {/* Kontak */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2E2557] mb-2">
              <PhoneIcon className="w-4 h-4 text-[#E97DB4]" />
              Nomor Kontak
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contoh: 08123456789"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E97DB4] focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#E97DB4] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:bg-[#d66b9f]"
            >
              Buat Outlet
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-6 bg-[#4A9B9B]/10 rounded-2xl p-4 border border-[#4A9B9B]/20">
          <p className="text-sm text-[#2E2557]">
            <span className="font-semibold">💡 Tips:</span> Lengkapi informasi outlet dengan detail untuk menarik lebih banyak pembeli
          </p>
        </div>
      </div>
    </div>
  );
}
