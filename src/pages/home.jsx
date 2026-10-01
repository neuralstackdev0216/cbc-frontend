import Header from "../components/header.jsx";
import ProductPage from "./client/productPage.jsx";
import ProductOverview from "./client/productOverview.jsx";
import { Route, Routes } from "react-router-dom"; 
import CartPage from "./client/cart.jsx";
import CheckoutPage from "./client/checkout.jsx";
import SearchProductPage from "./client/searchProducts.jsx";
import HomeContent from "./client/homeContent.jsx";
import AboutPage from "./client/aboutPage.jsx";
import ContactPage from "./client/contactPage.jsx";

export default function HomePage() {
  
  return (
    <div className='w-full h-screen  flex flex-col items-center'>
      <Header />
      <div className="w-full h-[calc(100%-80px)] flex justify-center items-center overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomeContent/>} />
          <Route path="/products" element={<ProductPage />} /> 
          <Route path="/search" element={<SearchProductPage />} />     
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />
          <Route path="/*" element={<h1>404 not found</h1>} />
        </Routes>
      </div>
    </div>
  )
}