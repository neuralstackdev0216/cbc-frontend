
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import {
    FiMail,
    FiLock,
    FiKey,
    FiShield
} from "react-icons/fi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

export default function ForgetPassword() {

    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function sendOtp(event) {

        event.preventDefault();

        if (loading) return;

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);

        try {

            await axios.post(
                import.meta.env.VITE_BACKEND_URL +
                "/api/users/send-otp",
                {
                    email: email.trim()
                }
            );

            setOtpSent(true);

            toast.success(
                "If the account exists, a verification code has been sent."
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to send verification code"
            );

        } finally {

            setLoading(false);

        }

    }

    async function verifyOtp(event) {

        event.preventDefault();

        if (loading) return;

        if (!otp.trim() || !newPassword || !confirmPassword) {
            toast.error("Please complete all fields");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must contain at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {

            await axios.post(
                import.meta.env.VITE_BACKEND_URL +
                "/api/users/reset-password",
                {
                    email: email.trim(),
                    otp: otp.trim(),
                    password: newPassword
                }
            );

            toast.success("Password reset successfully");

            navigate("/login", { replace: true });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to reset password. Please try again."
            );

        } finally {

            setLoading(false);

        }

    }

    function changeEmail() {

        setOtpSent(false);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");

    }

    return (

        <AuthLayout
            title={
                otpSent
                    ? "Reset Password"
                    : "Forgot Password?"
            }
            subtitle={
                otpSent
                    ? "Enter your verification code and choose a new password."
                    : "Enter your email to receive a verification code."
            }
            icon={otpSent ? FiShield : FiMail}
        >

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">

                <div className="flex-1 h-1.5 bg-sky-400 rounded-full" />

                <div
                    className={`
                        flex-1 h-1.5 rounded-full
                        ${otpSent ? "bg-sky-400" : "bg-white/10"}
                    `}
                />

            </div>

            <p className="text-center text-xs text-slate-400 mb-5">
                Step {otpSent ? "2" : "1"} of 2
            </p>

            {!otpSent ? (

                <form
                    onSubmit={sendOtp}
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

                    <AuthButton
                        loading={loading}
                        loadingText="Sending code..."
                    >
                        Send Verification Code
                    </AuthButton>

                </form>

            ) : (

                <form
                    onSubmit={verifyOtp}
                    className="flex flex-col gap-4"
                >

                    <div className="bg-sky-400/10 border border-sky-400/20 rounded-xl p-3 text-center">

                        <p className="text-xs text-slate-400">
                            Verification email
                        </p>

                        <p className="text-sm text-sky-300 mt-1 break-all">
                            {email}
                        </p>

                    </div>

                    <AuthInput
                        label="Verification code"
                        icon={FiKey}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        required
                        disabled={loading}
                    />

                    <AuthInput
                        label="New password"
                        icon={FiLock}
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        disabled={loading}
                    />

                    <AuthInput
                        label="Confirm new password"
                        icon={FiLock}
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                    />

                    <AuthButton
                        loading={loading}
                        loadingText="Resetting password..."
                    >
                        Reset Password
                    </AuthButton>

                    <button
                        type="button"
                        onClick={changeEmail}
                        disabled={loading}
                        className="text-sm text-sky-400 hover:text-sky-300 disabled:opacity-50"
                    >
                        Change email address
                    </button>

                </form>

            )}

            <p className="mt-6 text-center text-sm text-slate-400">

                Remember your password?

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
