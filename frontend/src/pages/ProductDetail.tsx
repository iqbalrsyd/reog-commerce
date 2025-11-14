import { useState, useEffect } from 'react';
import { ArrowLeftIcon, EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, StoreIcon, ShoppingCartIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { formatProductPrice } from '../lib/currency';

export function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);

  // Get outlet name from localStorage
  const outlet = JSON.parse(localStorage.getItem('outlet') || '{}');
  const outletName = outlet.name || 'Nama Outlet';

  // Check if this is seller view (URL starts with /seller/)
  const isSellerView = window.location.pathname.startsWith('/seller/');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;

        const response = await api.get(`/products/${id}`);
        const product = response.data.data;

        setProductData(product);
      } catch (error) {
        console.error('Error fetching product:', error);
        // For now, use dummy data as fallback
        setProductData({
          name: 'Topeng Singa Barong Premium Ukir Kayu Mahoni',
          price: { min: 3200000 },
          category: 'Topeng',
          condition: 'Baru',
          stock: 8,
          description: 'Topeng Singa Barong adalah elemen paling ikonik dalam kesenian Reog Ponorogo.',
          additionalInfo: [
            { label: 'Material', value: 'Kayu Mahoni Pilihan' },
            { label: 'Ukuran', value: '40 x 50 cm (Panjang x Lebar)' },
            { label: 'Berat', value: '3.5 kg' },
            { label: 'Asal', value: 'Desa Setono, Jenangan, Ponorogo' }
          ],
          images: [
            'https://imgs.search.brave.com/ilmeyRDzMht7VejfLizgAWfQHBnyFqx-F-GHBTzCU_4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/aW5ld3MuY28uaWQv/bWVkaWEvMTA1MC9m/aWxlcy9pbmV3c19u/ZXcvMjAyMy8wOC8w/My9SZW9nX1Bvbm9y/b2dvLmpwZw',
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Product data is now fetched and stored in productData state

  // WhatsApp configuration
  const whatsappNumber = '6285136994744'; // Format: country code + number (no + or spaces)
  
  const handleWhatsAppContact = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    const message = `Halo, saya tertarik dengan produk berikut:\n\n` +
                   `*${productData.name}*\n` +
                   `Harga: ${productData.price}\n` +
                   `Kategori: ${productData.category}\n` +
                   `Material: ${productData.material}\n` +
                   `Ukuran: ${productData.size}\n\n` +
                   `Apakah produk ini masih tersedia?`;
    
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

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "events": []}');
    
    // Add product to cart
    const cartItem = {
      id: id || '1',
      type: 'product',
      image: productImages[0],
      title: productData.name,
      price: formatProductPrice(productData.price?.min || 0, productData.price?.max),
      priceNumber: productData.price?.min || 0,
      quantity: 1,
      category: productData.category,
      seller: outletName
    };

    // Check if product already exists in cart
    const existingIndex = existingCart.products.findIndex((item: any) => item.id === cartItem.id);
    
    if (existingIndex >= 0) {
      // Increment quantity if exists
      existingCart.products[existingIndex].quantity += 1;
    } else {
      // Add new item
      existingCart.products.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show notification or navigate to cart
    alert('Produk berhasil ditambahkan ke keranjang!');
  };

  // Get product images from fetched data or fallback
  const productImages = productData?.images || [
    'https://imgs.search.brave.com/ilmeyRDzMht7VejfLizgAWfQHBnyFqx-F-GHBTzCU_4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/aW5ld3MuY28uaWQv/bWVkaWEvMTA1MC9m/aWxlcy9pbmV3c19u/ZXcvMjAyMy8wOC8w/My9SZW9nX1Bvbm9y/b2dvLmpwZw',
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
  if (loading || !productData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E97DB4] border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat detail produk...</p>
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
                <ShoppingCartIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Login Diperlukan
              </h3>
              <p className="text-gray-600 text-sm">
                Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang atau menghubungi penjual
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
            {productData.name}
          </h2>
          <p className="text-2xl font-bold text-[#800000] mb-4">
            {formatProductPrice(productData.price?.min || 0, productData.price?.max)}
          </p>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {productData.description}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Informasi Produk
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Penjual</span>
                <span className="font-medium flex items-center gap-1">
                  <StoreIcon className="w-3 h-3 text-[#5B7B6F]" />
                  {outletName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kondisi</span>
                <span className="font-medium">{productData.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stok</span>
                <span className="font-medium">{productData.stock} unit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori</span>
                <span className="font-medium">{productData.category}</span>
              </div>
              {productData.additionalInfo?.map((info: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{info.label}</span>
                  <span className="font-medium">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-30">
        {isSellerView ? (
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
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#E97DB4] to-[#C75B8A] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Keranjang
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
          </div>
        )}
      </div>
    </div>;
}