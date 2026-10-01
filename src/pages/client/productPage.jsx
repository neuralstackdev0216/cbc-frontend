import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import { categories } from "../../utils/productMeta";

export default function ProductPage(){
    const [products,setProducts]=useState([])
    const [isLoading,setIsLoading]=useState(true)
    const [searchParams,setSearchParams]=useSearchParams()
    const category=searchParams.get("category") || ""

    useEffect(()=>{
        setIsLoading(true)
        const params={}
        if(category){
            params.category=category
        }
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products",{params})
        .then((response)=>{
            setProducts(response.data)
            setIsLoading(false)
        })
        .catch(()=>{
            setIsLoading(false)
        })
    },[category]);

    return(
        <div className="w-full min-h-full self-start flex flex-col items-center p-4">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                <button
                    onClick={()=>setSearchParams({})}
                    className={"px-4 py-2 rounded-full border font-semibold transition-all duration-300 " + (category=="" ? "bg-accent text-white border-accent" : "border-gray-300 text-secondary hover:border-accent")}>
                    All
                </button>
                {categories.map((c)=>(
                    <button
                        key={c.name}
                        onClick={()=>setSearchParams({category:c.name})}
                        className={"px-4 py-2 rounded-full border font-semibold transition-all duration-300 " + (category==c.name ? "bg-accent text-white border-accent" : "border-gray-300 text-secondary hover:border-accent")}>
                        {c.icon} {c.name}
                    </button>
                ))}
            </div>

            {isLoading ? <Loading /> : products.length==0 ? (
                <h1 className="text-2xl font-bold text-gray-600 mt-10">No products found</h1>
            ) : (
                <div className="w-full flex flex-wrap justify-center gap-5 p-2">
                    {products.map((product)=>(
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}