import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Phone,
    Video,
    Paperclip,
    Image as ImageIcon,
    Smile,
    Send,
    ChevronLeft,
} from "lucide-react";
import { db } from "../../../firebase";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    onSnapshot,
    orderBy,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

export default function UserChatPages() {
    const { id } = useParams(); // userchat/:id
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Fetch active chat user
    useEffect(() => {
        if (!id) return;
        const fetchUser = async () => {
            const docRef = doc(db, "users", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setActiveChat({ id: docSnap.id, ...docSnap.data() });
        };
        fetchUser();
    }, [id]);

    // Listen to messages
    useEffect(() => {
        if (!id) return;
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(
                    msg =>
                        (msg.from === currentUser.id && msg.to === id) ||
                        (msg.from === id && msg.to === currentUser.id)
                );
            setMessages(msgs);

            // O'qilmagan xabarlarni read=true qilamiz
            msgs.forEach(async msg => {
                if (msg.to === currentUser.id && !msg.read) {
                    await updateDoc(doc(db, "messages", msg.id), { read: true });
                }
            });
        });

        return () => unsubscribe();
    }, [id, currentUser.id]);

    // Scroll pastga xabar kelganda
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!message.trim() || !activeChat) return;

        const msgData = {
            from: currentUser.id,
            to: activeChat.id,
            text: message,
            createdAt: serverTimestamp(),
            read: false,
        };

        try {
            const docRef = await addDoc(collection(db, "messages"), msgData);

            // UI-ni darhol yangilash
            setMessages(prev => [...prev, { id: docRef.id, ...msgData, createdAt: new Date() }]);
            setMessage("");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-screen w-full bg-gray-100 text-gray-900 flex font-sans overflow-hidden">
            <main className="flex-1 flex flex-col mt- bg-gradient-to-br from-indigo-50 via-white to-purple-50 max-h-[8000px]">
                {/* Header */}
                <div className="flex items-center justify-between px-2 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    {activeChat && (
                        <div className="flex items-center gap-2">
                            <Link to={"/chat"}>
                                <ChevronLeft />
                            </Link>
                            <img src={activeChat.avatar} className="w-14 h-12 rounded-full" />
                            <div>
                                <p className="font-semibold">{activeChat.username}</p>
                                <p className="text-sm text-green-500">Active now</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <Phone size={18} />
                        <Video className="w-6 h-6" />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.from === currentUser.id ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${msg.from === currentUser.id ? "bg-blue-600 text-white" : "bg-gray-300"}`}>
                                <p>{msg.text}</p>
                                {msg.from === currentUser.id && (
                                    <span className="ml-2 text-[10px] opacity-70 float-right">
                                        {msg.read ? "✓✓" : "✓"}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 fixed bottom-0 left-0 w-full z-30 px-3 py-2 bg-white border-t border-gray-300">
                    <Paperclip size={20} />
                    <ImageIcon size={20} />
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border rounded-full border-gray-300 px-4 py-2 outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Smile size={20} />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 p-3 rounded-full text-white flex items-center justify-center"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </main>
        </div>
    );
}
