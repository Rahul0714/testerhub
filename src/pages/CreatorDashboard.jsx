import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Chat from "../components/Chat";

function CreatorDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("apparel");
  const [description, setDescription] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [completionTime, setCompletionTime] = useState("less than 1 week");
  const [positions, setPositions] = useState(1);
  const [pdf, setPdf] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleCreatePattern = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("skillLevel", skillLevel);
    formData.append("completionTime", completionTime);
    formData.append("positions", positions);
    if (pdf) formData.append("pdf", pdf);

    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/pattern/create", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Pattern created successfully!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <Link
          to={`/profile/creator/${userId}`}
          className="text-blue-500 hover:underline"
        >
          View Profile
        </Link>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl mb-4">Create a New Pattern</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Pattern Title"
          className="w-full p-2 mb-4 border"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-4 border"
        >
          <option value="apparel">Apparel</option>
          <option value="home-decor">Home Decor</option>
          <option value="accessories">Accessories</option>
          <option value="baby-kids">Baby/Kids</option>
          <option value="pet-items">Pet Items</option>
          <option value="holiday-seasonal">Holiday/Seasonal</option>
          <option value="other">Other</option>
        </select>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 mb-4 border"
        />
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          className="w-full p-2 mb-4 border"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select
          value={completionTime}
          onChange={(e) => setCompletionTime(e.target.value)}
          className="w-full p-2 mb-4 border"
        >
          <option value="less than 1 week">Less than 1 week</option>
          <option value="1-2 months">1-2 months</option>
          <option value="2-4 months">2-4 months</option>
          <option value="flexible">Flexible</option>
        </select>
        <input
          type="number"
          value={positions}
          onChange={(e) => setPositions(e.target.value)}
          placeholder="Positions"
          className="w-full p-2 mb-4 border"
        />
        <input
          type="file"
          onChange={(e) => setPdf(e.target.files[0])}
          className="mb-4"
        />
        <button
          onClick={handleCreatePattern}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create Pattern
        </button>
      </div>
      <Chat userId={userId} receiverId="testerId" />{" "}
      {/* Replace with dynamic tester ID */}
    </div>
  );
}

export default CreatorDashboard;
