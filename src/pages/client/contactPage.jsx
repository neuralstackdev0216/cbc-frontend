export default function ContactPage(){
    const info=[
        {label:"Phone",value:"+94 76 568 7539"},
        {label:"Email",value:"mobilestore@gmail.com"},
        {label:"Address",value:"123 Main Street, Kahawatta,Ratnapura"},
        {label:"Opening Hours",value:"Mon - Sat, 9:00 AM - 7:00 PM"},
    ]
    return(
        <div className="w-full min-h-full self-start flex flex-col items-center p-6 gap-6">
            <h1 className="text-4xl font-bold text-secondary">Contact Us</h1>
            <p className="text-gray-600 text-center">We'd love to hear from you. Reach us any time using the details below.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
                {info.map((i)=>(
                    <div key={i.label} className="bg-primary rounded-2xl shadow-md p-6 text-center">
                        <h2 className="text-lg font-bold text-accent mb-1">{i.label}</h2>
                        <p className="text-gray-700">{i.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}