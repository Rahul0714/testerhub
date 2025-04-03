import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PatternList from "../components/PatternList";

function TesterDashboard({ user, onLogout }) {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const fetchPatterns = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/pattern", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatterns(res.data);
      } catch (err) {
        console.error("Fetch patterns error:", err);
      }
    };
    fetchPatterns();
  }, []);

  if (!user || user.role !== "tester") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tester Dashboard</h1>
          <Link
            to={`/profile/tester/${user._id}`}
            className="text-blue-500 hover:underline"
          >
            Profile
          </Link>
        </div>
        <h2 className="text-xl font-semibold mb-4">Available Patterns</h2>
        <PatternList patterns={patterns} user={user} />
      </div>
    </div>
  );
}

export default TesterDashboard;
