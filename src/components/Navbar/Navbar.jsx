import { Bell, Settings } from "lucide-react";

// src/components/Header.jsx
const Header = () => {
    return (
        <header className="h-16 bg-white flex items-center justify-end px-6 shadow">
            <div className="flex items-center gap-4">
                <button className="hover:text-blue-500">
                    <Bell />
                </button>
                <button className="hover:text-blue-500">
                    <Settings />
                </button>
            </div>
        </header>
    );
};

export default Header;
