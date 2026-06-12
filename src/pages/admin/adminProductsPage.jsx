import { useState, useEffect } from "react"
import axios from "axios"
import { sampleProducts } from "../../assets/sampleData"
import { Link } from "react-router-dom";

export default function AdminProductsPage() {
    const [products,setProducts]=useState(sampleProducts)

    useEffect(()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((response)=>{
        setProducts(response.data)   
    }).catch((err)=>{
         console.log(err)
    })
    },[]
    );
    
    return( 
        <div className="w-full h-full max-h-full overflow-y-scroll relative">
            <Link to="/admin/add-product" className="absolute text-xl cursor-pointer bottom-5 right-5 bg-green-500 text-white font-bold px-4 py-2 rounded text-center flex justify-center items-center">+</Link>
            <table className="w-full text-center">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Product Image</th>
                        <th>LabeledPrice</th>
                        <th>Price</th>
                        <th>Stock</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}