  import { Header } from '../components/Header';
import { ChevronRightIcon, ShoppingBagIcon, BellIcon, ShoppingCartIcon, StoreIcon, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../lib/auth.service';

interface UserData {
  name: string;
  email: string;
  origin: string;
  category: string;
  role: string;
}

export function Profile() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Pengguna',
    email: '-',
    origin: '-',
    category: '-',
    role: 'buyer'
  });

  useEffect(() => {
    // Check login status using auth service
    const loggedIn = authService.isLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // User is logged in, load their data
      const user = authService.getCurrentUser();
      if (user) {
        setUserData({
          name: user.name || 'Pengguna',
          email: user.email || '-',
          origin: user.origin || '-',
          category: user.category || '-',
          role: user.role || 'buyer'
        });
      }
    } else {
      // Show login prompt if not logged in
      setShowLoginPrompt(true);
    }
  }, []);

  const handleLogout = async () => {
    if (confirm('Yakin ingin keluar?')) {
      await authService.logout();
      setIsLoggedIn(false);
      setUserData({
        name: 'Pengguna',
        email: '-',
        origin: '-',
        category: '-',
        role: 'buyer'
      });
      setShowLoginPrompt(true);
    }
  };

  // Check if user has created a store/outlet
  const hasOutlet = () => {
    const outlet = localStorage.getItem('outlet');
    return outlet && outlet !== '{}';
  };
  const menuItems = [
    { icon: UserIcon, label: 'Informasi Akun', path: '/account-info' },
    { icon: ShoppingBagIcon, label: 'Riwayat Pembelian', path: '/purchase-history' },
    { icon: BellIcon, label: 'Notifikasi', path: '/notifications' },
    { icon: ShoppingCartIcon, label: 'Keranjang', path: '/cart' },
  ];
  return <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Login Prompt Popup */}
      {showLoginPrompt && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[slideIn_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E97DB4] to-[#C75B8A] rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Belum Punya Akun?
              </h3>
              <p className="text-gray-600 text-sm">
                Login atau daftar untuk menikmati fitur lengkap ReogCommerce
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-[#4A9B9B] to-[#3a8080] text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Masuk Sekarang
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        <div className="bg-[#2E2557] bg-opacity-90 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl border-4 border-white/30">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{userData.name}</h2>
              <p className="text-sm text-white/80 mb-1">{userData.email}</p>
              {userData.origin !== '-' && (
                <p className="text-xs text-white/70">📍 {userData.origin}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                {userData.category !== '-' && (
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/30">
                    {userData.category}
                  </span>
                )}
                {userData.role === 'seller' && (
                  <span className="px-3 py-1 bg-[#E97DB4] text-white text-xs font-semibold rounded-full border-2 border-white">
                    🛍️ Penjual
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          {menuItems.map((item, index) => {
          const Icon = item.icon;
          return <button key={index} onClick={() => navigate(item.path)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#4A9B9B]" />
                  <span className="text-gray-800 font-medium">
                    {item.label}
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </button>;
        })}
        </div>

        {/* Seller Dashboard / Create Store Button */}
        {isLoggedIn && (
          <button
            onClick={() => {
              if (userData.role === 'seller' && hasOutlet()) {
                navigate('/seller/dashboard');
              } else if (userData.role === 'seller') {
                navigate('/create-outlet');
              } else {
                navigate('/create-outlet');
              }
            }}
            className="w-full bg-gradient-to-r from-[#4A9B9B] to-[#5B7B6F] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white/40">
                  <StoreIcon className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  {userData.role === 'seller' && hasOutlet() ? (
                    <>
                      <h3 className="text-white font-bold text-lg mb-1">
                        Dashboard Penjual
                      </h3>
                      <p className="text-white/80 text-sm">
                        Kelola produk & event Anda
                      </p>
                    </>
                  ) : userData.role === 'seller' ? (
                    <>
                      <h3 className="text-white font-bold text-lg mb-1">
                        Buat Outlet Sekarang
                      </h3>
                      <p className="text-white/80 text-sm">
                        Siapkan toko untuk jual produk Anda
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-white font-bold text-lg mb-1">
                        Buka Toko Sekarang
                      </h3>
                      <p className="text-white/80 text-sm">
                        Jual karya seni & budaya Reog Anda
                      </p>
                    </>
                  )}
                </div>
              </div>
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </div>
          </button>
        )}

        {/* Logout Button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl p-4 hover:bg-red-100 transition-all font-semibold"
          >
            Keluar Akun
          </button>
        )}
      </div>
    </div>;
}