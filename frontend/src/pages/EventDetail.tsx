import { useState, useEffect } from 'react';
import { ArrowLeftIcon, EditIcon, TrashIcon, CalendarIcon, UsersIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, TicketIcon, XIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { formatEventPrice } from '../lib/currency';

// Type definitions
interface TicketCategory {
  category?: string;
  name?: string;
  price?: number;
  benefits?: string;
  quota?: number;
  available?: number;
}

export function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showTicketSelector, setShowTicketSelector] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);

  // Check if this is seller view (URL starts with /seller/)
  const isSellerView = window.location.pathname.startsWith('/seller/');

  // Get outlet name from localStorage
  const outlet = JSON.parse(localStorage.getItem('outlet') || '{}');
  const outletName = outlet.name || 'Nama Outlet';

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;

        const response = await api.get(`/events/${id}`);
        const event = response.data.data;

        setEventData(event);

        // Initialize selected tickets with all categories set to 0
        const ticketData = Array.isArray(event.ticketCategories)
          ? event.ticketCategories
          : event.tiketCategories ? [event.tiketCategories] : [];

        if (ticketData && ticketData.length > 0) {
          const initialTickets: {[key: string]: number} = {};
          ticketData.forEach((tc: TicketCategory) => {
            initialTickets[tc.category || tc.name || 'default'] = 0;
          });
          setSelectedTickets(initialTickets);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        // For now, use dummy data as fallback
        setEventData({
          name: 'Festival Grebeg Suro Ponorogo 2024',
          date: new Date('2024-02-25T19:00:00'),
          location: {
            name: 'Alun-alun Ponorogo, Jawa Timur',
            address: 'Jl. Alun-alun Utara, Kelurahan Tonatan, Ponorogo',
            coordinates: null
          },
          capacity: 1000,
          description: 'Festival Grebeg Suro adalah puncak perayaan tahun baru Islam di Ponorogo yang menampilkan kemegahan Reog Ponorogo.',
          ticketCategories: [
            { name: 'VIP', price: 150000, benefits: 'Kursi depan, meet & greet penari, merchandise', available: 100 },
            { name: 'Tribun', price: 100000, benefits: 'Kursi tribun, view terbaik, merchandise', available: 300 },
            { name: 'Festival', price: 50000, benefits: 'Standing area, free akses semua zona', available: 600 }
          ],
          images: [
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'
          ],
          program: [
            'Kirab Pusaka Reog Ponorogo dengan 100 penari',
            'Penampilan Singo Barong dari berbagai sanggar terbaik',
            'Tari Dadak Merak spektakuler dengan mahkota bulu merak 3 meter',
            'Atraksi Bujang Ganong dan Warok tradisional',
            'Pentas musik gamelan Jawa dan kendang Reog',
            'Lomba Reog antar kecamatan se-Ponorogo',
            'Pameran kerajinan topeng dan properti Reog',
            'Bazar kuliner khas Ponorogo (Dawet Jabung, Sate Ponorogo, dll)'
          ]
        });

        // Initialize with dummy categories
        setSelectedTickets({
          'VIP': 0,
          'Tribun': 0,
          'Festival': 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Get event images from fetched data or fallback
  const eventImages = eventData?.images || [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'
  ];

  // Helper function to convert Firebase timestamp to Date
  const convertTimestamp = (timestamp: any) => {
    if (!timestamp) return null;
    if (timestamp && typeof timestamp === 'object' && timestamp._seconds !== undefined) {
      return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
    }
    return new Date(timestamp);
  };

  // Get ticket categories from fetched data or fallback
  const ticketCategories: TicketCategory[] = eventData?.ticketCategories || eventData?.tiketCategories ?
    (Array.isArray(eventData.ticketCategories)
      ? eventData.ticketCategories
      : [eventData.tiketCategories].filter(Boolean)
    ) : [
      { category: 'VIP', name: 'VIP', price: 150000, benefits: 'Kursi depan, meet & greet penari, merchandise', quota: 100, available: 100 },
      { category: 'Tribun', name: 'Tribun', price: 100000, benefits: 'Kursi tribun, view terbaik, merchandise', quota: 300, available: 300 },
      { category: 'Festival', name: 'Festival', price: 50000, benefits: 'Standing area, free akses semua zona', quota: 600, available: 600 }
    ];

  // Get program from fetched data or fallback
  const eventProgram = eventData?.eventProgram || [
    'Kirab Pusaka Reog Ponorogo dengan 100 penari',
    'Penampilan Singo Barong dari berbagai sanggar terbaik',
    'Tari Dadak Merak spektakuler dengan mahkota bulu merak 3 meter',
    'Atraksi Bujang Ganong dan Warok tradisional',
    'Pentas musik gamelan Jawa dan kendang Reog',
    'Lomba Reog antar kecamatan se-Ponorogo',
    'Pameran kerajinan topeng dan properti Reog',
    'Bazar kuliner khas Ponorogo (Dawet Jabung, Sate Ponorogo, dll)'
  ];

  // WhatsApp configuration
  const whatsappNumber = '6285136994744'; // Format: country code + number (no + or spaces)
  
  const handleWhatsAppContact = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (!eventData) return;

    const eventDate = convertTimestamp(eventData.date);
    const formattedDate = eventDate ?
      eventDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : 'Tanggal TBD';

    const locationName = typeof eventData.location === 'object'
      ? eventData.location?.name || 'Lokasi TBD'
      : eventData.location || 'Lokasi TBD';

    // Format ticket categories for price display
    const formattedCategories = ticketCategories
      .filter((cat): cat is Required<Pick<TicketCategory, 'price' | 'category'>> & TicketCategory => 
        cat.price !== undefined && (cat.category !== undefined || cat.name !== undefined)
      )
      .map(cat => ({
        price: cat.price,
        category: cat.category || cat.name || 'default'
      }));

    const message = `Halo, saya tertarik untuk memesan tiket event berikut:\n\n` +
                   `*${eventData.name}*\n` +
                   `Tanggal: ${formattedDate}\n` +
                   `Lokasi: ${locationName}\n` +
                   `Harga: ${formatEventPrice(formattedCategories)}\n\n` +
                   `Apakah masih ada tiket yang tersedia?`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    // Show ticket selector popup
    setShowTicketSelector(true);
  };

  const handleTicketQuantityChange = (category: string, delta: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [category]: Math.max(0, (prev[category] || 0) + delta)
    }));
  };

  const handleConfirmTickets = () => {
    // Check if at least one ticket is selected
    const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);

    if (totalTickets === 0) {
      alert('Pilih minimal 1 tiket!');
      return;
    }

    if (!eventData) return;

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "events": []}');

    // Add each selected ticket category to cart
    Object.entries(selectedTickets).forEach(([categoryName, quantity]) => {
      if (quantity > 0) {
        const categoryData = ticketCategories.find((c: TicketCategory) => (c.category || c.name) === categoryName);
        if (!categoryData) return;

        const eventDate = convertTimestamp(eventData.date);
        const startTime = convertTimestamp(eventData.startTime);

        const cartItem = {
          id: `${id}-${categoryName}`,
          eventId: id || '1',
          type: 'event',
          image: eventImages[0],
          title: eventData.name,
          category: categoryName,
          price: categoryData.price ? `Rp ${categoryData.price.toLocaleString('id-ID')}` : 'Rp 0',
          priceNumber: categoryData.price || 0,
          quantity: quantity,
          date: eventDate ? eventDate.toLocaleDateString('id-ID') : 'Date TBD',
          time: startTime ? startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Time TBD',
          location: typeof eventData.location === 'object'
            ? eventData.location?.name || 'Location TBD'
            : eventData.location || 'Location TBD',
          benefits: categoryData.benefits
        };

        // Check if this exact category already exists in cart
        const existingIndex = existingCart.events.findIndex((item: any) =>
          item.eventId === cartItem.eventId && item.category === cartItem.category
        );

        if (existingIndex >= 0) {
          // Update quantity if exists
          existingCart.events[existingIndex].quantity += quantity;
        } else {
          // Add new item
          existingCart.events.push(cartItem);
        }
      }
    });

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Reset selections and close popup
    const resetTickets: {[key: string]: number} = {};
    ticketCategories.forEach((tc: TicketCategory) => {
      resetTickets[tc.category || tc.name || 'default'] = 0;
    });
    setSelectedTickets(resetTickets);
    setShowTicketSelector(false);

    // Show notification
    alert('Tiket event berhasil ditambahkan ke keranjang!');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % eventImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + eventImages.length) % eventImages.length);
  };

  if (loading || !eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E97DB4] border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat detail event...</p>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Login Prompt Popup */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[slideIn_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E97DB4] to-[#C75B8A] rounded-full flex items-center justify-center mx-auto mb-4">
                <TicketIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Login Diperlukan
              </h3>
              <p className="text-gray-600 text-sm">
                Anda harus login terlebih dahulu untuk memesan tiket event atau menghubungi penyelenggara
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-[#4A9B9B] to-[#3a8080] text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Login Sekarang
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

      {/* Ticket Selector Bottom Sheet */}
      {showTicketSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-lg font-bold text-gray-800">Pilih Tiket</h3>
              <button
                onClick={() => setShowTicketSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Ticket Categories */}
            <div className="p-4 space-y-3">
              {ticketCategories.map((cat: TicketCategory) => {
                const categoryKey = cat.category || cat.name || 'default';
                return (
                  <div key={categoryKey} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-[#800000] text-lg">{categoryKey}</p>
                          <span className="text-xs bg-[#800000]/10 text-[#800000] px-2 py-0.5 rounded-full font-semibold">
                            {cat.benefits}
                          </span>
                        </div>
                        <p className="font-bold text-gray-800 text-xl">
                          {cat.price ? `Rp ${cat.price.toLocaleString('id-ID')}` : 'Rp 0'}
                        </p>
                        {(cat.available !== undefined || cat.quota !== undefined) && (
                          <p className="text-xs text-gray-500 mt-1">
                            Tersedia {cat.available || cat.quota || 0} tiket
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
                      <span className="text-sm font-medium text-gray-600">Jumlah</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleTicketQuantityChange(categoryKey, -1)}
                          disabled={selectedTickets[categoryKey] === 0}
                          className="w-8 h-8 rounded-full border-2 border-[#E97DB4] flex items-center justify-center hover:bg-[#E97DB4] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">
                          {selectedTickets[categoryKey] || 0}
                        </span>
                        <button
                          onClick={() => handleTicketQuantityChange(categoryKey, 1)}
                          className="w-8 h-8 rounded-full bg-[#E97DB4] text-white flex items-center justify-center hover:bg-[#d66b9f] transition-all"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary & Confirm Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Tiket</span>
                <span className="font-bold text-lg text-gray-800">
                  {Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)} tiket
                </span>
              </div>
              <button
                onClick={handleConfirmTickets}
                className="w-full bg-gradient-to-r from-[#E97DB4] to-[#C75B8A] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">Detail Event</h1>
          <div className="w-9" />
        </div>
      </div>
      <div className="pb-24">
        {/* Image Carousel */}
        <div className="relative h-64 bg-gray-200">
          {/* Images */}
          {eventImages.map((image: string, index: number) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Event ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Navigation Buttons */}
          {eventImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
              >
                <ChevronLeftIcon className="w-5 h-5 text-[#2E2557]" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
              >
                <ChevronRightIcon className="w-5 h-5 text-[#2E2557]" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {eventImages.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {currentImageIndex + 1} / {eventImages.length}
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {eventData.name}
          </h2>
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Deskripsi Event
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {eventData.description}
            </p>
            {eventProgram.length > 0 && (
              <>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  Rangkaian Acara:
                </h4>
                <ul className="space-y-2">
                  {eventProgram.map((content: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#E97DB4] mt-1">•</span>
                      <span>{content}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Informasi Event
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Tanggal</p>
                  <p className="font-medium">
                    {(() => {
                      const eventDate = convertTimestamp(eventData.date);
                      return eventDate
                        ? eventDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Tanggal TBD';
                    })()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Waktu</p>
                  <p className="font-medium">
                    {eventData.startTime && eventData.endTime
                      ? `${eventData.startTime} - ${eventData.endTime} WIB`
                      : eventData.startTime
                      ? `${eventData.startTime} WIB`
                      : 'Waktu TBD'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0">
                  <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                  <path d="M2 7h20"></path>
                  <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
                </svg>
                <div>
                  <p className="text-xs text-gray-600">Penyelenggara</p>
                  <p className="font-medium">
                    {eventData.outlet?.name || outletName || 'Nama Outlet'}
                  </p>
                </div>
              </div>
              {eventData.capacity && (
                <div className="flex items-start gap-3">
                  <UsersIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">Kapasitas</p>
                    <p className="font-medium">{eventData.capacity.toLocaleString('id-ID')} orang</p>
                    {eventData.remainingTickets !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tersedia {eventData.remainingTickets.toLocaleString('id-ID')} tiket
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {ticketCategories.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Kategori Harga</h3>
              <div className="space-y-3">
                {ticketCategories.map((cat: TicketCategory, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-[#800000]">{cat.category || cat.name}</p>
                      <p className="text-xs text-gray-600">{cat.benefits}</p>
                    </div>
                    <p className="font-bold text-gray-800">
                      {cat.price ? `Rp ${cat.price.toLocaleString('id-ID')}` : 'Rp 0'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-30">
        {isSellerView ? (
          <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-[#E97DB4] to-[#C75B8A] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <EditIcon className="w-5 h-5" />
              Edit
            </button>
            <button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <TrashIcon className="w-5 h-5" />
              Hapus
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-[#E97DB4] to-[#C75B8A] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <TicketIcon className="w-5 h-5" />
              Pilih Tiket
            </button>
            <button 
              onClick={handleWhatsAppContact}
              className="flex-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>;
}