import { useState } from 'react';
import { ArrowLeftIcon, UploadIcon, XIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventContent {
  id: string;
  content: string;
}

interface PricingCategory {
  id: string;
  category: string;
  price: string;
  benefits: string;
}

export function AddEvent() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [eventContents, setEventContents] = useState<EventContent[]>([
    { id: '1', content: '' }
  ]);
  const [pricingCategories, setPricingCategories] = useState<PricingCategory[]>([
    { id: '1', category: 'CAT A', price: '', benefits: '' }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addEventContent = () => {
    const newId = (eventContents.length + 1).toString();
    setEventContents([...eventContents, { id: newId, content: '' }]);
  };

  const removeEventContent = (id: string) => {
    setEventContents(eventContents.filter(item => item.id !== id));
  };

  const updateEventContent = (id: string, value: string) => {
    setEventContents(eventContents.map(item =>
      item.id === id ? { ...item, content: value } : item
    ));
  };

  const addPricingCategory = () => {
    const newId = (pricingCategories.length + 1).toString();
    const categoryLabel = String.fromCharCode(65 + pricingCategories.length); // A, B, C, D...
    setPricingCategories([...pricingCategories, { id: newId, category: `CAT ${categoryLabel}`, price: '', benefits: '' }]);
  };

  const removePricingCategory = (id: string) => {
    setPricingCategories(pricingCategories.filter(item => item.id !== id));
  };

  const updatePricingCategory = (id: string, field: keyof PricingCategory, value: string) => {
    setPricingCategories(pricingCategories.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">Tambah Event</h1>
          <div className="w-9" />
        </div>
      </div>
      <div className="px-4 py-6 pb-24">
        <form className="space-y-4">
          {/* Multiple Image Upload */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Event
            </label>
            
            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-[#E97DB4] text-white text-xs px-2 py-0.5 rounded">
                        Foto Utama
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 10 && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#E97DB4] transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Klik untuk upload foto ({images.length}/10 foto)
                </p>
              </label>
            )}
          </div>

          {/* Event Name */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Event
            </label>
            <input
              type="text"
              placeholder="Masukkan nama event"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Event
            </label>
            <textarea
              placeholder="Jelaskan event Anda"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            />
          </div>

          {/* Event Contents (Rangkaian Acara) */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Rangkaian Acara
              </label>
              <button
                type="button"
                onClick={addEventContent}
                className="text-[#E97DB4] hover:text-[#d66b9f] font-medium text-sm flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Tambah
              </button>
            </div>
            <div className="space-y-2">
              {eventContents.map((item, index) => (
                <div key={item.id} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Acara ${index + 1}`}
                    value={item.content}
                    onChange={(e) => updateEventContent(item.id, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
                  />
                  {eventContents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEventContent(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tips: Tambahkan acara seperti "Tari Reog Ponorogo klasik", "Pertunjukan Wayang Kulit", dll.
            </p>
          </div>

          {/* Date and Time */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Event
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waktu Mulai
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waktu Selesai
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi
            </label>
            <input
              type="text"
              placeholder="Nama tempat (misal: Alun-alun Ponorogo)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4] mb-3"
            />
            <input
              type="text"
              placeholder="Alamat lengkap (misal: Jl. Alun-alun Utara No. 1)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            />
          </div>

          {/* Capacity */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapasitas
            </label>
            <input
              type="number"
              placeholder="Jumlah orang"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            />
          </div>

          {/* Pricing Categories */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Kategori Harga Tiket
              </label>
              <button
                type="button"
                onClick={addPricingCategory}
                className="text-[#E97DB4] hover:text-[#d66b9f] font-medium text-sm flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Tambah Kategori
              </button>
            </div>
            <div className="space-y-3">
              {pricingCategories.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      placeholder="Kategori (misal: CAT A)"
                      value={item.category}
                      onChange={(e) => updatePricingCategory(item.id, 'category', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4] mr-2"
                    />
                    {pricingCategories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePricingCategory(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    placeholder="Harga (Rp)"
                    value={item.price}
                    onChange={(e) => updatePricingCategory(item.id, 'price', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4] mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Benefit (misal: VIP seating, meet & greet)"
                    value={item.benefits}
                    onChange={(e) => updatePricingCategory(item.id, 'benefits', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tips: Kategori harga seperti CAT A (VIP), CAT B (Reserved), CAT C (General)
            </p>
          </div>
        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-30">
        <button className="w-full bg-[#E97DB4] text-white py-3 rounded-lg font-semibold hover:bg-[#d66b9f] transition-colors">
          Simpan Event
        </button>
      </div>
    </div>;
}