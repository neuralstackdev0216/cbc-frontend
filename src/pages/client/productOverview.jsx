import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import  { GetCart,addToCart } from "../../utils/cart";

export default function ProductOverview(){
    const params=useParams()
    const productId=params.id
    const [status,setStatus]=useState("loading") //loading,success,error
    const [product,setProduct]=useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/"+productId).then((response)=>{
        console.log(response.data)
        setProduct(response.data)
        setStatus("success")

        }).catch((e)=>{
        console.log(e) 
        setStatus("error")
        toast.error("Fetching product failed")
        })
    },[productId])
    return(
        <>
        {status=="success" &&
            <div className="w-full h-full flex">
                <div className="w-[50%] h-full flex justify-center items-center">
                    <ImageSlider images={product.images} />
                </div>
                <div className="w-[50%] h-full flex flex-col justify-center items-center">
                    <div className="w-[500px] h-[600px] flex flex-col items-center">
                        <h1 className="w-full text-center text-4xl text-secondary font-semibold">{product.name}
                            {
                                product.altName.map((altName,index)=>{
                                    return(
                                        <span key={index} className="text-4xl text-gray-600">{" | "+altName}</span>
                                    )
                                })
                            }
                        </h1>
                        <h1 className="w-full text-center my-2 text-md text-gray-600 font-semibold">{product.productId}</h1>
                        <p className="w-full text-center my-2 text-md text-gray-600 font-semibold">{product.description}</p>
                        {
                            product.labeledPrice > product.price ?
                            <div>
                                <span className="text-4xl mx-4 text-gray-500 line-through ">{product.labeledPrice.toFixed(2)}</span>
                                <span className="text-4xl mx-4 font-bold text-accent">{product.price.toFixed(2)}</span>
                            </div>

                            :
                            <div>
                                <span className="text-4xl mx-4 font-bold text-accent">{product.price.toFixed(2)}</span>
                            </div>
                        }
                        <div className="w-full flex justify-center items-center mt-4 ">
                            <button className="w-[200px] h-[50px] mx-4 cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300" onClick={()=>{
                                console.log("old cart")
                                console.log(GetCart())
                                addToCart(product,1)
                                console.log("new cart")
                                console.log(GetCart())
                            }}>Add to Cart</button>
                            <button className="w-[200px] h-[50px] mx-4 cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300" onClick={()=>{
                                navigate("/checkout",{
                                    state:{
                                        cart:[{
                                            productId:product.productId,
                                            name:product.name,
                                            image:product.images[0],
                                            price:product.price,
                                            labeledPrice:product.labeledPrice,
                                            qty:1
                                        }]
                                    }
                                })
                            }}>Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        }
        {
            status=="loading" &&<Loading />
        }
        {
            status=="error" &&<h1>Something went wrong</h1>
        }
        </>
    )
}