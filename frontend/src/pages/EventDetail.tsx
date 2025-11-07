import { useState } from 'react';
import { ArrowLeftIcon, EditIcon, TrashIcon, CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, TicketIcon, XIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showTicketSelector, setShowTicketSelector] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({
    'VIP': 0,
    'Tribun': 0,
    'Festival': 0
  });

  // Check if this is seller view (URL starts with /seller/)
  const isSellerView = window.location.pathname.startsWith('/seller/');
  
  // TODO: Fetch event data based on id
  console.log('Event ID:', id);

  // Event data (nanti akan diambil dari API berdasarkan id)
  const eventData = {
    name: 'Festival Grebeg Suro Ponorogo 2024',
    date: '25 Februari 2024',
    time: '19:00 - 23:00 WIB',
    location: 'Alun-alun Ponorogo, Jawa Timur',
    address: 'Jl. Alun-alun Utara, Kelurahan Tonatan, Ponorogo',
    capacity: '1.000 orang',
    remainingTickets: '350 tiket tersisa',
    priceRange: 'Rp 50.000 - Rp 150.000',
    startingPrice: 'Rp 50.000'
  };

  // WhatsApp configuration
  const whatsappNumber = '6285136994744'; // Format: country code + number (no + or spaces)
  
  const handleWhatsAppContact = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    const message = `Halo, saya tertarik untuk memesan tiket event berikut:\n\n` +
                   `*${eventData.name}*\n` +
                   `Tanggal: ${eventData.date}\n` +
                   `Waktu: ${eventData.time}\n` +
                   `Lokasi: ${eventData.location}\n` +
                   `Harga: ${eventData.priceRange}\n\n` +
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

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "events": []}');
    
    // Add each selected ticket category to cart
    Object.entries(selectedTickets).forEach(([category, quantity]) => {
      if (quantity > 0) {
        const categoryData = pricingCategories.find(c => c.category === category);
        if (!categoryData) return;

        const cartItem = {
          id: `${id}-${category}`,
          eventId: id || '1',
          type: 'event',
          image: eventImages[0],
          title: eventData.name,
          category: category,
          price: categoryData.price,
          priceNumber: parseInt(categoryData.price.replace(/\D/g, '')),
          quantity: quantity,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
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
    setSelectedTickets({
      'VIP': 0,
      'Tribun': 0,
      'Festival': 0
    });
    setShowTicketSelector(false);
    
    // Show notification
    alert('Tiket event berhasil ditambahkan ke keranjang!');
  };

  // Array of event images
  const eventImages = [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % eventImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + eventImages.length) % eventImages.length);
  };
  const eventContents = [
    'Kirab Pusaka Reog Ponorogo dengan 100 penari',
    'Penampilan Singo Barong dari berbagai sanggar terbaik',
    'Tari Dadak Merak spektakuler dengan mahkota bulu merak 3 meter',
    'Atraksi Bujang Ganong dan Warok tradisional',
    'Pentas musik gamelan Jawa dan kendang Reog',
    'Lomba Reog antar kecamatan se-Ponorogo',
    'Pameran kerajinan topeng dan properti Reog',
    'Bazar kuliner khas Ponorogo (Dawet Jabung, Sate Ponorogo, dll)'
  ];
  const pricingCategories = [{
    category: 'VIP',
    price: 'Rp 150.000',
    benefits: 'Kursi depan, meet & greet penari, merchandise'
  }, {
    category: 'Tribun',
    price: 'Rp 100.000',
    benefits: 'Kursi tribun, view terbaik, merchandise'
  }, {
    category: 'Festival',
    price: 'Rp 50.000',
    benefits: 'Standing area, free akses semua zona'
  }];
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
              {pricingCategories.map((cat) => (
                <div key={cat.category} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-[#800000] text-lg">{cat.category}</p>
                        <span className="text-xs bg-[#800000]/10 text-[#800000] px-2 py-0.5 rounded-full font-semibold">
                          {cat.benefits}
                        </span>
                      </div>
                      <p className="font-bold text-gray-800 text-xl">{cat.price}</p>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
                    <span className="text-sm font-medium text-gray-600">Jumlah</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTicketQuantityChange(cat.category, -1)}
                        disabled={selectedTickets[cat.category] === 0}
                        className="w-8 h-8 rounded-full border-2 border-[#E97DB4] flex items-center justify-center hover:bg-[#E97DB4] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-lg">
                        {selectedTickets[cat.category] || 0}
                      </span>
                      <button
                        onClick={() => handleTicketQuantityChange(cat.category, 1)}
                        className="w-8 h-8 rounded-full bg-[#E97DB4] text-white flex items-center justify-center hover:bg-[#d66b9f] transition-all"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
          {eventImages.map((image, index) => (
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
                {eventImages.map((_, index) => (
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
              Festival Grebeg Suro adalah puncak perayaan tahun baru Islam di Ponorogo yang menampilkan kemegahan Reog Ponorogo. 
              Event tahunan ini menampilkan ratusan penari Reog dari berbagai sanggar di Ponorogo dan sekitarnya, dengan atraksi 
              Singo Barong, Dadak Merak, Bujang Ganong, dan Warok. Acara ini merupakan ajang kompetisi sekaligus pelestarian 
              budaya Reog yang telah diakui UNESCO sebagai warisan budaya takbenda Indonesia.
            </p>
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">
              Rangkaian Acara:
            </h4>
            <ul className="space-y-2">
              {eventContents.map((content, index) => <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-[#E97DB4] mt-1">•</span>
                  <span>{content}</span>
                </li>)}
            </ul>
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
                  <p className="font-medium">{eventData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Waktu</p>
                  <p className="font-medium">{eventData.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Lokasi</p>
                  <p className="font-medium">{eventData.location}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{eventData.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UsersIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Kapasitas</p>
                  <p className="font-medium">{eventData.capacity}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{eventData.remainingTickets}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Kategori Harga</h3>
            <div className="space-y-3">
              {pricingCategories.map((cat, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-[#800000]">{cat.category}</p>
                    <p className="text-xs text-gray-600">{cat.benefits}</p>
                  </div>
                  <p className="font-bold text-gray-800">{cat.price}</p>
                </div>)}
            </div>
          </div>
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