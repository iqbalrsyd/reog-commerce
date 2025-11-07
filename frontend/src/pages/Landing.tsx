import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { EventCard } from '../components/EventCard';
export function Landing() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const productCategories = [
    'Semua',
    'Topeng',
    'Kostum',
    'Wayang',
    'Properti',
    'Dadak Merak',
    'Kendang'
  ];
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
  
  const events = [{
    id: 1,
    image: 'https://imgs.search.brave.com/2rhctqGr9I4l4rD3jOihRii3k8FHjpVpv2sELIWTexc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93b25k/ZXJmdWxpbWFnZS5z/My1pZC1qa3QtMS5r/aWxhdHN0b3JhZ2Uu/aWQvMTY1OTI3NTE4/OS1mZXN0aXZhbC1y/ZW9nLXBvbm9yb2dv/LTIwMjItMzYtanBn/LXRodW1iLmpwZw',
    title: 'Festival Grebeg Suro Ponorogo 2024',
    price: 'Rp 50.000 - Rp 150.000',
    location: 'Alun-alun Ponorogo',
    date: '1 Suro 1946 (25 Feb 2024), 19:00 WIB'
  }, {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Pelatihan Tari Reog Tradisional',
    price: 'Rp 250.000',
    location: 'Sanggar Seni Wayang Kulit Ponorogo',
    date: '10 Maret 2024, 08:00 - 16:00 WIB'
  }, {
    id: 3,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    title: 'Pagelaran Wayang Kulit Semalam Suntuk',
    price: 'Gratis',
    location: 'Pendopo Kabupaten Ponorogo',
    date: '17 Maret 2024, 20:00 - 05:00 WIB'
  }, {
    id: 4,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Workshop Pembuatan Topeng Reog',
    price: 'Rp 300.000',
    location: 'Desa Setono, Jenangan, Ponorogo',
    date: '24 Maret 2024, 09:00 - 15:00 WIB'
  }, {
    id: 5,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
    title: 'Pentas Seni Dadak Merak Festival',
    price: 'Rp 75.000 - Rp 200.000',
    location: 'Taman Thypoday Ponorogo',
    date: '5 April 2024, 18:00 - 22:00 WIB'
  }];
  
  const products = [{
    id: 1,
    image: 'https://imgs.search.brave.com/ilmeyRDzMht7VejfLizgAWfQHBnyFqx-F-GHBTzCU_4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/aW5ld3MuY28uaWQv/bWVkaWEvMTA1MC9m/aWxlcy9pbmV3c19u/ZXcvMjAyMy8wOC8w/My9SZW9nX1Bvbm9y/b2dvLmpwZw',
    title: 'Topeng Singa Barong Premium Ukir Kayu Mahoni',
    price: 'Rp 3.200.000',
    location: 'Desa Setono, Ponorogo'
  }, {
    id: 2,
    image: 'https://imgs.search.brave.com/UEnlQcJytx2-PLEfv9Alvg4KqtHJdA2hEAtD1wEIVZg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZi5z/aG9wZWUuY28uaWQv/ZmlsZS9pZC0xMTEz/NDI3NS03cmJrOC1t/OXpkcjlreXExMmw5/MQ',
    title: 'Dadak Merak Bulu Merak Asli 3 Meter',
    price: 'Rp 8.500.000',
    location: 'Desa Tegalsari, Ponorogo'
  }, {
    id: 3,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
    title: 'Kostum Warok Lengkap (Baju + Celana Komprang)',
    price: 'Rp 1.800.000',
    location: 'Ponorogo Kota'
  }, {
    id: 4,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Topeng Bujang Ganong Kayu Jati',
    price: 'Rp 2.500.000',
    location: 'Desa Setono, Ponorogo'
  }, {
    id: 5,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Kuda Kepang Jathilan Set Lengkap (4 Kuda)',
    price: 'Rp 6.000.000',
    location: 'Jenangan, Ponorogo'
  }, {
    id: 6,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    title: 'Kendang Reog Kulit Sapi Asli',
    price: 'Rp 1.200.000',
    location: 'Babadan, Ponorogo'
  }, {
    id: 7,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Barongsai Mini untuk Anak-anak',
    price: 'Rp 950.000',
    location: 'Ponorogo Kota'
  }, {
    id: 8,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
    title: 'Angklung Reog Set 8 Nada',
    price: 'Rp 1.500.000',
    location: 'Mlarak, Ponorogo'
  }];
  
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
            {!showAllEvents && events.length > 1 && (
              <button 
                onClick={() => setShowAllEvents(true)}
                className="text-sm text-[#E97DB4] font-semibold hover:text-[#d66b9f] transition-colors"
              >
                Lihat Lebih Banyak →
              </button>
            )}
            {showAllEvents && (
              <button 
                onClick={() => setShowAllEvents(false)}
                className="text-sm text-[#E97DB4] font-semibold hover:text-[#d66b9f] transition-colors"
              >
                Lihat Lebih Sedikit ←
              </button>
            )}
          </div>
          <div className="space-y-3">
            {(showAllEvents ? events : [events[0]]).map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2E2557]">Produk Reog</h3>
            <span className="text-sm text-gray-600 font-medium">
              {products.length} produk
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
        <div className="grid grid-cols-2 gap-4 pb-6">
          {products.map((product, index) => <ProductCard key={index} {...product} />)}
        </div>
      </div>
    </div>;
}