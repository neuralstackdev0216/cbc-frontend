import { Link, Route, Routes } from "react-router-dom";
import AdminProductsPage from "./admin/adminProductsPage";
import AddProductPage from "./admin/addProductPage";

export default function AdminPage(){
    return(
        <div className='w-full h-screen flex'>
            <div className="h-full w-[300px] flex flex-col">
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/orders">Orders</Link>
                <Link to="/admin/users">Users</Link>   
                <Link to="/admin/settings">Settings</Link> 
            </div>
            <div className="h-full w-[calc(100%-300px)]">
                <Routes path="/">
                    <Route  path="products" element={<AdminProductsPage />} />
                    <Route  path="orders" element={<h1>Orders Page</h1>} />
                    <Route  path="users" element={<h1>Users Page</h1>} />
                    <Route  path="settings" element={<h1>Settings Page</h1>} /> 
                    <Route  path="add-product" element={<AddProductPage />} />    
                </Routes>
            </div>
        </div>
      )
}