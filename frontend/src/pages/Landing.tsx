import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { EventCard } from '../components/EventCard';
import api from '../lib/api';
import { formatProductPrice, formatEventPrice } from '../lib/currency';

// Type definitions
interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  category: string;
  seller: string;
  location: string;
  views: number;
  likes: number;
  rating: number;
  sold: number;
}

interface Event {
  id: string;
  image: string;
  title: string;
  price: string;
  outlet: string;
  date: string;
  capacity: number;
  interested: number;
  views: number;
  rating: number;
}

export function Landing() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const productCategories = [
    'Semua',
    'Kerajinan',
    'Topeng',
    'Pakaian',
    'Wayang'
  ];

  // Filter products based on active category
  const filteredProducts = activeCategory === 'Semua' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Fetch products and events from backend
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsResponse = await api.get('/products?limit=8');
      const productsData = productsResponse.data.data?.products || [];

      // Transform products to match frontend format
      const transformedProducts = productsData.map((product: any) => ({
        id: product.id,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
        title: product.name,
        price: formatProductPrice(product.price?.min || 0, product.price?.max),
        category: product.category,
        seller: product.outlet?.name || 'Toko',
        location: product.outlet?.name || 'Toko',
        views: product.stats?.views || 0,
        likes: product.stats?.likes || 0,
        rating: product.stats?.rating || 0,
        sold: product.stats?.sold || 0,
      }));

      // Fetch events
      const eventsResponse = await api.get('/events?limit=4&status=upcoming');
      const eventsData = eventsResponse.data.data?.events || [];

      // Transform events to match frontend format
      const transformedEvents = eventsData.map((event: any) => {
        // Convert Firebase Timestamp to Date
        let eventDate;
        if (event.date && typeof event.date === 'object' && event.date._seconds !== undefined) {
          eventDate = new Date(event.date._seconds * 1000 + (event.date._nanoseconds || 0) / 1000000);
        } else {
          eventDate = new Date(event.date);
        }

        // Format date with time
        const dateStr = eventDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const timeStr = `${event.startTime || '19:00'} - ${event.endTime || '23:00'}`;

        return {
          id: event.id,
          image: event.images?.[0] || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
          title: event.name,
          price: formatEventPrice(event.ticketCategories || []),
          outlet: event.outlet?.name || 'Penyelenggara',
          date: `${dateStr} • ${timeStr}`,
          capacity: event.capacity,
          interested: event.stats?.interested || 0,
          views: event.stats?.views || 0,
          rating: event.stats?.rating || 0,
        };
      });

      setProducts(transformedProducts);
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const heroSlides = [{
    title: 'Festival Reog Ponorogo 2024',
    subtitle: 'Grebeg Suro - Perayaan budaya terbesar Ponorogo',
    image: 'https://imgs.search.brave.com/sw-HX8b1_dJNQNcfvURDTu-It4Li-03DQasF892j5Qk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4w/LXByb2R1Y3Rpb24t/aW1hZ2VzLWtseS5h/a2FtYWl6ZWQubmV0/L0lZLVVfQ0RUYklG/QVRxbkxCSmRfZlRh/VkpuST0vNjQweDM2/MC9zbWFydC9maWx0/ZXJzOnF1YWxpdHko/NzUpOnN0cmlwX2lj/YygpL2tseS1tZWRp/YS1wcm9kdWN0aW9u/L21lZGlhcy81MjY0/MDY4L29yaWdpbmFs/LzA5NjM1MjUwMF8x/NzUwODM3OTcxLVJl/b2dfUG9ub3JvZ28u/anBn'
  }, {
    title: 'Dadak Merak Asli Ponorogo',
    subtitle: 'Mahkota kebanggaan penari Reog dari pengrajin terpercaya',
    image: 'https://imgs.search.brave.com/UEnlQcJytx2-PLEfv9Alvg4KqtHJdA2hEAtD1wEIVZg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZi5z/aG9wZWUuY28uaWQv/ZmlsZS9pZC0xMTEz/NDI3NS03cmJrOC1t/OXpkcjlreXExMmw5/MQ'
  }, {
    title: 'Topeng Singa Barong Premium',
    subtitle: 'Karya seni ukir kayu terbaik dari Ponorogo',
    image: 'https://imgs.search.brave.com/ilmeyRDzMht7VejfLizgAWfQHBnyFqx-F-GHBTzCU_4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/aW5ld3MuY28uaWQv/bWVkaWEvMTA1MC9m/aWxlcy9pbmV3c19u/ZXcvMjAyMy8wOC8w/My9SZW9nX1Bvbm9y/b2dvLmpwZw'
  }];
  
  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left - next slide
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }
    if (isRightSwipe) {
      // Swipe right - previous slide
      setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };
  
  return <div className="min-h-screen bg-[#F5F5F5]">
      <Header notificationCount={2} />
      <div className="relative">
        <div 
          className="relative h-72 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {heroSlides.map((slide, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <div className="relative h-full">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#2E2557] bg-opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-sm mb-4 opacity-90">{slide.subtitle}</p>
                </div>
              </div>
            </div>)}

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {heroSlides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />)}
          </div>
        </div>
      </div>
      <div className="px-4 py-6">
        {/* Event Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2E2557]">Event Mendatang</h3>
            {!loading && events.length > 1 && (
              <>
                {!showAllEvents ? (
                  <button
                    onClick={() => setShowAllEvents(true)}
                    className="text-sm text-[#E97DB4] font-semibold hover:text-[#d66b9f] transition-colors"
                  >
                    Lihat Lebih Banyak →
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAllEvents(false)}
                    className="text-sm text-[#E97DB4] font-semibold hover:text-[#d66b9f] transition-colors"
                  >
                    Lihat Lebih Sedikit ←
                  </button>
                )}
              </>
            )}
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E97DB4] mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Memuat data...</p>
              </div>
            ) : events.length > 0 ? (
              (showAllEvents ? events : [events[0]]).map((event, index) => (
                <EventCard key={`${event.id}-${index}`} {...event} />
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Belum ada event mendatang</p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2E2557]">Produk Reog</h3>
            <span className="text-sm text-gray-600 font-medium">
              {filteredProducts.length} produk
            </span>
          </div>
          
          {/* Product Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
            {productCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-[#E97DB4] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 pb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 pb-6">
            {filteredProducts.map((product, index) => <ProductCard key={`${product.id}-${index}`} {...product} />)}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm mb-6">
            <p className="text-gray-500 text-sm">
              {activeCategory === 'Semua' 
                ? 'Belum ada produk tersedia' 
                : `Belum ada produk kategori ${activeCategory}`}
            </p>
          </div>
        )}
      </div>
    </div>;
}