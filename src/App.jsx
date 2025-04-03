import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import LoginModal from "./components/LoginModal";
import TesterDashboard from "./pages/TesterDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorAddProject from "./pages/CreatorAddProject";
import ChatPage from "./pages/ChatPage";
import CreatorProfile from "./pages/CreatorProfile";
import TesterProfile from "./pages/TesterProfile";
import Home from "./pages/Home";
import PatternList from "./components/PatternList";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error("Fetch user error:", err.response?.data || err.message);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("user");
          setShowLogin(true);
        }
      };
      fetchUser();
    } else {
      const timer = setTimeout(() => setShowLogin(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = (newUser) => {
    setUser(newUser);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={<Home user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/patterns"
            element={<PatternList patterns={[]} user={user} />}
          />
          <Route
            path="/tester"
            element={
              user?.role === "tester" ? (
                <TesterDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/creator"
            element={
              user?.role === "creator" ? (
                <CreatorDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/chat/:patternId/:otherUserId"
            element={user ? <ChatPage user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/creator/add-project"
            element={
              user?.role === "creator" ? (
                <CreatorAddProject user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile/creator/:id"
            element={
              user?.role === "creator" ? (
                <CreatorProfile user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile/tester/:id"
            element={
              user?.role === "tester" ? (
                <TesterProfile user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        <LoginModal
          isOpen={showLogin && !user}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      </div>
    </Router>
  );
}

export default App;
