import { useState } from 'react';
import { ArrowLeftIcon, EditIcon, TrashIcon, CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function EventDetail() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
  const eventContents = ['Tari Reog Ponorogo klasik dengan 40 penari', 'Pertunjukan Wayang Kulit oleh dalang terkenal', 'Tari Jathilan dengan kuda kepang tradisional', 'Penampilan Barongsai dan Dadak Merak', 'Pameran kerajinan dan kuliner khas Ponorogo', 'Workshop membuat topeng Reog untuk anak-anak'];
  const pricingCategories = [{
    category: 'CAT A',
    price: 'Rp 150.000',
    benefits: 'VIP seating, meet & greet'
  }, {
    category: 'CAT B',
    price: 'Rp 100.000',
    benefits: 'Reserved seating'
  }, {
    category: 'CAT C',
    price: 'Rp 50.000',
    benefits: 'General admission'
  }];
  return <div className="min-h-screen bg-gray-50">
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
            Festival Reog Ponorogo 2024
          </h2>
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Deskripsi Event
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Festival Reog Ponorogo tahunan yang menampilkan berbagai
              pertunjukan seni dan budaya. Acara ini menampilkan penari Reog
              terbaik dari berbagai daerah dan berbagai atraksi budaya lainnya.
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
                  <p className="font-medium">25 Februari 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Waktu</p>
                  <p className="font-medium">19:00 - 22:00 WIB (3 jam)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Lokasi</p>
                  <p className="font-medium">Alun-alun Ponorogo, Jawa Timur</p>
                  <p className="text-xs text-gray-500 mt-0.5">Jl. Alun-alun Utara No. 1</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UsersIcon className="w-5 h-5 text-[#800000] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Kapasitas</p>
                  <p className="font-medium">500 orang</p>
                  <p className="text-xs text-gray-500 mt-0.5">120 tiket tersisa</p>
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
      </div>
    </div>;
}