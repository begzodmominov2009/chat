// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
// import Sidebar from "../Sidebar/Sidebar";
// import Header from "../Navbar/Navbar";
import { useState } from "react";
import Footer from "../footer/footer";

const Layout = () => {
    const [aside, setAside] = useState(false)
    return (
        <div className="flex h-screen bg-gray-20">
            {/* <Sidebar /> */}
            <main className="flex-1 flex flex-col">
                {/* <Header /> */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <Outlet />
                    </div>
                    {aside ? (<aside className="w-80 bg-white p-4 border-gray-300 border-l hidden lg:block">
                        <h2 className="font-bold mb-4">Suggestions</h2>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-center justify-between">
                                <span>User 1</span>
                                <button className="text-blue-500 text-sm">Follow</button>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>User 2</span>
                                <button className="text-blue-500 text-sm">Follow</button>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>User 3</span>
                                <button className="text-blue-500 text-sm">Follow</button>
                            </li>
                        </ul>
                    </aside>) : ("")}
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default Layout;
