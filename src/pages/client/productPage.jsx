import { useEffect, useState } from "react"
import axios from "axios"
import ProductCard from "../../components/productCard";

export default function ProductPage(){
    const [product,setProduct]=useState([])
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        if(isLoading == true){
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((response)=>{
                setProduct(response.data) 
                setIsLoading(false)  
            })
        }
    },[isLoading]);
    return(
        <div className="w-full h-full flex flex-wrap justify-center items-center p-5 gap-5">
            {product.map((product)=>{
                return(
                <ProductCard key={product.productId} product={product} />
                )
            })}
        </div>
    )
}