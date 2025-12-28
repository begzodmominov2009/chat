// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Auth Pages
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

// Main Pages
import Layout from "./components/Layout/Layout";
import ChatPages from "./features/chat/pages/ChatPages";
import PostPages from "./features/posts/pages/PostPages";
import StoryPage from "./features/stories/pages/StoryPage";
import ProfilePages from "./features/profile/pages/ProfilePages";

function App() {
  const [user, setUser] = useState(null);

  // Agar localStorage da user bo‘lsa, app ochilganda setUser qilamiz
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Protected routes */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/posts" />} />
          <Route path="stories" element={<StoryPage />} />
          <Route path="chat" element={<ChatPages />} />
          <Route path="posts" element={<PostPages />} />
          <Route path="profile/:userId" element={<ProfilePages />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
