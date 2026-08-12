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
//import toast from "react-hot-toast";

const App = () => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#f0629240_100%)]" />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/wholesale" element={<WholesalePage />} />
      </Routes>
    </div>
  );
};

export default App;
