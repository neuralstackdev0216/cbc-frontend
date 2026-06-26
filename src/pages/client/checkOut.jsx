import { useState } from "react";
import { BiMinus, BiTrash, BiPlus } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { GetCart } from "../../utils/cart";

export default function CheckoutPage(){
    const location = useLocation()
    const [cart,setCart]=useState(location.state?.cart || []);

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
   
    return(
        <div className="w-full h-full flex flex-col items-center gap-4 relative">
            <div className="w-[300px] h-[100px] absolute shadow-2xl flex flex-col justify-center items-center top-1 right-1">
                <p className="text-2xl text-secondary font-bold">
                    Total: 
                    <span className="text-md mx-1 font-bold text-accent">
                        {getTotal().toFixed(2)}
                    </span>
                </p>
                <button className="mt-2 text-white bg-accent px-4 py-2 rounded-lg font-bold hover:bg-secondary transition-all duration-300">
                    Place Order
                </button>
            </div>
            {
                cart.map((item,index)=>{
                    return(
                        <div key={item.productId} className="w-[600px] h-[100px] rounded-tl-3xl rounded-bl-3xl mt-4 bg-primary shadow-2xl flex flex-row relative justify-center items-center">
                            <img src={item.image} className="w-[100px] h-[100px] object-cover rounded-3xl" />
                            <div className="w-[250px] h-full flex flex-col items-start justify-center pl-4">
                                <h1 className="text-[10px] text-secondary font-semibold">{item.name}</h1>
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
                           
                            <div className="w-[200px] h-full flex flex-col items-end justify-center pr-4">
                                <span className="text-2xl font-semibold text-secondary ">Rs. {(item.price*item.qty).toFixed(2)}</span>
                            </div>
                            <button className="absolute text-red-600 bg-white hover:text-white hover:bg-red-600 rounded-full p-2 right-[-35px]" onClick={()=>{
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