
import { FiArrowRight, FiLoader } from "react-icons/fi";

export default function AuthButton({
    children,
    loading = false,
    loadingText = "Please wait..."
}) {

    return (

        <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >

            {loading ? (

                <>
                    <FiLoader className="animate-spin text-lg" />

                    {loadingText}
                </>

            ) : (

                <>
                    {children}

                    <FiArrowRight className="text-lg" />
                </>

            )}

        </button>

    );

}
