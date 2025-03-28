import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import TesterDashboard from "./components/TesterDashboard";
import CreatorDashboard from "./components/CreatorDashboard";
import CreatorChat from "./components/CreatorChat";
import CreatorAddProject from "./components/CreatorAddProject";
import CreatorProfile from "./components/CreatorProfile";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to={`/${user.role}`} />
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
            path="/creator/chat/:projectId/:testerId"
            element={
              user?.role === "creator" ? (
                <CreatorChat user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
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
            path="/creator/profile"
            element={
              user?.role === "creator" ? (
                <CreatorProfile user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
