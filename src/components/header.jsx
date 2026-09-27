import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header(){
    const [sideDrawerOpen,setSideDrawerOpen] = useState(false)
    const navigete=useNavigate()
    const token=localStorage.getItem("token")
    return(
        <header className="w-full h-[80px] shadow-2xl flex justify-center relative">
            <GiHamburgerMenu className="absolute h-full text-3xl md:hidden left-2" onClick={()=>{
                setSideDrawerOpen(true)
            }}/>
            <img onClick={()=>{
                navigete("/")
            }} src="/logo.png" className="w-[80px] h-[80px] top-0 left-0 object-cover m-2 cursor-pointer" />
            <div className="w-[calc(100%-160px)] hidden md:flex justify-center items-center">
                <Link to="/" className="text-[20px] font-bold mx-2">Home</Link>
                <Link to="/products" className="text-[20px] font-bold mx-2">Products</Link>
                <Link to="/about" className="text-[20px] font-bold mx-2">About</Link>
                <Link to="/contact" className="text-[20px] font-bold mx-2">Contact</Link>
                <Link to="/search" className="text-[20px] font-bold mx-2">Search</Link>
            </div>

            <div className="w-[160px] hidden md:flex justify-center items-center">
                {
                    token==null?
                    <Link to="/login" className="text-[20px] font-bold mx-2">Login</Link>
                    :
                    <button className="text-[20px] font-bold mx-2" onClick={()=>{
                        localStorage.removeItem("token")
                        localStorage.removeItem("user")
                        window.location.href="/"
                    }}>Logout

                    </button>
                    
                }
                <Link to="/cart" className="text-[20px] font-bold mx-2">
                    <BsCart3 />
                </Link>
            </div>
            {
                sideDrawerOpen && 
                    <div className="fixed h-screen w-full bg-[#00000060] flex md:hidden">
                        <div className="w-[350px] bg-white h-full">
                            <div className="w-full h-[80px] relative shadow-2xl flex justify-center items-center">
                                <GiHamburgerMenu className="absolute h-full text-3xl left-2" onClick={()=>{
                                    setSideDrawerOpen(false)
                                }}/>
                                <img onClick={()=>{
                                    window.location.href="/"
                                }} src="/logo.png" alt="Logo" className="w-[80px] h-[80px] object-cover cursor-pointer"/>

                                

                            </div>
                            <div className="w-full  h-[calc(100%-80px)] flex flex-col items-center gap-2">
                                <a href="/" className="text-[20px] font-bold mx-2">Home</a>
                                <a href="/products" className="text-[20px] font-bold mx-2">Products</a>
                                <a href="/about" className="text-[20px] font-bold mx-2">About</a>
                                <a href="/contact" className="text-[20px] font-bold mx-2">Contact</a>
                                <a href="/cart" className="text-[20px] font-bold mx-2">
                                    <BsCart3 />
                                </a>
                            </div>
                        </div>
                    </div>
                
            }
        </header>
    )
}

