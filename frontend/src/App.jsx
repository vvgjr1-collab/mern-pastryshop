import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import CataloguePage from "./pages/CataloguePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import WholesalePage from "./pages/WholesalePage";
import CanadaStoryPage from "./pages/CanadaStoryPage";
import ColdChainPage from "./pages/ColdChainPage";
import CutGuidePage from "./pages/CutGuidePage";
import NotFoundPage from "./pages/NotFoundPage";
import StickyBar from "./components/StickyBar";
import ScrollToTop from "./components/ScrollToTop";
//import toast from "react-hot-toast";

const App = () => {
  return (
    <div className="relative min-h-screen w-full bg-sop-bone-300">
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/wholesale" element={<WholesalePage />} />
        <Route path="/canada-story" element={<CanadaStoryPage />} />
        <Route path="/cold-chain" element={<ColdChainPage />} />
        <Route path="/cut-guide" element={<CutGuidePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <StickyBar />
    </div>
  );
};

export default App;
