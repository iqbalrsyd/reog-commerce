import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Cart } from './pages/Cart';
import { Notifications } from './pages/Notifications';
import { PurchaseHistory } from './pages/PurchaseHistory';
import { SellerDashboard } from './pages/SellerDashboard';
import { CreateOutlet } from './pages/CreateOutlet';
import { ProductDashboard } from './pages/ProductDashboard';
import { EventDashboard } from './pages/EventDashboard';
import { ProductList } from './pages/ProductList';
import { EventList } from './pages/EventList';
import { ProductDetail } from './pages/ProductDetail';
import { EventDetail } from './pages/EventDetail';
import { AddProduct } from './pages/AddProduct';
import { AddEvent } from './pages/AddEvent';
import { Analytics } from './pages/Analytics';
import { Gallery } from './pages/Gallery';
export function AppRouter() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/history" element={<PurchaseHistory />} />
        <Route path="/create-outlet" element={<CreateOutlet />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/product-dashboard" element={<ProductDashboard />} />
        <Route path="/event-dashboard" element={<EventDashboard />} />
        <Route path="/seller/products" element={<ProductList />} />
        <Route path="/seller/events" element={<EventList />} />
        <Route path="/seller/product/:id" element={<ProductDetail />} />
        <Route path="/seller/event/:id" element={<EventDetail />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/add-event" element={<AddEvent />} />
        <Route path="/seller/analytics" element={<Analytics />} />
        <Route path="/seller/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>;
}