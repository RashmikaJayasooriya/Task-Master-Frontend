"use server";

import { z } from "zod";
import axios from "axios";

const FormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be between 3 and 20 characters"),
    password: z.string().min(4, "Password must be at least 4 characters").max(6, "Password must be between 4 and 6 characters"),
});

export async function login(formData: FormData) {
    try {
        const { username, password } = FormSchema.parse(Object.fromEntries(formData));

        const response = await axios.post("http://localhost:8080/user/authenticate", {
            username,
            password
        });

        if (response.status === 200 && response.data) {
            const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data.data.accessTokenResponse;
            const userId = response.data.data.userId;

            console.log("✅ Login Successful!", { access_token, refresh_token, expires_in, refresh_expires_in, userId });

            return { success: "Login successful!", access_token, refresh_token, expires_in, refresh_expires_in, userId };
        } else {
            return { error: "Login failed. Please check your credentials." };
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data || "Invalid username or password." };
        }
        return { error: "Something went wrong!" };
    }
}
