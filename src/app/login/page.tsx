"use client";
import { useState } from "react";
import { login } from "@/app/lib/login_action";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("Loading...");

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const result = await login(formData);
        setMessage(result.success || result.error || "");

        if (result.success) {
            const { access_token, refresh_token, expires_in, refresh_expires_in, userId } = result;

            // Store tokens and their expiration times
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);
            localStorage.setItem("accessTokenExpiresAt", String(Date.now() + expires_in * 1000));
            localStorage.setItem("refreshTokenExpiresAt", String(Date.now() + refresh_expires_in * 1000));
            localStorage.setItem("userId", userId);

            // Set up timeouts to clear tokens when they expire
            setTimeout(() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("accessTokenExpiresAt");
            }, expires_in * 1000);

            setTimeout(() => {
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("refreshTokenExpiresAt");
            }, refresh_expires_in * 1000);

            await router.push("/");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-5">Task Master Login</h2>
                <form onSubmit={handleSubmit}>
                    {message && <div className="text-red-500 mb-2">{message}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            name="username"
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don&#39;t have an account?{" "}
                    <a href="/signup" className="text-blue-500">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
