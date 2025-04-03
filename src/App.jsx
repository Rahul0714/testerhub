import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreatorDashboard from "./pages/CreatorDashboard";
import TesterDashboard from "./pages/TesterDashboard";
import ChatPage from "./pages/ChatPage";
import CreatorProfile from "./pages/CreatorProfile";
import TesterProfile from "./pages/TesterProfile";
import LoginPopup from "./components/LoginPopup";
import SignupPopup from "./components/SignupPopup";
import { jwtDecode } from "jwt-decode";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, role: decoded.role });
    } else {
      const timer = setTimeout(() => setShowLogin(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/creator"
            element={
              user?.role === "creator" ? (
                <CreatorDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/tester"
            element={
              user?.role === "tester" ? (
                <TesterDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/chat/:userId/:otherUserId"
            element={user ? <ChatPage /> : <Navigate to="/" />}
          />
          <Route path="/profile/creator/:id" element={<CreatorProfile />} />
          <Route path="/profile/tester/:id" element={<TesterProfile />} />
        </Routes>
        {showLogin && (
          <LoginPopup
            onClose={() => setShowLogin(false)}
            onSignup={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            setUser={setUser}
          />
        )}
        {showSignup && (
          <SignupPopup onClose={() => setShowSignup(false)} setUser={setUser} />
        )}
      </div>
    </Router>
  );
}

export default App;
