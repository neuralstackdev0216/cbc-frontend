
import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthInput({
    label,
    icon: Icon,
    type = "text",
    ...props
}) {

    const id = useId();

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <div className="w-full min-w-0">

            <label
                htmlFor={id}
                className="block text-sm font-medium text-slate-200 mb-2"
            >
                {label}
            </label>

            <div className="relative flex items-center">

                {Icon && (
                    <Icon className="absolute left-4 text-sky-300 text-lg pointer-events-none" />
                )}

                <input
                    {...props}
                    id={id}
                    type={
                        isPassword
                            ? showPassword ? "text" : "password"
                            : type
                    }
                    className={`
                        w-full h-12 rounded-xl
                        bg-white/[0.06]
                        border border-white/15
                        text-white text-sm
                        placeholder:text-slate-500
                        outline-none
                        focus:border-sky-400
                        focus:ring-2 focus:ring-sky-400/15
                        transition-all duration-200
                        disabled:opacity-50
                        ${Icon ? "pl-11" : "pl-4"}
                        ${isPassword ? "pr-12" : "pr-4"}
                    `}
                />

                {isPassword && (

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        className="absolute right-4 text-slate-400 hover:text-sky-300 transition-colors"
                    >

                        {showPassword
                            ? <FiEyeOff size={18} />
                            : <FiEye size={18} />
                        }

                    </button>

                )}

            </div>

        </div>
    );
}
