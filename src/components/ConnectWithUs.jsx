
import {
    FiMapPin,
    FiPhone,
    FiMail,
    FiClock,
    FiNavigation,
    FiHeadphones
} from "react-icons/fi";

export default function ConnectWithUs() {

    const storeLocation =
        import.meta.env.VITE_STORE_LOCATION || "Colombo, Sri Lanka";

    const phone = import.meta.env.VITE_STORE_PHONE;
    const email = import.meta.env.VITE_STORE_EMAIL;

    const mapQuery = encodeURIComponent(storeLocation);

    const contactDetails = [
        {
            icon: FiMapPin,
            title: "Store Location",
            description: storeLocation
        },
        {
            icon: FiPhone,
            title: "Call Us",
            description: phone || "Coming soon",
            href: phone ? `tel:${phone}` : null
        },
        {
            icon: FiMail,
            title: "Email Us",
            description: email || "Coming soon",
            href: email ? `mailto:${email}` : null
        },
        {
            icon: FiClock,
            title: "Opening Hours",
            description: "To be announced"
        }
    ];

    return (
        <section
            id="connect-with-us"
            className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 scroll-mt-8"
        >

            {/* Section Heading */}
            <div className="text-center mb-10">

                <span className="inline-block text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">
                    We're here to help
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Connect With
                    <span className="text-sky-400"> Us</span>
                </h2>

                <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                    Have a question about our products or your order?
                    Get in touch with NovaMobiles.
                </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Contact Information */}
                <div
                    id="customer-support"
                    className="bg-[#1c2739] border border-slate-700 rounded-2xl p-6 md:p-8 scroll-mt-8"
                >

                    <div className="flex items-center gap-3 mb-8">

                        <FiHeadphones className="text-sky-400 text-2xl" />

                        <h3 className="text-2xl font-bold text-white">
                            Get in Touch
                        </h3>

                    </div>

                    <div className="space-y-6">

                        {contactDetails.map((item) => {

                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="flex items-center gap-4"
                                >

                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">

                                        <Icon className="text-sky-400 text-xl" />

                                    </div>

                                    <div className="min-w-0">

                                        <h4 className="text-white font-semibold">
                                            {item.title}
                                        </h4>

                                        {item.href ? (

                                            <a
                                                href={item.href}
                                                className="text-sm text-slate-400 hover:text-sky-400 break-words"
                                            >
                                                {item.description}
                                            </a>

                                        ) : (

                                            <p className="text-sm text-slate-400 mt-1">
                                                {item.description}
                                            </p>

                                        )}

                                    </div>

                                </div>
                            );

                        })}

                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700">

                        <p className="text-sm text-slate-400 leading-relaxed">
                            Explore our collection of smartphones,
                            tablets, smartwatches and accessories.
                        </p>

                    </div>

                </div>

                {/* Store Location */}
                <div
                    id="store-location"
                    className="bg-[#1c2739] border border-slate-700 rounded-2xl overflow-hidden flex flex-col scroll-mt-8"
                >

                    <iframe
                        title="NovaMobiles location map"
                        src={`https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`}
                        className="w-full h-[300px] md:h-[340px] border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />

                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1">

                        <div>

                            <h3 className="text-xl font-bold text-white">
                                Find Our Store
                            </h3>

                            <p className="text-slate-400 text-sm mt-2">
                                {storeLocation}
                            </p>

                            {!import.meta.env.VITE_STORE_LOCATION && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Demonstration location
                                </p>
                            )}

                        </div>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-xl transition-colors"
                        >

                            <FiNavigation />

                            View on Maps

                        </a>

                    </div>

                </div>

            </div>

        </section>
    );
}
