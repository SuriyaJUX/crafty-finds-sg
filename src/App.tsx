import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { InkPointsProvider } from "@/context/InkPointsContext";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import FloatingHelpButton from "@/components/FloatingHelpButton";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";

import Promotions from "./pages/Promotions";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import CheckoutDetails from "./pages/CheckoutDetails";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutConfirmation from "./pages/CheckoutConfirmation";
import OrderTracking from "./pages/OrderTracking";
import OrderReturn from "./pages/OrderReturn";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <InkPointsProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <CartDrawer />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={<Account />} />
                <Route path="/checkout/details" element={<CheckoutDetails />} />
                <Route path="/checkout/payment" element={<CheckoutPayment />} />
                <Route path="/checkout/confirmation" element={<CheckoutConfirmation />} />
                <Route path="/order/:orderId" element={<OrderTracking />} />
                <Route path="/order/:orderId/return" element={<OrderReturn />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </CartProvider>
        </InkPointsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

