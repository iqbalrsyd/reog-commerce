import React from 'react';
import { HomeIcon, ShoppingCartIcon, ClockIcon, UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
export function BottomNav() {
  const location = useLocation();
  const navItems = [{
    label: 'Home',
    icon: HomeIcon,
    path: '/'
  }, {
    label: 'Keranjang',
    icon: ShoppingCartIcon,
    path: '/cart'
  }, {
    label: 'Riwayat',
    icon: ClockIcon,
    path: '/history'
  }, {
    label: 'Profil',
    icon: UserIcon,
    path: '/profile'
  }];
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${isActive ? 'text-[#800000]' : 'text-gray-600'}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#800000]' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>;
      })}
      </div>
    </nav>;
}