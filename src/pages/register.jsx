
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import {
    FiUser,
    FiUserPlus,
    FiMail,
    FiLock
} from "react-icons/fi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

export default function RegisterPage() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(event) {

        event.preventDefault();

        if (loading) return;

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            toast.error("Please complete all fields");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must contain at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {

            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users",
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    password: password
                }
            );

            toast.success("Registration successful");

            navigate("/login", { replace: true });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <AuthLayout
            title="Create Account"
            subtitle="Join NovaMobiles and discover your next device"
            icon={FiUserPlus}
        >

            <form
                onSubmit={handleRegister}
                className="flex flex-col gap-4"
            >

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <AuthInput
                        label="First name"
                        icon={FiUser}
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        required
                        disabled={loading}
                    />

                    <AuthInput
                        label="Last name"
                        icon={FiUser}
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        required
                        disabled={loading}
                    />

                </div>

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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={loading}
                />

                <p className="text-xs text-slate-400 -mt-2">
                    Use at least 8 characters for your password.
                </p>

                <AuthInput
                    label="Confirm password"
                    icon={FiLock}
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                />

                <AuthButton
                    loading={loading}
                    loadingText="Creating account..."
                >
                    Create Account
                </AuthButton>

            </form>

            <p className="mt-6 text-center text-sm text-slate-400">

                Already have an account?

                <Link
                    to="/login"
                    className="ml-2 text-sky-400 font-semibold hover:text-sky-300"
                >
                    Sign In
                </Link>

            </p>

        </AuthLayout>

    );

}
