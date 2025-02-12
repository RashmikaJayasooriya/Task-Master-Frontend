"use client";

import { useState } from "react";
import {signUp} from "@/app/lib/signup_action";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    async function handleSubmit(formData: FormData) {
        setMessage("Loading...");

        const result = await signUp(formData);
        setMessage(result.success || result.error || "");

        if (result.success) {
            await router.push("/login");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-5">Task Master Sign Up</h2>
                <form action={handleSubmit}>
                    {message && <div className="text-red-500 mb-2">{message}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            name="username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">First Name</label>
                        <input
                            name="firstName"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            name="lastName"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
