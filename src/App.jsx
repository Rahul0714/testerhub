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
import CreatorAddpattern from "./pages/CreatorAddPattern";
import ChatPage from "./pages/ChatPage";
import CreatorProfile from "./pages/CreatorProfile";
import TesterProfile from "./pages/TesterProfile";
import CreatorApplicants from "./components/CreatorApplicants";
import DummyPage from "./pages/DummyPage";
import CreatorPatterns from "./pages/CreatorPatterns";
import PatternList from "./components/PatternList";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  console.log("App component rendered");

  useEffect(() => {
    console.log("useEffect triggered");

    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (token) {
      const fetchUser = async () => {
        try {
          console.log("Fetching user with token:", token);
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("User data from API:", res.data);
          setUser(res.data);
        } catch (err) {
          console.error("Fetch user error:", err.response?.data || err.message);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("user");
          setShowLogin(true);
        } finally {
          setLoading(false); // Done fetching
        }
      };
      fetchUser();
    } else {
      console.log("No token found, setting login timer");
      setLoading(false); // No fetch needed, proceed
      const timer = setTimeout(() => {
        console.log("Timer triggered, showing login");
        setShowLogin(true);
      }, 5000);
      return () => {
        console.log("Cleaning up timer");
        clearTimeout(timer);
      };
    }
  }, []);

  const handleLogin = (newUser) => {
    console.log("User logged in:", newUser);
    setUser(newUser);
    setShowLogin(false);
  };

  const handleLogout = () => {
    console.log("Logging out");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  };

  console.log("Current user state:", user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* <Navbar user={user} onLogout={handleLogout} /> */}
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <Routes>
              <Route
                path="/"
                element={
                  user ? (
                    user.role === "tester" ? (
                      <TesterDashboard user={user} onLogout={handleLogout} />
                    ) : (
                      <CreatorDashboard user={user} onLogout={handleLogout} />
                    )
                  ) : (
                    <DummyPage />
                  )
                }
              />
              <Route
                path="/creator/patterns"
                element={
                  user?.role === "creator" ? (
                    <CreatorPatterns user={user} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/tester/patterns"
                element={
                  user?.role === "tester" ? (
                    <PatternList user={user} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/creator/patterns/:patternId/applicants"
                element={
                  user?.role === "creator" ? (
                    <CreatorApplicants user={user} />
                  ) : (
                    <TesterDashboard user={user} onLogout={handleLogout} />
                  )
                }
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
                path="/creator/add-pattern"
                element={
                  user?.role === "creator" ? (
                    <CreatorAddpattern user={user} />
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
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
