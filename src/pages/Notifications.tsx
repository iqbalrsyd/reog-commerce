import { Header } from '../components/Header';
import { BellIcon, PackageIcon, TruckIcon } from 'lucide-react';
export function Notifications() {
  const notifications = [{
    id: 1,
    icon: PackageIcon,
    title: 'Pesanan Anda sedang diproses',
    time: '2 jam lalu',
    isRead: false
  }, {
    id: 2,
    icon: TruckIcon,
    title: 'Pesanan dalam pengiriman',
    time: '1 hari lalu',
    isRead: false
  }, {
    id: 3,
    icon: BellIcon,
    title: 'Promo spesial untuk Anda!',
    time: '2 hari lalu',
    isRead: true
  }];
  return <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Notifikasi</h1>
        <div className="space-y-3">
          {notifications.map(notification => {
          const Icon = notification.icon;
          return <div key={notification.id} className={`bg-white rounded-xl shadow-sm p-4 ${!notification.isRead ? 'border-l-4 border-[#E97DB4]' : ''}`}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E97DB4] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#800000]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-800 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
}