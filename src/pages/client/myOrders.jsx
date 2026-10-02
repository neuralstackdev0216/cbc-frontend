import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Loading from "../../components/loading.jsx"
import { Link } from "react-router-dom"

const statusStyles={
    Pending:"bg-yellow-100 text-yellow-700",
    Processing:"bg-blue-100 text-blue-700",
    Shipped:"bg-green-100 text-green-700",
    Delivered:"bg-green-100 text-green-700",
    Cancelled:"bg-red-100 text-red-700"
}
export default function MyOrdersPage(){
    const [orders,setOrders]=useState()
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        const token=localStorage.getItem("token")
        if(!token){
            toast.error("Please login to view your orders")
            window.location.href="/login"
            return
        }
        axios.get(import.meta.env.VITE_BACKEND_URL+"/api/orders?mine=true",{
            headers:{
                Authorization:"Bearer "+token
            }

        }).then((res)=>{
            setOrders(res.data.orders || [])
            setIsLoading(false)
        }).catch((err)=>{
            toast.error("Fetching orders failed")
            setIsLoading(false)
        })
    },[])

    if(isLoading){
        return <Loading />
    }
    const sorted=[...orders].sort((a,b)=>new Date(b.date)-new Date(a.date))

    return(
        <div className="w-full min-h-full self-start flex flex-col items-center p-4 md:p-6">
            <h1 className="text-3xl font-bold text-secondary mb-6">My Orders</h1>

            {sorted.length==0 ? (
                <div className="flex flex-col items-center gap-4 mt-10">
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                    <Link to="/products" className="bg-accent text-white font-bold px-6 py-2 rounded-full hover:bg-accent/80 transition-all duration-300">Start Shopping</Link>
                </div>
            ) : (
                <div className="w-full max-w-3xl flex flex-col gap-4">
                    {sorted.map((order)=>(
                        <div key={order._id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                                <div>
                                    <p className="font-bold text-accent">{order.orderId}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                                </div>
                                <span className={"px-3 py-1 rounded-full text-sm font-semibold " + (statusStyles[order.status] || "bg-gray-100 text-gray-700")}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2">
                                {order.products.map((item,index)=>(
                                    <div key={index} className="flex items-center gap-3">
                                        <img src={item.productInfo?.images?.[0]} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-secondary line-clamp-1">{item.productInfo?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} × Rs. {Number(item.productInfo?.price || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                <p className="text-sm text-gray-500">Delivery to: {order.address}</p>
                                <p className="text-lg font-bold text-secondary">Rs. {Number(order.total).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

}