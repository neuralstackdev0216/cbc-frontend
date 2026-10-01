export default function AboutPage(){
    const points=[
        {title:"100% Genuine",text:"Every phone and accessory we sell is original and sealed."},
        {title:"Warranty Support",text:"Dedicated after-sales support on all devices."},
        {title:"Fast Delivery",text:"Quick and careful delivery right to your door."},
    ]
    return(
        <div className="w-full min-h-full self-start flex flex-col items-center p-6 gap-6">
            <h1 className="text-4xl font-bold text-secondary">About Us</h1>
            <p className="max-w-3xl text-center text-gray-600 text-lg">
                Mobile Shop is your one-stop destination for the latest smartphones, tablets,
                smartwatches and accessories. Replace this paragraph with your own shop story.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
                {points.map((p)=>(
                    <div key={p.title} className="bg-primary rounded-2xl shadow-md p-6 text-center">
                        <h2 className="text-xl font-bold text-accent mb-2">{p.title}</h2>
                        <p className="text-gray-600">{p.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}