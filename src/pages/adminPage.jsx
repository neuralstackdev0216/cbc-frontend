import { Link, Route, Routes } from "react-router-dom";

import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/productsPage";
import EditProductPage from "./admin/editProductPage";
import { useLocation } from "react-router-dom";
import AdminOrdersPage from "./admin/adminOrdersPage";

export default function AdminPage(){
    const location = useLocation()
    const path=location.pathname

    function getClass(name){
        if(path.includes(name)){
            return "bg-accent text-white font-bold p-4"
        }else{
            return "text-accent p-4"
        }
    }
    return(
        <div className='w-full h-screen flex bg-accent'>
            <div className="h-full w-[300px] text-accent font-bold text-xl flex flex-col bg-white">
                <Link className={getClass("products")} to="/admin/products">Products</Link>
                <Link className={getClass("orders")} to="/admin/orders">Orders</Link>
                <Link className={getClass("users")} to="/admin/users">Users</Link>   
                <Link className={getClass("settings")} to="/admin/settings">Settings</Link> 
            </div>
            <div className="h-full w-[calc(100%-300px)] border-accent border-4 rounded-2xl bg-white">
                <Routes path="/">
                    <Route  path="products" element={<AdminProductsPage />} />
                    <Route  path="orders" element={<AdminOrdersPage />} />
                    <Route  path="users" element={<h1>Users Page</h1>} />
                    <Route  path="settings" element={<h1>Settings Page</h1>} /> 
                    <Route  path="add-product" element={<AddProductPage />} />  
                    <Route  path="edit-product" element={<EditProductPage/>} />  
                </Routes>
            </div>
        </div>
      )
}