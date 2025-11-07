import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SellerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has created an outlet
    const outletData = localStorage.getItem('outlet');
    
    if (!outletData || outletData === '{}') {
      // No outlet created, redirect to create outlet page
      navigate('/create-outlet');
      return;
    }

    // Parse outlet data
    const outlet = JSON.parse(outletData);
    
    // Redirect based on outlet type
    if (outlet.type === 'event') {
      navigate('/event-dashboard');
    } else {
      // Default to product dashboard for 'produk' or 'keduanya'
      navigate('/product-dashboard');
    }
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4A9B9B] border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium">Memuat dashboard...</p>
      </div>
    </div>
  );
}
