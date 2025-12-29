import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const ChatPages = () => {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const usersList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.id !== currentUser.id); // hozirgi userni olib tashlash
        setUsers(usersList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [currentUser.id]);

  return (
    <div>
      <div className='pt-2 px-2 pb-2'>
        <h1 className="font-medium text-[18px]">{currentUser.username}</h1>
        <input
          className='border border-gray-300 rounded-2xl w-full px-2 py-1 mt-3 outline-none'
          placeholder='Search'
          type="text"
        />
      </div>

      <div className='mt-2 flex items-center gap-2 px-2 overflow-x-auto'>
        {users.map((user) => (
          <Link key={user.id} to={`/userchat/${user.id}`} className='flex items-center flex-col'>
            <div className='w-20 h-18 rounded-full overflow-hidden'>
              <img className='w-full h-full' src={user.avatar || "https://tse3.mm.bing.net/th/id/OIP.wPWx97qT9JbAIeh4t6TDVQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"} alt={user.username} />
            </div>
            <p className='text-[12px]'>{user.username}</p>
          </Link>
        ))}
      </div>

      <div>
        <h1 className='font-medium mt-3 px-2 text-[18px]'>Message</h1>
      </div>

      <div className='mt-2 '>
        {users.map((user) => (
          <Link
            key={user.id}
            to={`/userchat/${user.id}`}
            className='flex items-center gap-2 border-t px-2 border-gray-300 py-1'
          >
            <div className='rounded-full object-cover overflow-hidden w-16 h-14'>
              <img className='w-full h-full' src={user.avatar || "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Free-Download.png"} alt={user.username} />
            </div>
            <div>
              <h1>{user.username}</h1>
              <p className='text-[12px]'>activeMessage</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatPages;
