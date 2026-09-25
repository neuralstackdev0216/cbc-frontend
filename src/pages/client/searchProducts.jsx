import {  useState } from "react"
import axios from "axios"
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import { toast } from "react-hot-toast";

export default function SearchProductPage(){
    const [product,setProduct]=useState([])
    const [isLoading,setIsLoading]=useState(true)
    const[query,setQuery]=useState('')

    
    return(
        <div className="w-full h-full flex flex-col items-center p-4">
            <input 
                type="text" 
                placeholder="Search for Products..."
                className="w-[300px] h-[40px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                value={query} 
                onChange={async(e)=>{
                    setQuery(e.target.value) 
                    setIsLoading(true)
                    if(e.target.value.length==0){
                        setProduct([])
                        setIsLoading(false)
                        return
                    }
                    try{
                        const response=await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/search/"+e.target.value)
                        setProduct(response.data)
                    }catch(err){
                        toast.error(err.response.data.message)
                        console.log(err)
                    }finally{
                        setIsLoading(false)
                    }
                }}
                
            />
                
            <div className="w-full h-full flex flex-wrap justify-center items-center p-5 gap-5">
                {
                    query.length == 0?
                    (
                        <h1 className="text-2xl font-bold text-gray-600">No Product Found</h1>
                    ):<>
                        {isLoading
                ?(
                    <Loading />
                ):(
                    <>
                        {product.map((product)=>{
                        return(
                        <ProductCard key={product.productId} product={product} />
                        )
                    })}
                    </>
                )
                }
                    </>
                }
                 
                
            </div>
        </div>
    )
}