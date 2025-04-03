import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function CreatorDashboard({ user, onLogout }) {
  const [patterns, setPatterns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skillLevel: "",
    positions: "",
    compensation: "",
    completionTime: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatterns = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/pattern", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatterns(res.data.filter((p) => p.creator._id === user._id));
      } catch (err) {
        console.error("Fetch patterns error:", err);
      }
    };
    fetchPatterns();
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/pattern/create",
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          skillLevel: formData.skillLevel,
          positions: parseInt(formData.positions),
          compensation: formData.compensation,
          completionTime: formData.completionTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPatterns([...patterns, res.data]);
      setFormData({
        title: "",
        description: "",
        category: "",
        skillLevel: "",
        positions: "",
        compensation: "",
        completionTime: "",
      });
      setShowForm(false);
      setError("");
    } catch (err) {
      console.error("Create pattern error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create pattern");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user || user.role !== "creator") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Creator Studio</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {showForm ? "Cancel" : "New Pattern"}
            </button>
            <Link
              to={`/profile/creator/${user._id}`}
              className="text-purple-500 hover:underline"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Pattern Creation Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">
              Create a New Pattern
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Pattern Title"
                className="col-span-2 p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="col-span-2 p-2 border rounded h-24"
                required
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category (e.g., Knitting)"
                className="p-2 border rounded"
                required
              />
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              >
                <option value="">Skill Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <input
                type="number"
                name="positions"
                value={formData.positions}
                onChange={handleChange}
                placeholder="Positions"
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="compensation"
                value={formData.compensation}
                onChange={handleChange}
                placeholder="Compensation (e.g., $50)"
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="completionTime"
                value={formData.completionTime}
                onChange={handleChange}
                placeholder="Completion Time (e.g., 2 weeks)"
                className="col-span-2 p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="col-span-2 bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
              >
                Submit Pattern
              </button>
            </form>
          </div>
        )}

        {/* Pattern Management Section */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            Your Pattern Projects
          </h2>
          {patterns.length === 0 ? (
            <p className="text-gray-600">
              No patterns created yet. Start by adding one!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patterns.map((pattern) => (
                <div
                  key={pattern._id}
                  className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500"
                >
                  <h3 className="text-lg font-bold text-purple-600">
                    {pattern.title}
                  </h3>
                  <p className="text-gray-700">{pattern.description}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Category: {pattern.category}</p>
                    <p>Skill: {pattern.skillLevel}</p>
                    <p>
                      Status: {pattern.applicants.length}/{pattern.positions}{" "}
                      testers
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/chat/${pattern._id}/${
                        pattern.applicants[0] || user._id
                      }`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Chat
                    </Link>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatorDashboard;
