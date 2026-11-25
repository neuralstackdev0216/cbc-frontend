
import { Link } from "react-router-dom";
import { FiArrowLeft, FiUser } from "react-icons/fi";

export default function AuthLayout({
    title,
    subtitle,
    icon: Icon = FiUser,
    children
}) {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0b1120] px-4 py-10 overflow-hidden text-white">

            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#164e63]/60 via-[#0b1120] to-[#0c4a6e]/50" />

            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

            <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full bg-sky-500/20 blur-[100px] pointer-events-none" />

            <div className="absolute top-20 right-[15%] w-40 h-40 rounded-full border border-sky-400/20 pointer-events-none" />

            <div className="absolute bottom-20 left-[10%] w-64 h-64 rounded-full border border-cyan-400/10 pointer-events-none" />

            {/* Glass card */}
            <div className="relative z-10 w-full max-w-[440px] rounded-[28px] border border-sky-300/25 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/40 p-6 sm:p-9">

                {/* Brand */}
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2"
                >
                    <span className="text-sky-400 text-3xl">
                        ◈
                    </span>

                    <span className="text-2xl font-bold tracking-tight">
                        Nova<span className="text-sky-400">Mobiles</span>
                    </span>
                </Link>

                {/* Page icon */}
                <div className="w-16 h-16 mx-auto mt-6 mb-5 rounded-full bg-sky-400/10 border border-sky-400/30 flex items-center justify-center shadow-lg shadow-sky-500/10">

                    <Icon className="text-3xl text-sky-300" />

                </div>

                {/* Heading */}
                <div className="text-center mb-7">

                    <h1 className="text-3xl font-bold tracking-tight">
                        {title}
                    </h1>

                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                        {subtitle}
                    </p>

                </div>

                {children}

                {/* Back to Home */}
                <div className="mt-7 pt-5 border-t border-white/10">

                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                    >
                        <FiArrowLeft />

                        Back to Home
                    </Link>

                </div>

            </div>

        </div>
    );
}
