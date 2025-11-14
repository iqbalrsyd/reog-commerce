import { useState } from 'react';
import { ArrowLeftIcon, UploadIcon, XIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface ProductInfo {
  id: string;
  label: string;
  value: string;
}

export function AddProduct() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo[]>([
    { id: '1', label: 'Ukuran', value: '' },
    { id: '2', label: 'Material', value: '' },
    { id: '3', label: 'Berat', value: '' },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newFiles]);
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      URL.revokeObjectURL(prev[index]); // Clean up object URL
      return prev.filter((_, i) => i !== index);
    });
  };

  const addProductInfo = () => {
    const newId = (productInfo.length + 1).toString();
    setProductInfo(prev => [...prev, { id: newId, label: '', value: '' }]);
  };

  const removeProductInfo = (id: string) => {
    setProductInfo(prev => prev.filter(info => info.id !== id));
  };

  const updateProductInfoLabel = (id: string, label: string) => {
    setProductInfo(prev =>
      prev.map(info => (info.id === id ? { ...info, label } : info))
    );
  };

  const updateProductInfoValue = (id: string, value: string) => {
    setProductInfo(prev =>
      prev.map(info => (info.id === id ? { ...info, value } : info))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!name.trim()) {
      alert('Nama produk harus diisi');
      return;
    }
    if (!priceMin) {
      alert('Harga minimum harus diisi');
      return;
    }
    if (images.length === 0) {
      alert('Minimal harus ada 1 foto produk');
      return;
    }

    // Get outlet data
    const outlet = JSON.parse(localStorage.getItem('outlet') || '{}');
    if (!outlet.id) {
      alert('Anda harus memiliki outlet untuk menambah produk');
      navigate('/create-outlet');
      return;
    }

    // Filter productInfo yang sudah diisi
    const validProductInfo = productInfo.filter(
      info => info.label.trim() && info.value.trim()
    );

    if (validProductInfo.length === 0) {
      alert('Minimal harus ada 1 informasi produk');
      return;
    }

    // Prepare data sesuai schema backend
    const productData = {
      name: name.trim(),
      description: description.trim(),
      category: category || 'Kerajinan',
      price: {
        min: parseInt(priceMin),
        ...(priceMax && priceMax !== '' ? { max: parseInt(priceMax) } : {})
      },
      stock: parseInt(stock) || 0,
      additionalInfo: validProductInfo.map(info => ({
        label: info.label.trim(),
        value: info.value.trim()
      })),
      condition: 'Baru',
      outletId: outlet.id,
      tags: [],
    };

    // Create FormData untuk upload images
    const formData = new FormData();
    formData.append('data', JSON.stringify(productData));
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      setLoading(true);

      // Call backend API
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Produk berhasil ditambahkan!');
      navigate('/product-dashboard');
    } catch (error: any) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan produk. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">Tambah Produk</h1>
          <div className="w-9" />
        </div>
      </div>
      <div className="px-4 py-6 pb-24">
        <form id="product-form" className="space-y-4" onSubmit={handleSubmit}>
          {/* Upload Multiple Images */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Produk (Maksimal 10 foto)
            </label>
            
            {/* Image Preview Grid */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-[#E97DB4] text-white text-xs py-1 text-center font-medium">
                        Foto Utama
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {imagePreview.length < 10 && (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E97DB4] transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {imagePreview.length === 0 ? 'Klik untuk upload foto' : 'Tambah foto lainnya'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {imagePreview.length} / 10 foto
                </p>
              </label>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk
            </label>
            <input 
              type="text" 
              placeholder="Masukkan nama produk" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]" 
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea 
              placeholder="Jelaskan produk Anda" 
              rows={4} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]" 
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Harga
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Harga Minimum</label>
                <input
                  type="number"
                  placeholder="Rp 0"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Harga Maksimum (Opsional)</label>
                <input
                  type="number"
                  placeholder="Rp 0"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kosongkan jika harga tetap
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]"
            >
              <option value="">Pilih kategori</option>
              <option value="Kerajinan">Kerajinan</option>
              <option value="Topeng">Topeng</option>
              <option value="Pakaian">Pakaian</option>
              <option value="Wayang">Wayang</option>
            </select>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stok
            </label>
            <input 
              type="number" 
              placeholder="0" 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4]" 
            />
          </div>

          {/* Dynamic Product Information */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Informasi Produk
              </label>
              <button
                type="button"
                onClick={addProductInfo}
                className="flex items-center gap-1 text-sm text-[#E97DB4] font-semibold hover:text-[#d66b9f] transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Tambah Info
              </button>
            </div>

            <div className="space-y-3">
              {productInfo.map((info) => (
                <div key={info.id} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Label (contoh: Ukuran)"
                      value={info.label}
                      onChange={(e) => updateProductInfoLabel(info.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4] text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Nilai (contoh: 35 x 40 cm)"
                      value={info.value}
                      onChange={(e) => updateProductInfoValue(info.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E97DB4] text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProductInfo(info.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 Tips: Tambahkan informasi seperti Ukuran, Material, Berat, Warna, Kondisi, dll.
              </p>
            </div>
          </div>
        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-30">
        <button
          type="submit"
          form="product-form"
          className="w-full bg-[#E97DB4] text-white py-3 rounded-lg font-semibold hover:bg-[#d66b9f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
      </div>
    </div>;
}