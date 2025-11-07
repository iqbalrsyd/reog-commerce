import { MapPinIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  id?: string | number;
  image: string;
  title: string;
  price: string;
  location: string;
  date: string;
}

export function EventCard({
  id,
  image,
  title,
  price,
  location,
  date
}: EventCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${id || 1}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all flex min-w-full cursor-pointer"
    >
      <img 
        src={image} 
        alt={title} 
        className="w-32 h-32 object-cover flex-shrink-0" 
      />
      <div className="p-4 flex-1">
        <h3 className="font-bold text-sm text-[#2E2557] mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-[#E97DB4] font-bold text-base mb-2">{price}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPinIcon className="w-3 h-3 text-[#5B7B6F]" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <CalendarIcon className="w-3 h-3 text-[#E97DB4]" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
