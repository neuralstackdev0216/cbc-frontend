export default function LoginPage() {
  return (
    <div className='w-full h-screen bg-green-100 flex flex-col justify-center items-center'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>Welcome to the Login Page</h1>
      <p className='text-lg text-gray-600'>Please enter your credentials to log in.</p>
      <button className="p-[10px]">Login</button>
    </div>
  )
}