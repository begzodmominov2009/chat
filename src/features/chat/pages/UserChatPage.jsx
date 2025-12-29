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
    const { id } = useParams();
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEmoji, setShowEmoji] = useState(false);

    const fileRef = useRef(null);
    const imageRef = useRef(null);
    const messagesEndRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    /* ================= USER ================= */
    useEffect(() => {
        if (!id) return;
        const fetchUser = async () => {
            const snap = await getDoc(doc(db, "users", id));
            if (snap.exists()) {
                setActiveChat({ id: snap.id, ...snap.data() });
            }
        };
        fetchUser();
    }, [id]);

    const getAllEmojis = () => {
        const ranges = [
            [0x1F300, 0x1F5FF], // symbols & pictographs
            [0x1F600, 0x1F64F], // emoticons 🙂
            [0x1F680, 0x1F6FF], // transport 🚗
            [0x1F700, 0x1F77F],
            [0x1F780, 0x1F7FF],
            [0x1F800, 0x1F8FF],
            [0x1F900, 0x1F9FF], // people & gestures
            [0x1FA00, 0x1FAFF], // extended
            [0x2600, 0x26FF],   // misc ☀
            [0x2700, 0x27BF],   // dingbats ✔
        ];

        let emojis = [];
        ranges.forEach(([start, end]) => {
            for (let i = start; i <= end; i++) {
                emojis.push(String.fromCodePoint(i));
            }
        });
        return emojis;
    };

    const emojis = getAllEmojis();


    /* ================= MESSAGES ================= */
    useEffect(() => {
        if (!id) return;

        const q = query(
            collection(db, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsub = onSnapshot(q, async (snap) => {
            const msgs = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter(
                    (m) =>
                        (m.from === currentUser.id && m.to === id) ||
                        (m.from === id && m.to === currentUser.id)
                );

            setMessages(msgs);

            // read=true
            msgs.forEach(async (m) => {
                if (m.to === currentUser.id && !m.read) {
                    await updateDoc(doc(db, "messages", m.id), { read: true });
                }
            });
        });

        return () => unsub();
    }, [id, currentUser.id]);

    /* ================= SCROLL ================= */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ================= SEND ================= */
    const sendMessage = async () => {
        if (!message.trim() || !activeChat) return;

        const tempMsg = {
            id: Date.now().toString(),
            from: currentUser.id,
            to: activeChat.id,
            text: message,
            createdAt: new Date(),
            read: false,
        };

        // 🔥 UI darhol
        setMessages((prev) => [...prev, tempMsg]);
        setMessage("");

        await addDoc(collection(db, "messages"), {
            from: currentUser.id,
            to: activeChat.id,
            text: tempMsg.text,
            createdAt: serverTimestamp(),
            read: false,
        });
    };

    /* ================= FILE ================= */
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log("FILE:", file);
    };

    const handleImage = (e) => {
        const img = e.target.files[0];
        if (!img) return;
        console.log("IMAGE:", img);
    };

    return (
        <div className="h-screen w-full bg-gray-100 text-gray-900 flex font-sans overflow-hidden">
            <main className="flex-1 flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">

                {/* HEADER */}
                <div className="flex items-center justify-between px-2 py-4 border-b border-gray-300 bg-white">
                    {activeChat && (
                        <div className="flex items-center gap-2">
                            <Link to="/chat">
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
                        <Video size={18} />
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-16 flex flex-col gap-2">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.from === currentUser.id ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`px-2 pr-2 py-2 flex items-end rounded-2xl max-w-[70%] ${msg.from === currentUser.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-300"
                                    }`}
                            >
                                <p>{msg.text}</p>
                                {msg.from === currentUser.id && (
                                    <span className="ml-2 text-[10px] opacity-70">
                                        {msg.read ? "✓✓" : "✓"}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="fixed bottom-0 left-0 w-full z-30 px-3 py-2 bg-white border-t border-gray-300 flex items-center gap-2">
                    <Paperclip size={20} onClick={() => fileRef.current.click()} />
                    <ImageIcon size={20} onClick={() => imageRef.current.click()} />

                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />

                    <Smile size={20} onClick={() => setShowEmoji(!showEmoji)} />

                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 p-3 rounded-full text-white"
                    >
                        <Send size={16} />
                    </button>
                </div>

                {/* EMOJI */}
                {showEmoji && (
                    <div onClick={() => setShowEmoji(false)} className="fixed inset-0 z-40">
                        <div className="absolute bottom-16 left-3 bg-white border border-gray-300 rounded-xl p-2 flex flex-wrap gap-2 text-xl z-50 max-w-[340px] max-h-[260px] overflow-y-auto">
                            {emojis.map((e, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setMessage(prev => prev + e);
                                    }}
                                    className="hover:scale-125 transition"
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                )}

                {/* FILE INPUTS */}
                <input type="file" ref={fileRef} className="hidden" onChange={handleFile} />
                <input type="file" accept="image/*" ref={imageRef} className="hidden" onChange={handleImage} />
            </main>
        </div>
    );
}
