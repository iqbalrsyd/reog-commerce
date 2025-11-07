import { MapPinIcon, CalendarIcon } from 'lucide-react';
interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  date?: string;
  isEvent?: boolean;
}
export function ProductCard({
  image,
  title,
  price,
  location,
  date,
  isEvent = false
}: ProductCardProps) {
  return <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-40 object-cover" />
        {isEvent && <div className="absolute top-3 left-3 bg-[#4A9B9B] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            Event
          </div>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm text-[#2E2557] mb-2 line-clamp-2 min-h-[40px]">
          {title}
        </h3>
        <p className="text-[#E97DB4] font-bold text-lg mb-2">{price}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPinIcon className="w-3 h-3 text-[#5B7B6F]" />
            <span>{location}</span>
          </div>
          {date && <div className="flex items-center gap-1 text-xs text-gray-600">
              <CalendarIcon className="w-3 h-3 text-[#E97DB4]" />
              <span>{date}</span>
            </div>}
        </div>
      </div>
    </div>;
}