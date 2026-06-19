import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ProductOverview(){
    const params=useParams()
    const productId=params.id
    const [status,setStatus]=useState("loading") //loading,success,error
    const [product,setProduct]=useState(null)
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
        <div>
            Product Overview
        </div>
    )
}