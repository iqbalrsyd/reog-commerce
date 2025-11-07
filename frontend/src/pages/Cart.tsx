import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { MinusIcon, PlusIcon, TrashIcon, PackageIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Cart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<any>({ products: [], events: [] });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAction, setDeleteAction] = useState<any>(null);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartData(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCartData: any) => {
    setCartData(newCartData);
    localStorage.setItem('cart', JSON.stringify(newCartData));
  };

  const handleQuantityChange = (type: 'products' | 'events', id: string, delta: number) => {
    const newCartData = { ...cartData };
    const items = newCartData[type];
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index >= 0) {
      const newQuantity = items[index].quantity + delta;
      
      // If quantity akan menjadi 0, tanyakan konfirmasi
      if (newQuantity <= 0) {
        const itemName = items[index].title;
        const itemType = type === 'products' ? 'produk' : 'tiket';
        const category = items[index].category ? ` ${items[index].category}` : '';
        
        setDeleteAction({
          type: 'quantity',
          execute: () => {
            items.splice(index, 1);
            updateCart(newCartData);
          },
          message: `Yakin ingin menghapus ${itemType}${category}?`,
          subMessage: itemName
        });
        setShowDeleteConfirm(true);
      } else {
        items[index].quantity = newQuantity;
        updateCart(newCartData);
      }
    }
  };

  const handleRemoveItem = (type: 'products' | 'events', id: string) => {
    const newCartData = { ...cartData };
    const item = newCartData[type].find((item: any) => item.id === id);
    
    if (item) {
      const itemType = type === 'products' ? 'produk' : 'tiket';
      const category = item.category ? ` ${item.category}` : '';
      
      setDeleteAction({
        type: 'item',
        execute: () => {
          newCartData[type] = newCartData[type].filter((item: any) => item.id !== id);
          updateCart(newCartData);
        },
        message: `Yakin ingin menghapus ${itemType}${category}?`,
        subMessage: item.title
      });
      setShowDeleteConfirm(true);
    }
  };

  const handleRemoveEventGroup = (eventId: string) => {
    const newCartData = { ...cartData };
    const eventItems = newCartData.events.filter((item: any) => item.eventId === eventId);
    
    if (eventItems.length > 0) {
      const totalTickets = eventItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      
      setDeleteAction({
        type: 'event-group',
        execute: () => {
          newCartData.events = newCartData.events.filter((item: any) => item.eventId !== eventId);
          updateCart(newCartData);
        },
        message: `Yakin ingin menghapus semua tiket event ini?`,
        subMessage: `${eventItems[0].title} (${totalTickets} tiket)`
      });
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    if (deleteAction?.execute) {
      deleteAction.execute();
    }
    setShowDeleteConfirm(false);
    setDeleteAction(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteAction(null);
  };

  // Group events by eventId
  const groupedEvents = cartData.events.reduce((groups: any, item: any) => {
    const eventId = item.eventId || item.id;
    if (!groups[eventId]) {
      groups[eventId] = {
        eventId,
        title: item.title,
        image: item.image,
        date: item.date,
        location: item.location,
        tickets: []
      };
    }
    groups[eventId].tickets.push(item);
    return groups;
  }, {});

  const productTotal = cartData.products.reduce((sum: number, item: any) => sum + item.priceNumber * item.quantity, 0);
  const eventTotal = cartData.events.reduce((sum: number, item: any) => sum + item.priceNumber * item.quantity, 0);
  const total = productTotal + eventTotal;
  
  const uniqueEventsCount = Object.keys(groupedEvents).length;
  return <div className="min-h-screen bg-gray-50 pb-24">
      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && deleteAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[slideIn_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {deleteAction.message}
              </h3>
              <p className="text-gray-600 text-sm font-medium">
                {deleteAction.subMessage}
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={confirmDelete}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Ya, Hapus
              </button>
              <button
                onClick={cancelDelete}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <Header />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Keranjang Belanja
        </h1>

        {/* Products Section */}
        {cartData.products.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <PackageIcon className="w-5 h-5 text-[#E97DB4]" />
              <h2 className="text-lg font-semibold text-gray-800">Produk ({cartData.products.length})</h2>
            </div>
            <div className="space-y-3">
              {cartData.products.map((item: any) => <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={() => navigate(`/product/${item.id}`)}
                    />
                    <div className="flex-1">
                      <h3 
                        className="font-semibold text-sm text-gray-800 mb-1 cursor-pointer hover:text-[#E97DB4] transition-colors"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.title}
                      </h3>
                      {item.category && (
                        <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                      )}
                      <p className="text-[#800000] font-bold text-base mb-3">
                        {item.price}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleQuantityChange('products', item.id, -1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange('products', item.id, 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem('products', item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        )}

        {/* Events Section - Grouped by Event */}
        {cartData.events.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-5 h-5 text-[#E97DB4]" />
              <h2 className="text-lg font-semibold text-gray-800">Event ({uniqueEventsCount})</h2>
            </div>
            <div className="space-y-3">
              {Object.values(groupedEvents).map((eventGroup: any) => {
                const totalTickets = eventGroup.tickets.reduce((sum: number, t: any) => sum + t.quantity, 0);
                const totalPrice = eventGroup.tickets.reduce((sum: number, t: any) => sum + (t.priceNumber * t.quantity), 0);
                
                return (
                  <div key={eventGroup.eventId} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex gap-4 mb-3">
                      <img 
                        src={eventGroup.image} 
                        alt={eventGroup.title} 
                        className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => navigate(`/event/${eventGroup.eventId}`)}
                      />
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-sm text-gray-800 mb-1 cursor-pointer hover:text-[#E97DB4] transition-colors"
                          onClick={() => navigate(`/event/${eventGroup.eventId}`)}
                        >
                          {eventGroup.title}
                        </h3>
                        {eventGroup.date && (
                          <p className="text-xs text-gray-500 mb-1">📅 {eventGroup.date}</p>
                        )}
                        {eventGroup.location && (
                          <p className="text-xs text-gray-500 mb-1">📍 {eventGroup.location}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleRemoveEventGroup(eventGroup.eventId)}
                        className="text-red-500 hover:text-red-600 h-8"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Ticket Categories Breakdown */}
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      {eventGroup.tickets.map((ticket: any) => (
                        <div key={ticket.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-xs text-[#800000]">{ticket.category}</span>
                              {ticket.benefits && (
                                <span className="text-xs text-gray-500">• {ticket.benefits}</span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-gray-800">{ticket.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleQuantityChange('events', ticket.id, -1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <MinusIcon className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-medium text-sm w-8 text-center">{ticket.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange('events', ticket.id, 1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total for this event */}
                    <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Total ({totalTickets} tiket)</span>
                      <span className="text-base font-bold text-[#800000]">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty Cart Message */}
        {cartData.products.length === 0 && cartData.events.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <PackageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Keranjang Kosong</h3>
            <p className="text-gray-600 text-sm mb-4">Belum ada produk atau event di keranjang Anda</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#E97DB4] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#d66b9f] transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-30">
        {(cartData.products.length > 0 || cartData.events.length > 0) && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                <div>{cartData.products.length} Produk, {uniqueEventsCount} Event</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total Pembayaran</div>
                <span className="text-xl font-bold text-[#800000]">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <button className="w-full bg-[#E97DB4] text-white py-3 rounded-lg font-semibold hover:bg-[#d66b9f] transition-colors">
              Lanjut Pembayaran
            </button>
          </>
        )}
      </div>
    </div>;
}