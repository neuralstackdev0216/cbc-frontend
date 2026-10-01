import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";
import {categoryNames,brands,parseSpecs} from "../../utils/productMeta.jsx"

export default function AddProductPage(){
    
    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [altName, setAltName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [labeledPrice, setLabeledPrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [brand,setBrand]=useState("")
    const [category,setCategory]=useState("categoryNames[0]")
    const [specsText,setSpecsText]=useState("")
    const navigate = useNavigate()
    

    async function AddProduct(){
        
        const token=localStorage.getItem("token")
        if(!token){
            toast.error("Please Login First")
            return
        }
        if(images.length<=0){
            toast.error("Insert atleast one image")
            return 
        }

        const promisesArray = []

        for(let i=0;i<images.length;i++){
            promisesArray[i]=mediaUpload(images[i])
        }

        
        try {
           const imageUrls=await Promise.all(promisesArray) 
           console.log(imageUrls)

           const altNamesArray=altName.split(",")
           const product ={
                productId : productId,
                name : name,
                altName : altNamesArray,
                description : description,
                images : imageUrls,
                labeledPrice : labeledPrice,
                price : price,
                stock : stock,
                brand : brand.trim() || "Other",
                category : category,
                specs : parseSpecs(specsText)
            }
            axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products",product,{
                headers:{
                    "Authorization":"Bearer " + token
                }
            }).then(()=>{
                toast.success("Product add successfully")
                navigate("/admin/products")
            }).catch((e)=>{
                toast.error(e.response.data.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2 py-6">
            <input type="text" placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <input type="text" placeholder="Alt Names" value={altName} onChange={(e) => setAltName(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <input list="brandList" type="text" placeholder="Brand (e.g. Samsung)" value={brand} onChange={(e)=>setBrand(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <datalist id="brandList">
                {brands.map((b)=><option key={b} value={b}/>)}
            </datalist>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="input input-bordered w-full max-w-xs">
                {categoryNames.map((c)=><option key={c} value={c}>{c}</option>)}
            </select>
            <textarea rows={5} placeholder={"Specs, one per line:\nRAM: 8GB\nStorage: 256GB\nBattery: 5000mAh"} value={specsText} onChange={(e)=>setSpecsText(e.target.value)} className="input input-bordered w-full max-w-xs h-auto"/>
            <input type="file" multiple placeholder="Images" onChange={(e) => setImages(e.target.files)} className="input input-bordered w-full max-w-xs"/>
            <input type="number" placeholder="Labeled Price" value={labeledPrice} onChange={(e) => setLabeledPrice(Number(e.target.value))} className="input input-bordered w-full max-w-xs"/>
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input input-bordered w-full max-w-xs"/>
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="input input-bordered w-full max-w-xs"/>
            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link to="/admin/products" className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4">Cancel</Link>
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={AddProduct}>Add Product</button>
            </div>
        </div>
    )
}