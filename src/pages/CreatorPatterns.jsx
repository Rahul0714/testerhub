import { useState, useEffect } from "react";
import axios from "axios";

function CreatorPatterns({ user }) {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatterns = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/pattern/created/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatterns(res.data);
      } catch (err) {
        console.error(
          "Error fetching patterns:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPatterns();
  }, [user._id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Created Patterns</h1>
      {patterns.length === 0 ? (
        <p>No patterns created yet.</p>
      ) : (
        <div className="space-y-4">
          {patterns.map((pattern) => (
            <div key={pattern._id} className="border p-4">
              <p>
                <strong>Title:</strong> {pattern.title}
              </p>
              <p>
                <strong>Skill Level:</strong> {pattern.skillLevel || "N/A"}
              </p>
              <p>
                <strong>Applicants:</strong> {pattern.applicants?.length || 0}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {pattern.selectedTesters?.length > 0 ? "Active" : "Pending"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreatorPatterns;
