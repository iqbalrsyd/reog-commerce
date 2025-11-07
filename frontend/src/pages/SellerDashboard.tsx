import { useEffect } from 'react';
import { Header } from '../components/Header';
import { DollarSignIcon, PackageIcon, CalendarIcon, TrendingUpIcon, EyeIcon, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function SellerDashboard() {
  const navigate = useNavigate();

  // Check if outlet exists and redirect to appropriate dashboard
  useEffect(() => {
    const outletData = localStorage.getItem('outlet');
    if (!outletData) {
      navigate('/create-outlet');
    } else {
      const outlet = JSON.parse(outletData);
      // Redirect based on outlet type
      if (outlet.type === 'produk') {
        navigate('/product-dashboard');
      } else if (outlet.type === 'event') {
        navigate('/event-dashboard');
      } else {
        // For 'keduanya', show option to choose or default to product dashboard
        navigate('/product-dashboard');
      }
    }
  }, [navigate]);
  const stats = [{
    icon: DollarSignIcon,
    label: 'Total Pendapatan',
    value: 'Rp 12.5jt',
    iconBg: 'bg-[#4A9B9B]',
    textColor: 'text-[#4A9B9B]'
  }, {
    icon: PackageIcon,
    label: 'Jumlah Produk',
    value: '24',
    iconBg: 'bg-[#2E2557]',
    textColor: 'text-[#2E2557]'
  }, {
    icon: CalendarIcon,
    label: 'Jumlah Event',
    value: '8',
    iconBg: 'bg-[#E97DB4]',
    textColor: 'text-[#E97DB4]'
  }, {
    icon: TrendingUpIcon,
    label: 'Total Penjualan',
    value: '156',
    iconBg: 'bg-[#5B7B6F]',
    textColor: 'text-[#5B7B6F]'
  }, {
    icon: EyeIcon,
    label: 'Total Views Produk',
    value: '2,450',
    iconBg: 'bg-[#C4A4B7]',
    textColor: 'text-[#C4A4B7]'
  }, {
    icon: EyeIcon,
    label: 'Total Views Event',
    value: '1,230',
    iconBg: 'bg-[#4A9B9B]',
    textColor: 'text-[#4A9B9B]'
  }];
  const quickAccessSections = [{
    title: 'Produk',
    icon: PackageIcon,
    count: '24 item',
    bg: 'bg-[#2E2557]',
    path: '/seller/products'
  }, {
    title: 'Event',
    icon: CalendarIcon,
    count: '8 event',
    bg: 'bg-[#E97DB4]',
    path: '/seller/events'
  }, {
    title: 'Analitik',
    icon: TrendingUpIcon,
    count: 'Lihat data',
    bg: 'bg-[#4A9B9B]',
    path: '/seller/analytics'
  }, {
    title: 'Galeri',
    icon: ImageIcon,
    count: '12 foto',
    bg: 'bg-[#5B7B6F]',
    path: '/seller/gallery'
  }];
  return <div className="min-h-screen bg-[#F5F5F5] pb-6">
      <Header isSeller={true} />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-[#2E2557] mb-6">
          Dashboard Penjual
        </h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => {
          const Icon = stat.icon;
          return <div key={index} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-600 mb-1 font-medium">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>;
        })}
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="text-base font-bold text-[#2E2557] mb-4">
            Akses Cepat
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickAccessSections.map((section, index) => {
            const Icon = section.icon;
            return <button key={index} onClick={() => navigate(section.path)} className={`${section.bg} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all`}>
                  <Icon className="w-8 h-8 mb-2 mx-auto" />
                  <h3 className="font-bold text-sm mb-1">{section.title}</h3>
                  <p className="text-xs opacity-90">{section.count}</p>
                </button>;
          })}
          </div>
        </div>
      </div>
    </div>;
}