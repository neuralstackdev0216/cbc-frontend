import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";
import { Route, Routes } from "react-router-dom"; 
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkout";

export default function HomePage() {
  
  return (
    <div className='w-full h-screen  flex flex-col items-center'>
      <Header />
      <div className="w-full h-[calc(100%-80px)] flex justify-center items-center">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/products" element={<ProductPage />} />      
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />
          <Route path="/*" element={<h1>404 not found</h1>} />
        </Routes>
      </div>
    </div>
  )
}