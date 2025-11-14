import { CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  id?: string | number;
  image: string;
  title: string;
  price: string;
  outlet: string;
  date: string;
}

export function EventCard({
  id,
  image,
  title,
  price,
  outlet,
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-[#5B7B6F]">
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
              <path d="M2 7h20"></path>
              <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
            </svg>
            <span className="line-clamp-1">{outlet}</span>
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
