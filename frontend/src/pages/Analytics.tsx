import React from 'react';
import { Header } from '../components/Header';
import { TrendingUpIcon, DollarSignIcon, PackageIcon, UsersIcon, EyeIcon, ShoppingBagIcon, CalendarIcon } from 'lucide-react';
export function Analytics() {
  const stats = [{
    icon: DollarSignIcon,
    label: 'Total Pendapatan',
    value: 'Rp 12.5jt',
    change: '+15%',
    iconBg: 'bg-[#4A9B9B]'
  }, {
    icon: ShoppingBagIcon,
    label: 'Penjualan Produk',
    value: '124',
    change: '+12%',
    iconBg: 'bg-[#2E2557]'
  }, {
    icon: CalendarIcon,
    label: 'Penjualan Event',
    value: '32',
    change: '+8%',
    iconBg: 'bg-[#E97DB4]'
  }, {
    icon: PackageIcon,
    label: 'Produk Terlaris',
    value: 'Topeng Reog',
    sales: '45 terjual',
    iconBg: 'bg-[#5B7B6F]'
  }, {
    icon: CalendarIcon,
    label: 'Event Terlaris',
    value: 'Festival Reog',
    sales: '28 tiket',
    iconBg: 'bg-[#C4A4B7]'
  }, {
    icon: UsersIcon,
    label: 'Total Pembeli',
    value: '156',
    change: '+18%',
    iconBg: 'bg-[#4A9B9B]'
  }, {
    icon: EyeIcon,
    label: 'Views Produk',
    value: '2,450',
    change: '+25%',
    iconBg: 'bg-[#2E2557]'
  }, {
    icon: EyeIcon,
    label: 'Views Event',
    value: '1,230',
    change: '+20%',
    iconBg: 'bg-[#E97DB4]'
  }];
  const salesData = [{
    month: 'Jan',
    products: 85,
    events: 20
  }, {
    month: 'Feb',
    products: 95,
    events: 25
  }, {
    month: 'Mar',
    products: 110,
    events: 30
  }, {
    month: 'Apr',
    products: 124,
    events: 32
  }];
  return <div className="min-h-screen bg-[#F5F5F5]">
      <Header isSeller={true} />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-[#2E2557] mb-6">Analitik</h1>
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
                <p className="text-xl font-bold text-[#2E2557]">{stat.value}</p>
                {stat.sales && <p className="text-xs text-gray-500 mt-1">{stat.sales}</p>}
                {stat.change && <div className="flex items-center gap-1 text-[#4A9B9B] mt-2">
                    <TrendingUpIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">{stat.change}</span>
                  </div>}
              </div>;
        })}
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-[#2E2557] mb-4">Grafik Penjualan</h2>
          <div className="space-y-4">
            {salesData.map((data, index) => <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#2E2557]">
                    {data.month}
                  </span>
                  <span className="text-xs text-gray-500">
                    Produk: {data.products} | Event: {data.events}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2E2557] rounded-full" style={{
                    width: `${data.products / 150 * 100}%`
                  }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E97DB4] rounded-full" style={{
                    width: `${data.events / 40 * 100}%`
                  }} />
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2E2557]" />
              <span className="text-xs text-gray-600 font-medium">Produk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E97DB4]" />
              <span className="text-xs text-gray-600 font-medium">Event</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
}