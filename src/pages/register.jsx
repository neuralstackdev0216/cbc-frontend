import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  async function handleRegister() {

    try {

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        }
      )

      console.log(response.data)

      toast.success("Registration Successful")

      navigate("/login")

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Registration Failed"
      )

    }

  }

  return (
    <div className='w-full h-screen bg-[url("/login.jpg")] bg-center bg-cover flex justify-center items-center'>

      <div className="w-[50%] h-full">

      </div>

      <div className="w-[50%] h-full flex items-center justify-center">

        <div className="w-[500px] h-[650px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col items-center justify-center">

          <h1 className="text-white text-[35px] font-bold mb-[20px]">
            Register
          </h1>

          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => {
              setFirstName(e.target.value)
            }}
            value={firstName}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => {
              setLastName(e.target.value)
            }}
            value={lastName}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-4 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            value={email}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            value={password}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-4 text-white outline-none"
          />

          <button
            onClick={handleRegister}
            className="w-[300px] h-[50px] bg-[#c3efe9] text-white rounded-[20px] my-[20px] cursor-pointer"
          >
            Register
          </button>

          <p className="text-white">
            Already have an account?
            <span
              onClick={() => {
                navigate("/login")
              }}
              className="ml-2 text-[#c3efe9] cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>

      </div>

    </div>
  )
}