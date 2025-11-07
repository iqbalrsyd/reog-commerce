import React from 'react';
import { Header } from '../components/Header';
import { FloatingActionButton } from '../components/FloatingActionButton';
export function Gallery() {
  const images = ['https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400'];
  return <div className="min-h-screen bg-gray-50 pb-6">
      <Header isSeller={true} />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Galeri</h1>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#E97DB4] bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
            </div>)}
        </div>
      </div>
      <FloatingActionButton />
    </div>;
}