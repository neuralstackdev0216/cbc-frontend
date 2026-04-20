import { useState } from "react"

export default function TestPage(){
    const [count, setCount] = useState(0)
    const [status,setStatus]=useState("Passed")
    //count=variable
    //setCount=function to update the variable
    return(
        <div className="w-full h-screen  flex flex-col items-center justify-center">
            <div className="w-[450px] h-[250px] shadow flex items-center justify-center">
                <button onClick={()=>{
                    setCount(count-1)
                }} className="w-[100px] h-[40px] cursor-pointer text-[20px] font-bold text-white bg-blue-600 text-center">
                    -
                </button>
                <span className="text-center text-[40px] font-bold w-[100px] h-[40px] mx-[10px] flex items-center justify-center">
                    {count}
                </span>
                <button onClick={()=>{
                    setCount(count+1)
                }} className="w-[100px] h-[40px] cursor-pointer text-[20px] font-bold text-white bg-blue-600 text-center">
                    +
                </button>
            </div>
            <div className="w-[450px] h-[250px] shadow flex flex-col items-center justify-center">
               
                <span className="text-center text-[40px] font-bold w-[100px] h-[40px] mx-[10px] flex items-center justify-center">
                    {status}
                 </span>
                 <div>
                    <button className="w-[100px] h-[40px] cursor-pointer text-[20px] font-bold text-white bg-blue-600 text-center mx-[10px]" onClick={()=>{
                        setStatus("Passed")
                    }}>
                        Pass
                    </button>
                    <button className="w-[100px] h-[40px] cursor-pointer text-[20px] font-bold text-white bg-blue-600 text-center mx-[10px]" onClick={()=>{
                        setStatus("Failed")
                    }}>
                        Fail
                    </button>
                 </div>
            </div>
        </div>
    )
}