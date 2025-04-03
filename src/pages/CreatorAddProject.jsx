import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CreatorAddProject({ user }) {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    category: "",
    description: "",
    skillLevel: "",
    completionTime: "",
    positions: "",
    compensation: "",
    pdf: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("category", project.category);
    formData.append("description", project.description);
    formData.append("skillLevel", project.skillLevel);
    formData.append("completionTime", project.completionTime);
    formData.append("positions", project.positions);
    formData.append("compensation", project.compensation);
    if (project.pdf) formData.append("pdf", project.pdf);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/pattern/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Pattern added successfully!");
      navigate("/creator");
    } catch (error) {
      alert("Failed to add pattern");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Pattern</h1>
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
            <option value="apparel">Apparel</option>
            <option value="home-decor">Home Decor</option>
            <option value="accessories">Accessories</option>
            <option value="baby-kids">Baby/Kids</option>
            <option value="pet-items">Pet Items</option>
            <option value="holiday-seasonal">Holiday/Seasonal</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
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
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Completion Time</label>
          <select
            value={project.completionTime}
            onChange={(e) =>
              setProject({ ...project, completionTime: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Completion Time</option>
            <option value="less than 1 week">Less than 1 week</option>
            <option value="1-2 months">1-2 months</option>
            <option value="2-4 months">2-4 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Testers Needed</label>
          <input
            type="number"
            value={project.positions}
            onChange={(e) =>
              setProject({ ...project, positions: e.target.value })
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
        <div className="mb-4">
          <label className="block text-gray-700">Pattern PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setProject({ ...project, pdf: e.target.files[0] })}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Pattern
        </button>
      </form>
    </div>
  );
}

export default CreatorAddProject;
