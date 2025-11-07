import React from 'react';
import { Header } from '../components/Header';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
export function EventList() {
  const navigate = useNavigate();
  const events = [{
    id: 1,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
    title: 'Festival Reog 2024',
    date: '25 Feb 2024',
    location: 'Ponorogo',
    price: 'Rp 50.000'
  }];
  return <div className="min-h-screen bg-gray-50 pb-6">
      <Header isSeller={true} />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Daftar Event</h1>
        <div className="space-y-4">
          {events.map(event => <div key={event.id} onClick={() => navigate(`/seller/event/${event.id}`)} className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <MapPinIcon className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-[#800000] font-bold text-base">
                    {event.price}
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      <FloatingActionButton onClick={() => navigate('/seller/add-event')} />
    </div>;
}