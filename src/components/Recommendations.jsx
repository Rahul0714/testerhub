import React, { useState } from "react";
import axios from "axios";

const Recommendations = () => {
  const [formData, setFormData] = useState({
    skillLevel: "beginner", // Changed from skill to skillLevel
    category: "Apparel",
  });
  const [recommendations, setRecommendations] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data:", formData); // Debug
    try {
      const response = await axios.post(
        "http://localhost:5000/api/recommendations",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Response:", response.data); // Debug
      setRecommendations(response.data);
    } catch (error) {
      console.error(
        "Error fetching recommendations:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Recommendations
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              Skill Level:
            </label>
            <select
              name="skillLevel" // Changed from skill to skillLevel
              value={formData.skillLevel}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Apparel">Apparel</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Accessories">Accessories</option>
              <option value="Baby/Kids">Baby/Kids</option>
              <option value="Pet Items">Pet Items</option>
              <option value="Holiday/Seasonal">Holiday/Seasonal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Get Recommendations
          </button>
        </form>

        {recommendations && (
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Your Recommendations
            </h2>
            <p className="text-gray-800">
              <strong>Recommended Pattern:</strong>{" "}
              {recommendations.recommendedPattern || "None available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
