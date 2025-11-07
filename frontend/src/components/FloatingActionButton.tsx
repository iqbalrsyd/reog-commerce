import React from 'react';
import { PlusIcon } from 'lucide-react';
interface FloatingActionButtonProps {
  onClick?: () => void;
}
export function FloatingActionButton({
  onClick
}: FloatingActionButtonProps) {
  return <button onClick={onClick} className="fixed bottom-6 right-6 w-16 h-16 
                bg-gradient-to-br from-[#E97DB4]/80 to-[#800000]/80 
                text-white rounded-full shadow-2xl flex items-center justify-center 
                hover:scale-110 transition-transform z-30 
                backdrop-blur-md border border-white/20">
      <PlusIcon className="w-7 h-7" />
    </button>;
}