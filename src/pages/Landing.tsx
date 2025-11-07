import { useState } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { EventCard } from '../components/EventCard';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export function Landing() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllEvents, setShowAllEvents] = useState(false);
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
    subtitle: 'Bergabunglah dalam perayaan budaya terbesar tahun ini',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    buttonText: 'Lihat Event'
  }, {
    title: 'Koleksi Topeng Eksklusif',
    subtitle: 'Topeng Reog handmade dari pengrajin terbaik',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    buttonText: 'Jelajahi'
  }];
  
  const events = [{
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    title: 'Festival Reog Ponorogo 2024',
    price: 'Rp 50.000 - Rp 150.000',
    location: 'Alun-alun Ponorogo',
    date: '25 Feb 2024, 19:00 WIB'
  }, {
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Workshop Tari Reog untuk Pemula',
    price: 'Rp 200.000',
    location: 'Sanggar Seni Ponorogo',
    date: '15 Mar 2024, 09:00 WIB'
  }, {
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    title: 'Pagelaran Wayang Kulit Reog',
    price: 'Gratis',
    location: 'Pendopo Kabupaten Ponorogo',
    date: '20 Mar 2024, 20:00 WIB'
  }];
  
  const products = [{
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Topeng Singa Barong Premium',
    price: 'Rp 2.5jt - Rp 3.5jt',
    location: 'Ponorogo'
  }, {
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Kostum Barongan Lengkap',
    price: 'Rp 5.0jt - Rp 6.0jt',
    location: 'Ponorogo'
  }, {
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
    title: 'Properti Dadak Merak Handmade',
    price: 'Rp 1.2jt',
    location: 'Madiun'
  }, {
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Kostum Tari Reog Anak',
    price: 'Rp 850.000',
    location: 'Ponorogo'
  }, {
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Topeng Reog Warok',
    price: 'Rp 1.8jt',
    location: 'Ponorogo'
  }];
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };
  return <div className="min-h-screen bg-[#F5F5F5]">
      <Header notificationCount={2} />
      <div className="relative">
        <div className="relative h-72 overflow-hidden">
          {heroSlides.map((slide, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <div className="relative h-full">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#2E2557] bg-opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-sm mb-4 opacity-90">{slide.subtitle}</p>
                  <button className="bg-[#E97DB4] text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>)}

          {/* Slide Indicators with Navigation Buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            {/* Previous Button */}
            <button onClick={prevSlide} className="bg-white/95 hover:bg-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110">
              <ChevronLeftIcon className="w-4 h-4 text-[#2E2557]" />
            </button>
            
            {/* Dot Indicators */}
            <div className="flex gap-2">
              {heroSlides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />)}
            </div>

            {/* Next Button */}
            <button onClick={nextSlide} className="bg-white/95 hover:bg-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110">
              <ChevronRightIcon className="w-4 h-4 text-[#2E2557]" />
            </button>
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