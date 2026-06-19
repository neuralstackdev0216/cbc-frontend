import { useState, useEffect } from "react"
import axios from "axios"
import { sampleProducts } from "../../assets/sampleData"
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";


export default function AdminProductsPage() {
    const [products,setProducts]=useState(sampleProducts)
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        if(isLoading == true){
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((response)=>{
                setProducts(response.data) 
                setIsLoading(false)  
            })
        }
    },[isLoading]
    );
    const navigate = useNavigate()


    function deleteProduct(productId){
        const token=localStorage.getItem("token")
        if(token == null){
            toast.error("Please Login First")
            return
        }
        axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/"+productId,{
                headers:{
                    "Authorization":"Bearer " + token
                }
            }).then(()=>{
                toast.success("Product deleted successfully")
                setIsLoading(true)
            }).catch((e)=>{
                toast.error(e.response.data.message)
            })
    }
    
    return( 
        <div className="w-full h-full max-h-full overflow-y-scroll relative">
            <Link to="/admin/add-product" className="absolute text-xl cursor-pointer bottom-5 right-5 bg-green-500 text-white font-bold px-4 py-2 rounded text-center flex justify-center items-center">+</Link>
            {isLoading ?
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-blue-900 rounded-full animate-spin">

                    </div>
                </div>
                :
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Product Image</th>
                            <th>LabeledPrice</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item, index) => (
                            <tr key={item._id}>
                                <td className="border border-gray-300 px-4 py-2">{item.productId}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover mx-auto" />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">${item.labeledPrice.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">${item.price.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.stock}</td>
                                <td>
                                    <div className="flex items-center justify-center w-full">
                                        <FaTrash className="text-red-500 text-[20px] mx-2 cursor-pointer" onClick={()=>deleteProduct(item.productId)}/> 
                                    <FaEdit onClick={()=>{navigate("/admin/edit-product",{state:item})}} className="text-blue-500 text-[20px] mx-2 cursor-pointer"/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

        </div>
    )
}