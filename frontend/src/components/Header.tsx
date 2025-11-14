import { useState, useEffect } from 'react';
import { BellIcon, ShoppingCartIcon, UserIcon, MenuIcon, SearchIcon, StoreIcon, HomeIcon, PackageIcon, CalendarIcon, BarChartIcon, PlusCircleIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../lib/auth.service';
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
  const [outletType, setOutletType] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('buyer');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from auth service
    const user = authService.getCurrentUser();
    if (user) {
      setUserRole(user.role || 'buyer');
    }

    // Get outlet type from localStorage
    const outlet = localStorage.getItem('outlet');
    if (outlet) {
      const outletData = JSON.parse(outlet);
      setOutletType(outletData.type || '');
    }
  }, []);

  // Check if user is logged in AND has outlet
  const isLoggedIn = authService.isLoggedIn();
  const hasOutlet = !!(localStorage.getItem('outlet') && localStorage.getItem('outlet') !== '{}');

  const publicMenuItems = [{
    label: 'Beranda',
    path: '/',
    icon: HomeIcon
  }, {
    label: 'Riwayat Pembelian',
    path: '/history',
    icon: PackageIcon
  }, {
    label: 'Notifikasi',
    path: '/notifications',
    icon: BellIcon
  }, {
    label: 'Keranjang',
    path: '/cart',
    icon: ShoppingCartIcon
  }, {
    label: 'Profil',
    path: '/profile',
    icon: UserIcon
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

  // Outlet menu items based on outlet type
  const getOutletMenuItems = () => {
    if (!outletType) return [];
    
    const baseItems = [
      {
        label: 'Beranda Outlet',
        path: outletType === 'produk' ? '/product-dashboard' : '/event-dashboard',
        icon: HomeIcon
      },
      {
        label: 'Analitik',
        path: '/analytics',
        icon: BarChartIcon
      }
    ];

    // Add product or event specific items
    if (outletType === 'produk') {
      baseItems.splice(1, 0, 
        {
          label: 'Produk',
          path: '/product-dashboard',
          icon: PackageIcon
        },
        {
          label: 'Tambah Produk',
          path: '/add-product',
          icon: PlusCircleIcon
        }
      );
    } else if (outletType === 'event') {
      baseItems.splice(1, 0,
        {
          label: 'Event',
          path: '/event-dashboard',
          icon: CalendarIcon
        },
        {
          label: 'Tambah Event',
          path: '/add-event',
          icon: PlusCircleIcon
        }
      );
    } else if (outletType === 'keduanya') {
      baseItems.splice(1, 0,
        {
          label: 'Produk',
          path: '/product-dashboard',
          icon: PackageIcon
        },
        {
          label: 'Event',
          path: '/event-dashboard',
          icon: CalendarIcon
        },
        {
          label: 'Tambah Produk',
          path: '/add-product',
          icon: PlusCircleIcon
        },
        {
          label: 'Tambah Event',
          path: '/add-event',
          icon: PlusCircleIcon
        }
      );
    }

    return baseItems;
  };

  // Determine menu items based on user role
  const menuItems = userRole === 'seller' ? sellerMenuItems : publicMenuItems;
  const outletMenuItems = getOutletMenuItems();
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
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#2E2557]">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <MenuIcon className="w-5 h-5 text-[#2E2557]" />
                </button>
              </div>

              {/* Menu Utama */}
              <nav className="space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      onClick={() => setIsMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E97DB4] hover:text-white text-gray-700 transition-all font-medium group"
                    >
                      {Icon && <Icon className="w-4 h-4 text-[#E97DB4] group-hover:text-white" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Menu Outlet - Only show if user is logged in AND has outlet */}
              {isLoggedIn && hasOutlet && outletMenuItems.length > 0 && (
                <>
                  <div className="my-6 border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <StoreIcon className="w-5 h-5 text-[#E97DB4]" />
                      <h3 className="text-lg font-bold text-[#2E2557]">Menu Outlet</h3>
                    </div>
                    <nav className="space-y-2">
                      {outletMenuItems.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link 
                            key={item.path} 
                            to={item.path} 
                            onClick={() => setIsMenuOpen(false)} 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#4A9B9B] hover:text-white text-gray-700 transition-all font-medium group"
                          >
                            <Icon className="w-4 h-4 text-[#4A9B9B] group-hover:text-white" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </>
              )}
            </div>
          </div>
        </>}
    </>;
}