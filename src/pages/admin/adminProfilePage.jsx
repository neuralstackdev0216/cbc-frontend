
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
    FiUser,
    FiMail,
    FiShield,
    FiLock,
    FiEye,
    FiEyeOff,
    FiSave,
    FiImage
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-900 " +
    "border border-slate-600 text-white " +
    "placeholder:text-slate-500 focus:outline-none " +
    "focus:ring-2 focus:ring-sky-500 transition " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

const buttonClass =
    "flex items-center justify-center gap-2 " +
    "bg-sky-500 hover:bg-sky-400 text-white " +
    "font-semibold px-6 py-3 rounded-xl transition " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

function PasswordInput({
    label,
    value,
    onChange,
    placeholder,
    autoComplete
}) {
    const [visible, setVisible] = useState(false);

    return (
        <label className="block">

            <span className="block text-sm font-medium text-slate-300 mb-2">
                {label}
            </span>

            <div className="relative">

                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    className={`${inputClass} pl-11 pr-12`}
                />

                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-label={
                        visible ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                    {visible ? <FiEyeOff /> : <FiEye />}
                </button>

            </div>

        </label>
    );
}

export default function AdminProfilePage({
    admin,
    onProfileUpdated,
    onSessionExpired
}) {

    const [firstName, setFirstName] = useState(
        admin?.firstName || ""
    );

    const [lastName, setLastName] = useState(
        admin?.lastName || ""
    );

    const [img, setImg] = useState(
        admin?.img || ""
    );

    const [imageFailed, setImageFailed] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const isBusy = savingProfile || changingPassword;

    const fullName =
        `${admin?.firstName || ""} ${admin?.lastName || ""}`.trim()
        || "Administrator";

    const initials =
        (
            (admin?.firstName?.charAt(0) || "") +
            (admin?.lastName?.charAt(0) || "")
        ).toUpperCase() || "A";

    const hasChanges =
        firstName.trim() !== (admin?.firstName || "") ||
        lastName.trim() !== (admin?.lastName || "") ||
        img.trim() !== (admin?.img || "");

    function getToken() {
        const token = localStorage.getItem("token");

        if (!token) {
            onSessionExpired();
            return null;
        }

        return token;
    }

    function handleApiError(error, fallbackMessage) {

        if (
            error.response?.status === 401 ||
            error.response?.status === 403
        ) {
            onSessionExpired();
            return;
        }

        toast.error(
            error.response?.data?.message || fallbackMessage
        );
    }

    // Update personal information
    async function handleUpdateProfile(event) {

        event.preventDefault();

        if (isBusy || !hasChanges) return;

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanImage = img.trim();

        if (
            !cleanFirstName ||
            !cleanLastName ||
            cleanFirstName.length > 50 ||
            cleanLastName.length > 50
        ) {
            toast.error(
                "Names must contain 1-50 characters"
            );
            return;
        }

        if (cleanImage) {
            try {
                const url = new URL(cleanImage);

                if (
                    url.protocol !== "https:" ||
                    url.username ||
                    url.password
                ) {
                    throw new Error("Invalid URL");
                }
            } catch {
                toast.error(
                    "Enter a valid HTTPS image URL"
                );
                return;
            }
        }

        const token = getToken();

        if (!token) return;

        setSavingProfile(true);

        try {

            const response = await axios.patch(
                `${API_URL}/api/users/profile`,
                {
                    firstName: cleanFirstName,
                    lastName: cleanLastName,
                    img: cleanImage
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedUser = response.data.user;

            // Update the parent admin component
            onProfileUpdated(updatedUser);

            setFirstName(updatedUser.firstName || "");
            setLastName(updatedUser.lastName || "");
            setImg(updatedUser.img || "");
            setImageFailed(false);

            toast.success("Profile updated successfully");

        } catch (error) {

            handleApiError(
                error,
                "Failed to update profile"
            );

        } finally {

            setSavingProfile(false);

        }
    }

    // Reset unsaved profile changes
    function handleReset() {

        setFirstName(admin?.firstName || "");
        setLastName(admin?.lastName || "");
        setImg(admin?.img || "");
        setImageFailed(false);

    }

    // Change account password
    async function handleChangePassword(event) {

        event.preventDefault();

        if (isBusy) return;

        if (!currentPassword) {
            toast.error("Enter your current password");
            return;
        }

        if (
            newPassword.length < 8 ||
            new TextEncoder().encode(newPassword).length > 72
        ) {
            toast.error(
                "Password must contain at least 8 characters and no more than 72 UTF-8 bytes"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error(
                "New password must be different"
            );
            return;
        }

        const token = getToken();

        if (!token) return;

        setChangingPassword(true);

        try {

            await axios.patch(
                `${API_URL}/api/users/change-password`,
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            onSessionExpired(
                "Password changed. Please sign in again.",
                true
            );

        } catch (error) {

            handleApiError(
                error,
                "Failed to change password"
            );

        } finally {

            setChangingPassword(false);

        }
    }

    return (

        <div className="w-full min-h-full bg-primary p-4 md:p-8 text-white">

            <div className="max-w-4xl mx-auto">

                {/* Page header */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        My Profile
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Manage your personal information
                        and account security.
                    </p>

                </div>

                {/* Profile information */}
                <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 md:p-7 mb-6">

                    {/* Profile overview */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-700">

                        <div className="w-24 h-24 rounded-full overflow-hidden bg-sky-900 flex items-center justify-center shrink-0 border-2 border-sky-500">

                            {admin?.img && !imageFailed ? (

                                <img
                                    src={admin.img}
                                    alt="Admin profile"
                                    referrerPolicy="no-referrer"
                                    onError={() => setImageFailed(true)}
                                    className="w-full h-full object-cover"
                                />

                            ) : (

                                <span className="text-3xl font-bold text-sky-300">
                                    {initials}
                                </span>

                            )}

                        </div>

                        <div className="text-center sm:text-left min-w-0">

                            <h2 className="text-2xl font-bold break-words">
                                {fullName}
                            </h2>

                            <p className="text-slate-400 mt-1 break-all">
                                {admin?.email}
                            </p>

                            <span className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-semibold mt-3">

                                <FiShield />

                                Administrator

                            </span>

                        </div>

                    </div>

                    {/* Personal information form */}
                    <form
                        onSubmit={handleUpdateProfile}
                        className="mt-6"
                    >

                        <div className="flex items-center gap-3 mb-6">

                            <FiUser className="text-xl text-sky-400" />

                            <h2 className="text-xl font-semibold">
                                Personal Information
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <label>

                                <span className="block text-sm text-slate-300 mb-2">
                                    First Name
                                </span>

                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    maxLength={50}
                                    required
                                    className={inputClass}
                                />

                            </label>

                            <label>

                                <span className="block text-sm text-slate-300 mb-2">
                                    Last Name
                                </span>

                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    maxLength={50}
                                    required
                                    className={inputClass}
                                />

                            </label>

                            <label>

                                <span className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                                    <FiMail />
                                    Email Address
                                </span>

                                <input
                                    type="email"
                                    value={admin?.email || ""}
                                    disabled
                                    className={inputClass}
                                />

                                <span className="block text-xs text-slate-500 mt-2">
                                    Email cannot be changed here.
                                </span>

                            </label>

                            <label>

                                <span className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                                    <FiShield />
                                    Account Role
                                </span>

                                <input
                                    type="text"
                                    value="Administrator"
                                    disabled
                                    className={inputClass}
                                />

                            </label>

                        </div>

                        {/* Profile picture URL */}
                        <label className="block mt-5">

                            <span className="flex items-center gap-2 text-sm text-slate-300 mb-2">

                                <FiImage />

                                Profile Image URL

                            </span>

                            <input
                                type="url"
                                value={img}
                                onChange={(e) =>
                                    setImg(e.target.value)
                                }
                                maxLength={2048}
                                placeholder="https://example.com/avatar.jpg"
                                className={inputClass}
                            />

                            <span className="block text-xs text-slate-500 mt-2">
                                Enter an HTTPS image URL or leave
                                empty to use your initials.
                            </span>

                        </label>

                        {/* Profile form actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7">

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={!hasChanges || isBusy}
                                className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-50"
                            >
                                Cancel Changes
                            </button>

                            <button
                                type="submit"
                                disabled={!hasChanges || isBusy}
                                className={buttonClass}
                            >

                                <FiSave />

                                {savingProfile
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </form>

                </section>

                {/* Account security */}
                <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 md:p-7">

                    <div className="flex items-center gap-3 mb-2">

                        <FiShield className="text-2xl text-sky-400" />

                        <h2 className="text-xl font-semibold">
                            Account Security
                        </h2>

                    </div>

                    <p className="text-sm text-slate-400 mb-6">
                        Update your password to protect your account.
                    </p>

                    <form
                        onSubmit={handleChangePassword}
                        className="space-y-5"
                    >

                        <PasswordInput
                            label="Current Password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            placeholder="Enter current password"
                            autoComplete="current-password"
                        />

                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            autoComplete="new-password"
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                        />

                        {confirmPassword &&
                            newPassword !== confirmPassword && (

                            <p className="text-sm text-red-400">
                                Passwords do not match.
                            </p>

                        )}

                        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">

                            <p className="text-sm font-semibold text-slate-300 mb-2">
                                Password requirements
                            </p>

                            <p className="text-xs text-slate-400 leading-6">
                                • At least 8 characters<br />
                                • Maximum 72 UTF-8 bytes<br />
                                • Different from your current password<br />
                                • New passwords must match
                            </p>

                        </div>

                        <div className="flex justify-end">

                            <button
                                type="submit"
                                disabled={
                                    isBusy ||
                                    !currentPassword ||
                                    !newPassword ||
                                    !confirmPassword ||
                                    newPassword !== confirmPassword
                                }
                                className={buttonClass}
                            >

                                <FiLock />

                                {changingPassword
                                    ? "Changing Password..."
                                    : "Change Password"}

                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </div>

    );
}
