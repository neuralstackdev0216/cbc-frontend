import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header(){
    const navigete=useNavigate()
    return(
        <header className="w-full h-[80px] shadow-2xl flex">
            <img onClick={()=>{
                navigete("/")
            }} src="/logo.png" className="width-[80px] h-[80px] top-0 left-0 object-cover m-2 cursor-pointer" />
            <div className="w-[calc(100%-160px)] flex justify-center items-center">
                <Link to="/" className="text-[20px] font-bold mx-2">Home</Link>
                <Link to="/products" className="text-[20px] font-bold mx-2">Products</Link>
                <Link to="/about" className="text-[20px] font-bold mx-2">About</Link>
                <Link to="/contact" className="text-[20px] font-bold mx-2">Contact</Link>
            </div>
            <div className="w-[80px] bg-blue-500"></div>
        </header>
    )
}