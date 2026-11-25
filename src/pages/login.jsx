
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import {
    FiMail,
    FiLock,
    FiUser
} from "react-icons/fi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(event) {

        event.preventDefault();

        if (loading) return;

        if (!email.trim() || !password) {
            toast.error("Please enter your email and password");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/login",
                {
                    email: email.trim(),
                    password: password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            toast.success("Login successful");

            if (response.data.role === "admin") {

                navigate("/admin/", { replace: true });

            } else {

                navigate("/", { replace: true });

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to sign in. Please try again."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your NovaMobiles account"
            icon={FiUser}
        >

            <form
                onSubmit={handleLogin}
                className="flex flex-col gap-5"
            >

                <AuthInput
                    label="Email address"
                    icon={FiMail}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={loading}
                />

                <AuthInput
                    label="Password"
                    icon={FiLock}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                />

                <div className="flex justify-end -mt-2">

                    <Link
                        to="/forget"
                        className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        Forgot password?
                    </Link>

                </div>

                <AuthButton
                    loading={loading}
                    loadingText="Signing in..."
                >
                    Sign In
                </AuthButton>

            </form>

            <p className="mt-6 text-center text-sm text-slate-400">

                Don't have an account?

                <Link
                    to="/signup"
                    className="ml-2 font-semibold text-sky-400 hover:text-sky-300"
                >
                    Create Account
                </Link>

            </p>

        </AuthLayout>

    );

}
