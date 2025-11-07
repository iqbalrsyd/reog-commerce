import { useState } from 'react';
import { Header } from '../components/Header';
import { ArrowLeftIcon, EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function ProductDetail() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of product images
  const productImages = [
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">Detail Produk</h1>
          <div className="w-9" />
        </div>
      </div>
      <div className="pb-24">
        {/* Image Carousel */}
        <div className="relative h-64 bg-gray-200">
          {/* Images */}
          {productImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Navigation Buttons */}
          {productImages.length > 1 && (
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
                {productImages.map((_, index) => (
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
                {currentImageIndex + 1} / {productImages.length}
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Topeng Reog Handmade Premium
          </h2>
          <p className="text-2xl font-bold text-[#800000] mb-4">Rp 850.000</p>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Topeng Reog handmade premium dengan kualitas terbaik. Dibuat oleh
              pengrajin berpengalaman dengan detail yang sangat teliti. Cocok
              untuk koleksi atau pertunjukan seni.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Informasi Produk
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Kondisi</span>
                <span className="font-medium">Baru</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stok</span>
                <span className="font-medium">12 unit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori</span>
                <span className="font-medium">Topeng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Material</span>
                <span className="font-medium">Kayu Mahoni</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ukuran</span>
                <span className="font-medium">35 x 40 cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Berat</span>
                <span className="font-medium">2 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Asal</span>
                <span className="font-medium">Ponorogo, Jawa Timur</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimasi Produksi</span>
                <span className="font-medium">7-14 hari</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-30">
        <div className="flex gap-3">
          <button className="flex-1 bg-[#E97DB4] text-white py-3 rounded-lg font-semibold hover:bg-[#d66b9f] transition-colors flex items-center justify-center gap-2">
            <EditIcon className="w-5 h-5" />
            Edit
          </button>
          <button className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <TrashIcon className="w-5 h-5" />
            Hapus
          </button>
        </div>
      </div>
    </div>;
}