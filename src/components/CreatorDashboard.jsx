import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CreatorDashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/creator/projects?creatorId=${user.id}`
      );
      setProjects(response.data);
    };
    fetchProjects();
  }, [user.id]);

  const handleViewApplicants = async (projectId) => {
    const response = await axios.get(
      `http://localhost:5000/api/creator/projects/${projectId}/applicants`
    );
    console.log("Applicants:", response.data); // For now, log to console; later integrate with chat
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <div>
          <Link
            to="/creator/profile"
            className="mr-4 text-blue-500 hover:underline"
          >
            Profile
          </Link>
          <Link
            to="/creator/add-project"
            className="mr-4 text-blue-500 hover:underline"
          >
            Add Project
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <p className="text-lg">Welcome, {user.email}!</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        {projects.map((project) => (
          <div key={project.id} className="mt-2 bg-white p-4 rounded shadow">
            <p>
              <strong>Project:</strong> {project.title}
            </p>
            <p>
              <strong>Testers Needed:</strong> {project.testersNeeded}
            </p>
            <p>
              <strong>Applicants:</strong> {project.applicants}
            </p>
            <Link
              to={`/creator/chat/${project.id}/1`} // Assuming tester ID 1 for demo
              className="mt-2 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => handleViewApplicants(project.id)}
            >
              Chat with Applicants
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreatorDashboard;
