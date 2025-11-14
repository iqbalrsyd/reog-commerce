import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { authService } from '../lib/auth.service';

export function SellerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkOutletAndRedirect = async () => {
      try {
        // Check if user is logged in and get current user
        const currentUser = authService.getCurrentUser();

        // If user is not logged in or is not a seller, redirect to home
        if (!currentUser || currentUser.role !== 'seller') {
          navigate('/');
          return;
        }

        // First check if outlet data exists in localStorage
        let outletData = localStorage.getItem('outlet');

        if (!outletData || outletData === '{}') {
          // No outlet in localStorage, fetch from backend
          const response = await api.get('/outlets/my');
          const outlets = response.data.data || [];

          if (outlets.length > 0) {
            // User has outlet(s), store the first one in localStorage
            const primaryOutlet = outlets[0];
            localStorage.setItem('outlet', JSON.stringify(primaryOutlet));
            outletData = JSON.stringify(primaryOutlet);
          }
        }

        if (!outletData || outletData === '{}') {
          // No outlet created, redirect to create outlet page
          navigate('/create-outlet');
          return;
        }

        // Parse outlet data
        const outlet = JSON.parse(outletData);

        // Verify that the current user owns this outlet
        // This prevents showing another user's outlet when switching accounts
        if (outlet.ownerId !== currentUser.uid) {
          console.log('Outlet belongs to different user, clearing localStorage and fetching fresh data');
          localStorage.removeItem('outlet');

          // Fetch fresh outlet data for the current user
          const response = await api.get('/outlets/my');
          const outlets = response.data.data || [];

          if (outlets.length > 0) {
            const primaryOutlet = outlets[0];
            localStorage.setItem('outlet', JSON.stringify(primaryOutlet));

            // Redirect based on fresh outlet type
            if (primaryOutlet.type === 'event') {
              navigate('/event-dashboard');
            } else {
              navigate('/product-dashboard');
            }
          } else {
            // No outlets for this user
            navigate('/create-outlet');
          }
          return;
        }

        // Redirect based on outlet type
        if (outlet.type === 'event') {
          navigate('/event-dashboard');
        } else {
          // Default to product dashboard for 'produk' or 'keduanya'
          navigate('/product-dashboard');
        }
      } catch (error) {
        console.error('Error checking outlet status:', error);
        // On error, redirect to home page for non-sellers or create outlet for sellers
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.role === 'seller') {
          navigate('/create-outlet');
        } else {
          navigate('/');
        }
      }
    };

    checkOutletAndRedirect();
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
