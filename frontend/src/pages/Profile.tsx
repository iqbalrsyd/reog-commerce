  import { Header } from '../components/Header';
import { ChevronRightIcon, ShoppingBagIcon, BellIcon, ShoppingCartIcon, StoreIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function Profile() {
  const navigate = useNavigate();
  const menuItems = [{
    icon: ShoppingBagIcon,
    label: 'Riwayat Pembelian',
    path: '/history',
    color: 'text-[#E97DB4]'
  }, {
    icon: BellIcon,
    label: 'Notifikasi',
    path: '/notifications',
    color: 'text-[#E97DB4]'
  }, {
    icon: ShoppingCartIcon,
    label: 'Keranjang',
    path: '/cart',
    color: 'text-[#E97DB4]'
  }];
  return <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <div className="px-4 py-6">
        <div className="bg-[#2E2557] bg-opacity-90 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl border-4 border-white/30">
              JD
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">John Doe</h2>
              <p className="text-sm text-white/80">Pecinta budaya Reog</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          {menuItems.map((item, index) => {
          const Icon = item.icon;
          return <button key={index} onClick={() => navigate(item.path)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-gray-800 font-medium">
                    {item.label}
                  </span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </button>;
        })}
        </div>
        <button onClick={() => navigate('/seller/dashboard')} className="w-full bg-[#4A9B9B] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white/40">
                <StoreIcon className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-lg mb-1">
                  Dashboard Penjual
                </h3>
                <p className="text-white/80 text-sm">
                  Kelola produk & event Anda
                </p>
              </div>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>
    </div>;
}