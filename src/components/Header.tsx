import { useState } from 'react';
import { BellIcon, ShoppingCartIcon, UserIcon, MenuIcon, SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
interface HeaderProps {
  isSeller?: boolean;
  notificationCount?: number;
}
export function Header({
  isSeller = false,
  notificationCount = 0
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const publicMenuItems = [{
    label: 'Beranda',
    path: '/'
  }, {
    label: 'Riwayat Pembelian',
    path: '/history'
  }, {
    label: 'Notifikasi',
    path: '/notifications'
  }, {
    label: 'Keranjang',
    path: '/cart'
  }, {
    label: 'Profil',
    path: '/profile'
  }];
  const sellerMenuItems = [{
    label: 'Dashboard',
    path: '/seller/dashboard'
  }, {
    label: 'Produk',
    path: '/seller/products'
  }, {
    label: 'Event',
    path: '/seller/events'
  }, {
    label: 'Galeri',
    path: '/seller/gallery'
  }, {
    label: 'Analitik',
    path: '/seller/analytics'
  }, {
    label: 'Profil',
    path: '/profile'
  }, {
    label: 'Keluar',
    path: '/'
  }];
  const menuItems = isSeller ? sellerMenuItems : publicMenuItems;
  return <>
      <header className="sticky top-0 z-50 bg-[#E97DB4] shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">ReogCommerce</span>
            </Link>
            
            {/* Desktop Search Bar - Always visible on larger screens */}
            <div className="hidden sm:flex flex-1 mx-2 max-w-md">
              <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                <input type="text" placeholder="Cari produk atau event..." className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30" />
              </div>
            </div>

            {/* Mobile Search Bar - Expands when clicked */}
            {isSearchOpen ? (
              <div className="flex sm:hidden flex-1 mx-2 animate-in slide-in-from-right">
                <div className="relative w-full">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                  <input 
                    type="text" 
                    placeholder="Cari produk atau event..." 
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30"
                    autoFocus
                  />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="ml-2 text-white text-sm font-medium whitespace-nowrap"
                >
                  Batal
                </button>
              </div>
            ) : (
              <>
                {/* Right Icons - Hidden when search is open on mobile */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {/* Mobile Search Icon - Now part of icon group */}
                  <button 
                    onClick={() => setIsSearchOpen(true)} 
                    className="sm:hidden p-2.5 hover:bg-white/20 rounded-xl transition-all"
                  >
                    <SearchIcon className="w-5 h-5 text-white" />
                  </button>
                  
                  <button onClick={() => navigate('/notifications')} className="relative p-2.5 hover:bg-white/20 rounded-xl transition-all">
                    <BellIcon className="w-5 h-5 text-white" />
                    {notificationCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-[#E97DB4] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>}
                  </button>
                  {!isSeller && <button onClick={() => navigate('/cart')} className="p-2.5 hover:bg-white/20 rounded-xl transition-all">
                      <ShoppingCartIcon className="w-5 h-5 text-white" />
                    </button>}
                  <button onClick={() => navigate('/profile')} className="p-2.5 hover:bg-white/20 rounded-xl transition-all">
                    <UserIcon className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 hover:bg-white/20 rounded-xl transition-all z-50 relative">
                    <MenuIcon className="w-6 h-6 text-white drop-shadow-md" />
                  </button>
                </div>
              </>
            )}
        </div>
      </header>
      {isMenuOpen && <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#2E2557]">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <MenuIcon className="w-5 h-5 text-[#2E2557]" />
                </button>
              </div>
              <nav className="space-y-2">
                {menuItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-[#E97DB4] hover:text-white text-gray-700 transition-all font-medium">
                    {item.label}
                  </Link>)}
              </nav>
            </div>
          </div>
        </>}
    </>;
}