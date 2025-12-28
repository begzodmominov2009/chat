// src/features/auth/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!name || !password) {
            alert("Please enter name and password");
            return;
        }

        try {
            // 1️⃣ Tekshirish: user mavjudmi
            const res = await fetch(`https://695158d270e1605a1089de10.mockapi.io/users?name=${name}`);
            const users = await res.json();

            let currentUser;

            if (users.length > 0) {
                // Foydalanuvchi mavjud → avtomatik login
                currentUser = users[0];
                alert(`Welcome back, ${currentUser.name}!`);
            } else {
                // Foydalanuvchi mavjud emas → yangi account yaratish
                const response = await fetch("https://695158d270e1605a1089de10.mockapi.io/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, password }),
                });
                currentUser = await response.json();
                alert(`Account created successfully! Welcome, ${currentUser.name}!`);
            }

            // LocalStorage va App.jsx state ga saqlash
            localStorage.setItem("user", JSON.stringify(currentUser));
            setUser(currentUser);

            // Home (Posts) page ga redirect
            navigate("/posts");

        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="w-full h-screen bg-[black]/20 flex items-center justify-center">
            <div className="flex items-center justify-center flex-col bg-[white] max-w-[350px] w-full p-4 rounded-lg gap-2">
                <input
                    placeholder="Your name"
                    className="border w-full border-gray-300 outline-none rounded px-2 py-2"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    placeholder="Your password"
                    className="border w-full border-gray-300 outline-none rounded px-2 py-2"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="w-full bg-blue-600 rounded px-2 py-2 text-[white] cursor-pointer font-medium flex items-center justify-center"
                    onClick={handleLogin}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default Login;
