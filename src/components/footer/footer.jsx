import { Home, MessageCircle, Search, User } from 'lucide-react'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='flex items-center fixed bottom-0 border-t border-gray-300 w-full left-0 px-5 justify-between py-3 bg-[white]'>
            <NavLink to="/posts" className="flex text-[12px]  items-center hover:text-blue-500">
                <Home size={25} /> 
            </NavLink>
            <NavLink to="/stories" className="flex items-center gap-2 hover:text-blue-500">
                <Search size={25} /> 
            </NavLink>
            <NavLink to="/chat" className="flex items-center gap-2 hover:text-blue-500">
                <MessageCircle size={25} /> 
            </NavLink>
            <NavLink to="/profile/1" className="flex items-center gap-2 hover:text-blue-500">
                <User size={25} /> 
            </NavLink>
        </div>
    )
}

export default Footer
