import { useState } from 'react';
import { ArrowLeftIcon, UploadIcon, XIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    date: '',
    startTime: '19:00',
    endTime: '23:00',
    locationName: '',
    locationAddress: '',
    capacity: ''
  });

  const [eventContents, setEventContents] = useState<EventContent[]>([
    { id: '1', content: '' }
  ]);
  const [pricingCategories, setPricingCategories] = useState<PricingCategory[]>([
    { id: '1', category: 'CAT A', price: '', benefits: '' }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));

      // Limit to 10 images
      const remainingSlots = 10 - images.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      const previewsToAdd = newPreviews.slice(0, remainingSlots);

      setImages(prev => [...prev, ...filesToAdd]);
      setImagePreviews(prev => [...prev, ...previewsToAdd]);
    }
  };

  const removeImage = (index: number) => {
    // Clean up object URL
    URL.revokeObjectURL(imagePreviews[index]);

    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Form input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Nama event harus diisi');
      return;
    }
    if (!formData.date) {
      alert('Tanggal event harus diisi');
      return;
    }
    if (!formData.locationName.trim()) {
      alert('Lokasi harus diisi');
      return;
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      alert('Kapasitas harus lebih dari 0');
      return;
    }
    if (images.length === 0) {
      alert('Minimal harus ada 1 foto event');
      return;
    }

    // Check outlet
    const outlet = JSON.parse(localStorage.getItem('outlet') || '{}');
    if (!outlet.id) {
      alert('Anda harus memiliki outlet untuk menambah event');
      navigate('/create-outlet');
      return;
    }

    // Validate pricing categories
    const validPricingCategories = pricingCategories.filter(
      cat => cat.category.trim() && cat.price && parseInt(cat.price) > 0
    );

    if (validPricingCategories.length === 0) {
      alert('Minimal harus ada 1 kategori harga dengan harga yang valid');
      return;
    }

    // Prepare event data
    const eventData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category || 'Festival',
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: {
        name: formData.locationName.trim(),
        address: formData.locationAddress.trim(),
        coordinates: null
      },
      capacity: parseInt(formData.capacity),
      ticketCategories: validPricingCategories.map(cat => ({
        category: cat.category.trim(),
        price: parseInt(cat.price),
        benefits: cat.benefits.trim(),
        quota: Math.floor(parseInt(formData.capacity) / validPricingCategories.length) // Distribute capacity
      })),
      eventProgram: eventContents
        .filter(content => content.content.trim())
        .map(content => content.content.trim()),
      outletId: outlet.id,
      tags: [],
    };

    // Create FormData for file upload
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('data', JSON.stringify(eventData));
    images.forEach((image) => {
      formDataToSubmit.append('images', image);
    });

    try {
      setLoading(true);

      const response = await api.post('/events', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Event berhasil ditambahkan!');
      navigate('/event-dashboard');
    } catch (error: any) {
      console.error('Error saving event:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan event. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Multiple Image Upload */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Event
            </label>
            
            {/* Image Preview Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
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
                      <div className="absolute bottom-1 left-1 bg-[#4A9B9B] text-white text-xs px-2 py-0.5 rounded">
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
              name="name"
              placeholder="Masukkan nama event"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Event
            </label>
            <textarea
              name="description"
              placeholder="Jelaskan event Anda"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Event
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
            >
              <option value="">Pilih kategori</option>
              <option value="Festival">Festival</option>
              <option value="Pertunjukan">Pertunjukan</option>
              <option value="Workshop">Workshop</option>
              <option value="Konser">Konser</option>
            </select>
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
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waktu Mulai
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waktu Selesai
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi
            </label>
            <input
              type="text"
              name="locationName"
              placeholder="Nama tempat (misal: Alun-alun Ponorogo)"
              value={formData.locationName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B] mb-3"
            />
            <input
              type="text"
              name="locationAddress"
              placeholder="Alamat lengkap (misal: Jl. Alun-alun Utara No. 1)"
              value={formData.locationAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
            />
          </div>

          {/* Capacity */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapasitas
            </label>
            <input
              type="number"
              name="capacity"
              placeholder="Jumlah orang"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A9B9B]"
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
        <button
          type="submit"
          className="w-full bg-[#4A9B9B] text-white py-3 rounded-lg font-semibold hover:bg-[#3a8080] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Event'}
        </button>
      </div>
    </div>;
}