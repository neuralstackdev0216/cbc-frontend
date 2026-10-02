import { Link, Route, Routes } from "react-router-dom";

import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/productsPage";
import EditProductPage from "./admin/editProductPage";
import { useLocation } from "react-router-dom";
import AdminOrdersPage from "./admin/adminOrdersPage";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/loading";
import AdminUserPage from "./admin/adminuserPage";

export default function AdminPage(){
    const location = useLocation()
    const path=location.pathname
    const[status,setStatus]=useState("loading")
    useEffect(()=>{
        const token=localStorage.getItem("token")
        if(!token){
            setStatus("unauthorized")
            window.location.href="/login"
        }else{
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/users/",{
               headers: {
                   Authorization: "Bearer " + token
               } 
            }).then((response)=>{
                if(response.data.role !== "admin"){
                    setStatus("unauthorized")
                    toast.error("You are not authorized to access this page")
                    window.location.href="/login"
                }else{
                    setStatus("authorized")
                }
            }).catch((e)=>{
                setStatus("unauthorized")
                toast.error("You are not authorized to access this page")
                window.location.href="/login"
            })
        }
    },[])

    function getClass(name){
        if(path.includes(name)){
            return "bg-accent text-white font-bold p-4"
        }else{
            return "text-accent p-4"
        }
    }
    return(
        <div className='w-full h-screen flex bg-accent'>
            {status=="loading"|| status=="unauthorized"?
            <Loading />:
            <>
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
                        <Route  path="users" element={<AdminUserPage />} />
                        <Route  path="settings" element={<h1>Settings Page</h1>} /> 
                        <Route  path="add-product" element={<AddProductPage />} />  
                        <Route  path="edit-product" element={<EditProductPage/>} />  
                    </Routes>
                </div>
            </>
}
            
        </div>
      )
}