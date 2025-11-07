import React from 'react';
interface CategoryChipProps {
  label: string;
  icon?: string;
  isActive?: boolean;
  onClick?: () => void;
}
export function CategoryChip({
  label,
  icon,
  isActive = false,
  onClick
}: CategoryChipProps) {
  return <button onClick={onClick} className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${isActive ? 'bg-[#E97DB4] text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 shadow-md'}`}>
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-xs">{label}</span>
    </button>;
}