import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { PackageIcon, ShoppingBagIcon, TrendingUpIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

export function ProductDashboard() {
  const navigate = useNavigate();
  const outlet = JSON.parse(localStorage.getItem('outlet') || '{}');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const productCategories = [
    'Semua',
    'Topeng',
    'Kostum',
    'Wayang',
    'Properti',
    'Dadak Merak',
    'Kendang'
  ];

  // Dummy data produk outlet (nanti akan diambil dari backend)
  const outletProducts = [
    {
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
      title: 'Topeng Singa Barong Premium',
      price: 'Rp 2.5jt - Rp 3.5jt',
      location: 'Ponorogo'
    },
    {
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
      title: 'Kostum Barongan Lengkap',
      price: 'Rp 5.0jt - Rp 6.0jt',
      location: 'Ponorogo'
    }
  ];

  // Stats data (nanti akan diambil dari backend/state management)
  const stats = [
    { 
      label: 'Total Produk', 
      value: '0', 
      icon: PackageIcon, 
      color: 'bg-[#E97DB4]',
      description: 'di marketplace'
    },
    { 
      label: 'Produk Terbeli', 
      value: '0', 
      icon: ShoppingBagIcon, 
      color: 'bg-[#4A9B9B]',
      description: 'transaksi sukses'
    },
    { 
      label: 'Total Penjualan', 
      value: 'Rp 0', 
      icon: TrendingUpIcon, 
      color: 'bg-[#5B7B6F]',
      description: 'pendapatan'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="px-4 py-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-[#2E2557] to-[#4A4566] rounded-2xl p-6 shadow-lg mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Hai, {outlet.name || 'Penjual'}! 👋
          </h1>
          <p className="text-white/90 text-sm">
            Selamat datang di dashboard produk Anda
          </p>
        </div>

        {/* Statistics Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#2E2557] mb-4">Statistik</h2>
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#2E2557] mb-0.5">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#2E2557] mb-4">Aksi Cepat</h2>
          <button
            onClick={() => navigate('/seller/add-product')}
            className="w-full bg-[#E97DB4] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/40">
                <PlusIcon className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  Tambah Produk Baru
                </h3>
                <p className="text-white/80 text-sm">
                  Upload produk ke marketplace
                </p>
              </div>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Outlet Products Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2E2557]">Produk Anda</h2>
            <span className="text-sm text-gray-600 font-medium">
              {outletProducts.length} produk
            </span>
          </div>

          {/* Product Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
            {productCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-[#E97DB4] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {outletProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {outletProducts.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2 font-medium">Belum ada produk</p>
              <p className="text-sm text-gray-500 mb-4">
                Mulai tambahkan produk pertama Anda
              </p>
              <button
                onClick={() => navigate('/seller/add-product')}
                className="bg-[#E97DB4] text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
              >
                Tambah Produk
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
