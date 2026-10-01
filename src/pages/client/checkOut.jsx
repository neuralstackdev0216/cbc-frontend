import { useState } from "react";
import { BiMinus, BiTrash, BiPlus } from "react-icons/bi";
import {  useLocation,useNavigate } from "react-router-dom";
import { GetCart } from "../../utils/cart";
import { toast } from "react-hot-toast";
import axios from "axios";


export default function CheckoutPage(){
    const location = useLocation()
    const navigate=useNavigate()
    const [cart,setCart]=useState(location.state?.cart || []);
    const [phoneNumber,setPhoneNumber]=useState("")
    const [address,setAddress]=useState("")

    function getTotal(){
        let total = 0
        cart.forEach((item)=>{
            total += item.price*item.qty
        })
        return total
    }

    function removeFromCart(index){
        const newCart=cart.filter((item,i)=> i!==index)
        setCart(newCart)
    }

    function changeQuantity(index,qty){
        const newQty=cart[index].qty+qty
        if(newQty<=0){
            removeFromCart(index)
            return 
        }else{
            const newCart=[...cart]
            newCart[index].qty=newQty
            setCart(newCart)
        }
    }

    async function placeOrder(){
        const token=localStorage.getItem("token")
        if(!token){
            toast.error("Please Login First");
            return
        }
        const orderInformation={
            products:[],
            phone:phoneNumber,
            address:address
        }
        for(let i=0;i<cart.length;i++){
            const item={
                productId:cart[i].productId,
                qty:cart[i].qty
            }
            orderInformation.products[i]=item
        }
        try{
            const res=await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders",orderInformation,{
            headers:{
                Authorization:"Bearer "+token
            } 
        })
        toast.success("Order Placed Successfully")
        localStorage.removeItem("cart")
        navigate("/")

        }
        catch(err){
            console.log(err)
            toast.error(err.response?.data?.message || "Error Placing Order")
            return 
        }
    }

        
   
    return(
        <div className="w-full h-full flex flex-col items-center gap-4 relative">
            <div className="w-full md:w-[300px] md:absolute md:z-10 bg-white shadow-2xl flex flex-col justify-center items-center md:top-1 md:right-1 px-1 py-4 gap-4">
                <p className="text-2xl text-secondary font-bold">
                    Total: 
                    <span className="text-md mx-1 font-bold text-accent">
                        {getTotal().toFixed(2)}
                    </span>
                </p>
                <div className="flex flex-col gap-2 items-center">
                    <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-[250px] h-[30px] rounded-lg border-2 border-gray-300 px-2"
                    value={phoneNumber}
                    onChange={(e)=>setPhoneNumber(e.target.value)}
                    />
                    <input  
                        type="text" 
                        placeholder="Address"
                        className="w-[250px] h-[30px] rounded-lg border-2 border-gray-300 px-2"
                        value={address} 
                        onChange={(e)=>setAddress(e.target.value)}
                    />
                </div>
                  
                <button className="mt-2 text-white bg-accent px-4 py-2 rounded-lg font-bold hover:bg-secondary transition-all duration-300" onClick={placeOrder}>
                    Place Order
                </button>
            </div>
            {
                cart.map((item,index)=>{
                    return(
                        <div key={item.productId} className="w-full md:w-[600px] h-[100px] rounded-tl-3xl rounded-bl-3xl mt-4 bg-primary shadow-2xl flex flex-row relative justify-center items-center">
                            <img src={item.image} className="w-[100px] h-[100px] object-cover rounded-3xl" />
                            <div className="w-[120px] md:w-[250px] h-full flex flex-col items-start justify-center pl-4">
                                <h1 className="text-sm text-secondary font-semibold">{item.name}</h1>
                                <h1 className="text-md text-gray-600 font-semibold">{item.productId}</h1>
                                {
                                    item.labeledPrice > item.price ?
                                    <div>
                                        <span className="text-md mx-1 text-gray-500 line-through ">{item.labeledPrice.toFixed(2)}</span>
                                        <span className="text-md mx-1 font-bold text-accent">{item.price.toFixed(2)}</span>
                                    </div>
                                    :
                                    <div>
                                        <span className="text-md mx-1 font-bold text-accent">{item.price.toFixed(2)}</span>
                                    </div>
                                }
                            </div>
                            <div className="w-[100px] h-full flex flex-row items-center justify-between">
                                <button className="text-xl p-2 cusor-pointer rounded-xl hover:bg-secondary font-bold text-white bg-accent aspect-square" onClick={()=>{
                                    changeQuantity(index,-1)
                                }}><BiMinus /></button>
                                <span className="text-xl font-semibold text-secondary h-full flex items-center">{item.qty}</span>
                                <button className="text-xl p-2 cusor-pointer rounded-xl hover:bg-secondary font-bold text-white bg-accent aspect-square" onClick={()=>{
                                    changeQuantity(index,1)
                                }}><BiPlus /></button>
                            </div>
                           
                            <div className="hidden md:flex w-[200px] h-full flex-col items-end justify-center pr-4">
                                <span className="text-2xl font-semibold text-secondary ">Rs. {(item.price*item.qty).toFixed(2)}</span>
                            </div>
                            <button className="absolute text-red-600 bg-white hover:text-white hover:bg-red-600 rounded-full p-2 right-1 md:right-[-35px]" onClick={()=>{
                                removeFromCart(index)
                            }}>
                                <BiTrash/>
                            </button>
                        </div>
                    )
                })
            }
        </div>
    )
}