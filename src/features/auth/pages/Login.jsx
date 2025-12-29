import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const Login = ({ setUser }) => {
    const [username, setUsername] = useState(""); // foydalanuvchi nomi
    const [password, setPassword] = useState(""); // password
    const [loading, setLoading] = useState(false); // 🔹 loading state
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) return alert("Username va password kiriting");
        if (password.length < 3) return alert("Password kamida 3 ta belgi bo‘lishi kerak");

        setLoading(true); // 🔹 loading boshlash

        try {
            const usersRef = collection(db, "users");

            // 🔹 Foydalanuvchi tekshirish
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            let currentUser;

            if (!querySnapshot.empty) {
                // User topildi → login
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                if (userData.password !== password) {
                    setLoading(false);
                    return alert("Password noto‘g‘ri");
                }

                currentUser = {
                    id: userDoc.id,
                    ...userData,
                };
            } else {
                // User topilmadi → register
                const newUser = {
                    username,
                    password,
                    avatar: "https://th.bing.com/th/id/OIP.uVFh518-YOr5MWjr2SwPXQHaHa?w=180&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
                    createdAt: serverTimestamp(),
                };

                const docRef = await addDoc(usersRef, newUser);
                currentUser = { id: docRef.id, ...newUser };

                alert(`Account created! Welcome, ${currentUser.username}!`);
            }

            localStorage.setItem("user", JSON.stringify(currentUser));
            setUser(currentUser);
            navigate("/posts");

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false); // 🔹 loading tugadi
        }
    };

    return (
        <div className="w-full h-screen bg-black/20 flex items-center justify-center">
            <div className="bg-white max-w-[350px] w-full p-4 rounded-lg flex flex-col gap-2">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded px-2 py-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded px-2 py-2"
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white py-2 rounded font-medium flex items-center justify-center"
                    disabled={loading} // 🔹 loading paytida button disabled
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    ) : (
                        "Login / Register"
                    )}
                </button>
            </div>
        </div>
    );
};

export default Login;
