
import {
    FiTruck,
    FiShield,
    FiHeadphones
} from "react-icons/fi";

import { BiWallet } from "react-icons/bi";

const benefits = [
    {
        icon: FiTruck,
        title: "Islandwide Delivery",
        description: "Delivery across Sri Lanka"
    },
    {
        icon: FiShield,
        title: "Genuine Products",
        description: "Shop with confidence"
    },
    {
        icon: BiWallet,
        title: "Cash on Delivery",
        description: "Pay when you receive"
    },
    {
        icon: FiHeadphones,
        title: "Customer Support",
        description: "We're here to help"
    }
];

export default function ServiceBenefits() {
    return (
        <section
            aria-label="Shopping benefits"
            className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6"
        >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">

                {benefits.map((benefit) => {

                    const Icon = benefit.icon;

                    return (
                        <div
                            key={benefit.title}
                            className="group bg-[#1c2739] border border-slate-700 rounded-2xl p-4 md:p-6 flex flex-col items-center text-center gap-3 shadow-lg hover:border-sky-400/60 hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors duration-300">

                                <Icon className="text-sky-400 text-3xl" />

                            </div>

                            {/* Title */}
                            <h3 className="text-white text-sm md:text-base font-bold">
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                {benefit.description}
                            </p>

                        </div>
                    );
                })}

            </div>
        </section>
    );
}
