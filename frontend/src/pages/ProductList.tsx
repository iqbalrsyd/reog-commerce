import React from 'react';
import { Header } from '../components/Header';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useNavigate } from 'react-router-dom';
export function ProductList() {
  const navigate = useNavigate();
  const products = [{
    id: 1,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Topeng Singa Barong Premium',
    price: 'Rp 2.500.000',
    status: 'Tersedia'
  }, {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Kostum Barongan Lengkap',
    price: 'Rp 5.000.000',
    status: 'Tersedia'
  }, {
    id: 3,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
    title: 'Properti Dadak Merak',
    price: 'Rp 1.200.000',
    status: 'Habis'
  }];
  return <div className="min-h-screen bg-gray-50 pb-6">
      <Header isSeller={true} />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Daftar Produk</h1>
        <div className="space-y-4">
          {products.map(product => <div key={product.id} onClick={() => navigate(`/seller/product/${product.id}`)} className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex gap-4">
                <img src={product.image} alt={product.title} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-[#800000] font-bold text-lg mb-2">
                    {product.price}
                  </p>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${product.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      <FloatingActionButton onClick={() => navigate('/seller/add-product')} />
    </div>;
}