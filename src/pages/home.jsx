export default function HomePage() {
  return (
    <div className='w-full h-screen bg-red-100 flex flex-col justify-center items-center'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>Welcome to the Home Page</h1>
      <p className='text-lg text-gray-600'>This is the main landing page of our application.</p>
      <button className="p-[10px]">Home</button>
    </div>
  )
}