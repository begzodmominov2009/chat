import React, { useState, useEffect } from "react";
import {
  Bell,
  Phone,
  Video,
  User,
  MoreVertical,
  Search,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Send,
  Mail,
  Lock,
  Settings,
} from "lucide-react";

export default function ChatPages() {
  const [showProfile, setShowProfile] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // boshlang‘ichda null
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://695158d270e1605a1089de10.mockapi.io/users"
        );
        const data = await res.json();
        // login bo‘lgan userni olib tashlaymiz
        const filteredUsers = data.filter((u) => u.id !== currentUser.id);
        setUsers(filteredUsers);
        // default activeChat birinchi user
        if (filteredUsers.length > 0) setActiveChat(filteredUsers[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!activeChat || !message.trim()) return;

    const msgData = {
      from: currentUser.id,
      to: activeChat.id,
      text: message,
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch("https://695158d270e1605a1089de10.mockapi.io/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
      setMessage(""); // input tozalash
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 text-gray-900 flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[320px] bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold text-indigo-600">Chat</h1>
          <div className="relative">
            <Bell size={18} />
            <span className="absolute -top-2 -right-2 bg-pink-500 text-xs w-5 h-5 rounded-full flex items-center justify-center text-white">
              3
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="opacity-60" />
            <input
              placeholder="Search users..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Users list from backend */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeChat?.id === user.id ? "bg-indigo-50" : ""
                }`}
              onClick={() => setActiveChat(user)}
            >
              <img src={user.avatar} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm opacity-60">Last message preview...</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col mt- bg-gradient-to-br from-indigo-50 via-white to-purple-50 max-h-[8000px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          {activeChat && (
            <div className="flex items-center gap-3">
              <img src={activeChat.avatar} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{activeChat.name}</p>
                <p className="text-sm text-green-500">Active now</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Phone size={18} />
            <Video size={18} />
            <button
              onClick={() => setShowProfile(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <User className="cursor-pointer" size={18} />
            </button>
            <MoreVertical size={18} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {/* Hozircha faqat static, keyin backenddan filter qilamiz */}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
            <Paperclip size={18} />
            <ImageIcon size={18} />
            <input
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Smile size={18} />
            <button
              onClick={sendMessage}
              className="bg-indigo-500 p-2 rounded-lg text-white"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* Profile Panel */}
      {showProfile && activeChat && (
        <aside className="w-[340px] bg-white overflow-y-scroll border-l border-gray-300 flex flex-col transition-transform duration-500 ease-in-out min-h-0">
          <div className="px-6 py-[26px] border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <p className="font-semibold">Profile</p>
            <button className="cursor-pointer" onClick={() => setShowProfile(false)}>✕</button>
          </div>

          <div className="p-6 flex flex-col items-center gap-4">
            <img src={activeChat.avatar} className="w-24 h-24 rounded-full" />
            <p className="font-semibold text-lg">{activeChat.name}</p>
            <p className="text-sm opacity-60">User</p>

            <div className="flex gap-4 mt-2">
              <div className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-center">
                <p className="font-semibold">Chats</p>
              </div>
              <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-center">
                <p className="font-semibold">Messages</p>
              </div>
            </div>

            <div className="px-6 space-y-3 w-full mt-4">
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
                <Mail size={18} />
                <span>{activeChat.email || "example@email.com"}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
                <Phone size={18} />
                <span>{activeChat.phone || "+998 90 123 45 67"}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
                <Lock size={18} />
                <span>Privacy & Security</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
                <Settings size={18} />
                <span>Account Settings</span>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 flex-shrink-0">
            <button className="w-full bg-indigo-500 text-white py-3 rounded-xl">Save Changes</button>
            <button className="w-full mt-3 bg-gray-200 py-3 rounded-xl">Sign Out</button>
          </div>
        </aside>
      )}
    </div>
  );
}
