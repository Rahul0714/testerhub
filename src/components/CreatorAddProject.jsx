import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CreatorAddProject({ user }) {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    patternType: "",
    skillLevel: "",
    category: "",
    completionTime: "",
    testersNeeded: "",
    compensation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/creator/projects",
        {
          creatorId: user.id,
          ...project,
        }
      );
      if (response.data.success) {
        alert("Project added successfully!");
        navigate("/creator");
      }
    } catch (error) {
      alert("Failed to add project");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Project</h1>
        <Link to="/creator" className="text-blue-500 hover:underline">
          Back to Dashboard
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Pattern Type</label>
          <input
            type="text"
            value={project.patternType}
            onChange={(e) =>
              setProject({ ...project, patternType: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Skill Level</label>
          <select
            value={project.skillLevel}
            onChange={(e) =>
              setProject({ ...project, skillLevel: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Skill Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            value={project.category}
            onChange={(e) =>
              setProject({ ...project, category: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Apparel">Apparel</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Toys">Toys</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Completion Time</label>
          <input
            type="text"
            value={project.completionTime}
            onChange={(e) =>
              setProject({ ...project, completionTime: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="e.g., 2 months"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Testers Needed</label>
          <input
            type="number"
            value={project.testersNeeded}
            onChange={(e) =>
              setProject({ ...project, testersNeeded: e.target.value })
            }
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Compensation</label>
          <input
            type="text"
            value={project.compensation}
            onChange={(e) =>
              setProject({ ...project, compensation: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="e.g., Free pattern + 10 points"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Add Project
        </button>
      </form>
    </div>
  );
}

export default CreatorAddProject;
