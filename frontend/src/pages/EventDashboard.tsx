import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { EventCard } from '../components/EventCard';
import { CalendarIcon, TicketIcon, TrendingUpIcon, PlusIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { requireOutlet } from '../lib/session.utils';
import { formatEventPrice } from '../lib/currency';

export function EventDashboard() {
  const navigate = useNavigate();
  const [outlet, setOutlet] = useState(JSON.parse(localStorage.getItem('outlet') || '{}'));
  const [loading, setLoading] = useState(true);
  const [outletEvents, setOutletEvents] = useState([]);
  const [stats, setStats] = useState([
    {
      label: 'Total Event',
      value: '0',
      icon: CalendarIcon,
      color: 'bg-[#4A9B9B]',
      description: 'di marketplace'
    },
    {
      label: 'Tiket Terjual',
      value: '0',
      icon: TicketIcon,
      color: 'bg-[#E97DB4]',
      description: 'transaksi sukses'
    },
    {
      label: 'Total Penjualan',
      value: 'Rp 0',
      icon: TrendingUpIcon,
      color: 'bg-[#5B7B6F]',
      description: 'pendapatan'
    },
  ]);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (!outlet.id) {
        console.warn('No outlet found');
        return;
      }

      const response = await api.get(`/events/outlet/${outlet.id}`);
      const events = response.data.data || [];

      // Transform events to match frontend format
      const transformedEvents = events.map((event: any) => ({
        id: event.id,
        image: event.images?.[0] || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
        title: event.name,
        price: formatEventPrice(event.ticketCategories || []),
        location: event.location?.name || event.location || 'Ponorogo',
        date: new Date(event.date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        category: event.category,
        capacity: event.capacity,
        ticketsSold: event.stats?.ticketsSold || 0,
        views: event.stats?.views || 0,
        interested: event.stats?.interested || 0,
        rating: event.stats?.rating || 0,
        description: event.description,
        ticketCategories: event.ticketCategories,
      }));

      setOutletEvents(transformedEvents);

      // Update stats
      const totalEvents = events.length;
      const totalTicketsSold = events.reduce((sum: number, event: any) => sum + (event.stats?.ticketsSold || 0), 0);
      const totalRevenue = events.reduce((sum: number, event: any) => {
        return sum + (event.ticketCategories?.reduce((ticketSum: number, tc: any) => ticketSum + (tc.price * (tc.sold || 0)), 0) || 0);
      }, 0);

      setStats([
        {
          label: 'Total Event',
          value: totalEvents.toString(),
          icon: CalendarIcon,
          color: 'bg-[#4A9B9B]',
          description: 'di marketplace'
        },
        {
          label: 'Tiket Terjual',
          value: totalTicketsSold.toString(),
          icon: TicketIcon,
          color: 'bg-[#E97DB4]',
          description: 'transaksi sukses'
        },
        {
          label: 'Total Penjualan',
          value: `Rp ${(totalRevenue / 1000000).toFixed(1)}jt`,
          icon: TrendingUpIcon,
          color: 'bg-[#5B7B6F]',
          description: 'pendapatan'
        },
      ]);

    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check if user has outlet, if not redirect
        const hasOutlet = await requireOutlet(navigate);
        if (!hasOutlet) {
          return;
        }

        // Update outlet state after potential fetch
        const currentOutlet = JSON.parse(localStorage.getItem('outlet') || '{}');
        setOutlet(currentOutlet);

        fetchEvents();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E97DB4] border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="px-4 py-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-[#2E2557] to-[#4A4566] rounded-2xl p-6 shadow-lg mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Hai, {outlet.name || 'Penyelenggara'}! 👋
          </h1>
          <p className="text-white/90 text-sm">
            Selamat datang di dashboard event Anda
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
            onClick={() => navigate('/add-event')}
            className="w-full bg-[#4A9B9B] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/40">
                <PlusIcon className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  Tambah Event Baru
                </h3>
                <p className="text-white/80 text-sm">
                  Buat event di marketplace
                </p>
              </div>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Outlet Events Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2E2557]">Event Anda</h2>
            <span className="text-sm text-gray-600 font-medium">
              {outletEvents.length} event
            </span>
          </div>

          {/* Events List */}
          {outletEvents.length > 0 ? (
            <div className="space-y-3">
              {outletEvents.map((event: any, index: number) => (
                <EventCard key={event.id || index} {...event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2 font-medium">Belum ada event</p>
              <p className="text-sm text-gray-500 mb-4">
                Mulai tambahkan event pertama Anda
              </p>
              <button
                onClick={() => navigate('/add-event')}
                className="bg-[#4A9B9B] text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
              >
                Tambah Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
