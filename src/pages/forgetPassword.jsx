import axios from "axios"
import { useState } from "react"
import toast from 'react-hot-toast';

export default function ForgetPassword() {
    const [otpSent, setOtpSent] = useState(false)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    function sendOtp() {
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/send-otp", {
            email: email
        }).then((res)=>{
            setOtpSent(true)
            toast.success("OTP sent to your email")
        }).catch((err)=>{
            toast.error(err.response.data.message)
        })
    }

    function verifyOtp() {
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/reset-password", {
            email: email,
            otp: otp,
            password: newPassword
        }).then((res)=>{
            toast.success("Password reset successfully")
        }).catch((err)=>{
            toast.error(err.response.data.message)
        })
    }

    return(
        <div className="w-full h-screen flex justify-center items-center bg-[url('/login.png')] bg-cover bg-center overflow-hidden">
            {
                otpSent ?
                <div className="w-[400px] h-[500px] bg-white flex flex-col gap-4 items-center justify-center rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-bold">Enter OTP</h1>
                    <input type="text" placeholder="Enter OTP" className="w-[300px] h-[50px] rounded-full px-4" value={otp} onChange={(e)=>{setOtp(e.target.value)}} />  
                    <input type="password" placeholder="Enter New Password" className="w-[300px] h-[50px] rounded-full px-4" value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}} />
                    <input type="password" placeholder="Confirm New Password" className="w-[300px] h-[50px] rounded-full px-4" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} />
                    <button className="w-[300px] h-[50px] rounded-full bg-accent text-white font-bold" onClick={verifyOtp}>Submit</button>    
                </div> :                
                <div className="w-[400px] h-[500px] bg-white flex flex-col gap-4 items-center justify-center rounded-2xl shadow-2xl">    
                    <h1 className="text-3xl font-bold">Forget Password</h1>
                    <input type="email" placeholder="Enter Email" className="w-[300px] h-[50px] rounded-full px-4" value={email} onChange={(e)=>{setEmail(e.target.value)}} />  
                    <button className="w-[300px] h-[50px] rounded-full bg-accent text-white font-bold" onClick={sendOtp}>Sent OTP</button>    
                </div>
            }
        </div>
    )
}