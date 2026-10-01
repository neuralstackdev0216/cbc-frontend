import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";
import { categoryNames, brands, parseSpecs, specsToText } from "../../utils/productMeta";

export default function EditProductPage(){
    
    const location = useLocation()
    const [productId, setProductId] = useState(location.state.productId);
    const [name, setName] = useState(location.state.name);
    const [altName, setAltName] = useState(location.state.altName.join(","));
    const [description, setDescription] = useState(location.state.description);
    const [images, setImages] = useState([]);
    const [labeledPrice, setLabeledPrice] = useState(location.state.labeledPrice);
    const [price, setPrice] = useState(location.state.price);
    const [stock, setStock] = useState(location.state.stock);
    const [brand,setBrand]=useState("")
    const [category,setCategory]=useState("categoryNames[0]")
    const [specsText,setSpecsText]=useState(specsToText(location.state.specs))
    const navigate = useNavigate()


    async function updateProduct(){
        const token=localStorage.getItem("token")
        if(!token){
            toast.error("Please Login First")
            return
        }
        let imageUrls = location.state.images
        const promisesArray = []

        for(let i=0;i<images.length;i++){
            promisesArray[i]=mediaUpload(images[i])
        }

        
        try {
           if(images.length > 0){
            imageUrls=await Promise.all(promisesArray)
           }
            
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
            axios.put(import.meta.env.VITE_BACKEND_URL + "/api/products/"+productId,product,{
                headers:{
                    "Authorization":"Bearer " + token
                }
            }).then(()=>{
                toast.success("Product updated successfully")
                navigate("/admin/products")
            }).catch((e)=>{
                toast.error(e.response.data.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-2 py-6">
            <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
            <input disabled type="text" placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <input type="text" placeholder="Alt Names" value={altName} onChange={(e) => setAltName(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input input-bordered w-full max-w-xs"/>
                        <input list="brandList" type="text" placeholder="Brand (e.g. Samsung)" value={brand} onChange={(e) => setBrand(e.target.value)} className="input input-bordered w-full max-w-xs"/>
            <datalist id="brandList">
                {brands.map((b) => <option key={b} value={b} />)}
            </datalist>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input input-bordered w-full max-w-xs">
                {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea rows={5} placeholder={"Specs, one per line:\nRAM: 8GB\nStorage: 256GB\nBattery: 5000mAh"} value={specsText} onChange={(e) => setSpecsText(e.target.value)} className="input input-bordered w-full max-w-xs h-auto"/>
            <input type="file" multiple placeholder="Images" onChange={(e) => setImages(e.target.files)} className="input input-bordered w-full max-w-xs"/>
            <input type="number" placeholder="Labeled Price" value={labeledPrice} onChange={(e) => setLabeledPrice(Number(e.target.value))} className="input input-bordered w-full max-w-xs"/>
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input input-bordered w-full max-w-xs"/>
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="input input-bordered w-full max-w-xs"/>
            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link to="/admin/products" className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4">Cancel</Link>
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={updateProduct}>Update Product</button>
            </div>
        </div>
    )
}