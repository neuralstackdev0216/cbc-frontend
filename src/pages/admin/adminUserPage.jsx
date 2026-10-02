import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Loading from "../../components/loading"
export default function AdminUserPage(){
    const [users,setUsers]=useState([])
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        const token=localStaorage.getItem("token")
        axios.get(import.meta.env.VITE_BACKEND_URL+"/api/users/all",{
            headers: {
                Authorization: "Bearer " + token
            }
        }).then((response)=>{
            setUsers(response.data.users||[])
            setIsLoading(false)
        }).catch((e)=>{
            toast.error("Fetching users failed")
            setIsLoading(false)
        })
    },[])

    async function changeBlock(user){
        const newState=!user.isBlocked
        if(!window.confirm((newState?"Block":"Unblock")+user.email+"?")){
            return
        }
        try{
            const token=localStorage.getItem("token")
            await axios.put(
                import.meta.env.VITE_BACKEND_URL+"/api/users/block/"+ encodeURIComponent(user.email),
                {isBlocked:newState},
                {headers:{
                    Authorization:"Bearer "+token
                }}
            )
            setUsers(users.map((u)=>u.email==user.email?{...u,isBlocked:newState}:u))
            toast.success(e.response?.data?.message||"Failed to update user")
            
        }catch(e){
            toast.error(e.response?.data?.message||"Failed to update user")
        }
    }

    if(isLoading){
        return(
            <div className="w-full h-full flex justify-center items-center">
                <Loading/>
            </div>
        )
    }

    return(
        <div className="w-full h-full overflow-y-auto p-6 bg-primary">
            <h1 className="text-2xl font-bold text-secondary mb-2">Users</h1>
            <p className="text-gray-500 mb-6">Manage customer and admin accounts</p>

            <div className="bg-white rounded-lg overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user)=>(
                            <tr key={user._id} className="border-t">
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <img src={user.img} className="w-8 h-8 rounded-full object-cover bg-gray-200" />
                                        <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                </td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3 capitalize">{user.role}</td>
                                <td className="p-3">
                                    <span className={"px-2 py-1 rounded text-sm " + (user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                                        {user.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {user.role=="admin" ? (
                                        <span className="text-gray-400">-</span>
                                    ) : (
                                        <button
                                            onClick={()=>changeBlock(user)}
                                            className={"px-3 py-1 rounded text-white text-sm font-semibold " + (user.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700")}>
                                            {user.isBlocked ? "Unblock" : "Block"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}