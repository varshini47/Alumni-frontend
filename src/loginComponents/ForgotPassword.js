import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../UserContext";

const ForgotPassword = () => {
     const { user } = useUser();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/forgot-password", { email });
            setMessage(response.data); // Success message from backend
        } catch (error) {
            setMessage("Error: Unable to send reset email.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl mb-4">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full mb-4 p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Send Reset Link
                </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
};

export default ForgotPassword;
