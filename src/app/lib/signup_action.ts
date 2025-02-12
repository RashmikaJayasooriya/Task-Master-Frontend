'use server';

import { z } from "zod";
import axios from "axios";

const FormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be between 3 and 20 characters"),
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(3, "First name must be at least 3 characters").max(20, "First name must be between 3 and 20 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters").max(20, "Last name must be between 3 and 20 characters"),
    password: z.string().min(4, "Password must be at least 4 characters").max(6, "Password must be between 4 and 6 characters"),
});

export async function signUp(formData: FormData) {
    try {
        const { username, email, firstName, lastName, password } = FormSchema.parse(Object.fromEntries(formData));

        const response = await axios.post("http://localhost:8080/user/create", {
            username,
            email,
            firstName,
            lastName,
            password
        });

        if (response.status === 200) {
            return { success: "User created successfully!" };
        } else {
            return { error: "Failed to create user." };
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data || "Signup failed. Try again!" };
        }
        return { error: "Something went wrong!" };
    }
}
