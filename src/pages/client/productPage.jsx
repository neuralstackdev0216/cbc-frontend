import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import { categories } from "../../utils/productMeta";

export default function ProductPage(){
    const [products,setProducts]=useState([])
    const [isLoading,setIsLoading]=useState(true)
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false
    });
    const [searchParams,setSearchParams]=useSearchParams()
    const category=searchParams.get("category") || ""
    const search = searchParams.get("search") || "";

    useEffect(()=>{
        setIsLoading(true)
        const params={}
        if(category){
            params.category=category
            
        }
        if (search) params.search = search;
        params.page = page;
        params.limit = 2;
        
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products",{params})
        .then((response)=>{
            setProducts(response.data.products)
            setPagination(response.data.pagination);
            setIsLoading(false)
        })
        .catch(()=>{
            setIsLoading(false)
        })
    },[category,search,page]);

    return(
        <div className="w-full min-h-full self-start flex flex-col items-center p-4">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                <button
                    onClick={() => {
                        setPage(1);
                        setSearchParams({});
                    }}
                    className={"px-4 py-2 rounded-full border font-semibold transition-all duration-300 " + (category=="" ? "bg-accent text-white border-accent" : "border-gray-300 text-secondary hover:border-accent")}>
                    All
                </button>
                {categories.map((c)=>(
                    <button
                        key={c.name}
                        onClick={() => {
                            setPage(1);
                            setSearchParams({ category: c.name });
                        }}
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
        
        {pagination.totalPages > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8 mb-8">

            <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!pagination.hasPreviousPage || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded
                        disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
            Previous
            </button>

            <span className="font-semibold">
            Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!pagination.hasNextPage || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded
                        disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
            Next
            </button>

        </div>
        )}
        </div>
    )
}