import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PatternCard from "../components/PatternCard";
import Chat from "../components/Chat";

function TesterDashboard() {
  const [patterns, setPatterns] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPatterns = async () => {
      const res = await axios.get("http://localhost:5000/api/pattern");
      setPatterns(res.data);
    };
    fetchPatterns();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tester Dashboard</h1>
        <Link
          to={`/profile/tester/${userId}`}
          className="text-blue-500 hover:underline"
        >
          View Profile
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {patterns.map((pattern) => (
          <PatternCard key={pattern._id} pattern={pattern} />
        ))}
      </div>
      <Chat userId={userId} receiverId="creatorId" />{" "}
      {/* Replace with dynamic creator ID */}
    </div>
  );
}

export default TesterDashboard;
