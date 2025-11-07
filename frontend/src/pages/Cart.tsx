import { Header } from '../components/Header';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
export function Cart() {
  const cartItems = [{
    id: 1,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Topeng Reog Handmade Premium',
    price: 850000,
    quantity: 1
  }, {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Batik Reog Motif Klasik',
    price: 450000,
    quantity: 2
  }];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Keranjang Belanja
        </h1>
        <div className="space-y-4">
          {cartItems.map(item => <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex gap-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[#800000] font-bold text-base mb-3">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="text-red-500 hover:text-red-600">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-medium">Total</span>
          <span className="text-xl font-bold text-[#800000]">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>
        <button className="w-full bg-[#E97DB4] text-white py-3 rounded-lg font-semibold hover:bg-[#d66b9f] transition-colors">
          Lanjut Pembayaran
        </button>
      </div>
    </div>;
}