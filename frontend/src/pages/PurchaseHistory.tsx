import { Header } from '../components/Header';
export function PurchaseHistory() {
  const purchases = [{
    id: 1,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    title: 'Topeng Reog Handmade Premium',
    price: 'Rp 850.000',
    date: '15 Jan 2024',
    status: 'Selesai'
  }, {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    title: 'Batik Reog Motif Klasik',
    price: 'Rp 450.000',
    date: '10 Jan 2024',
    status: 'Dalam Pengiriman'
  }];
  return <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Riwayat Pembelian
        </h1>
        <div className="space-y-4">
          {purchases.map(purchase => <div key={purchase.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex gap-4">
                <img src={purchase.image} alt={purchase.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 mb-1">
                    {purchase.title}
                  </h3>
                  <p className="text-[#800000] font-bold text-base mb-2">
                    {purchase.price}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {purchase.date}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${purchase.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {purchase.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}