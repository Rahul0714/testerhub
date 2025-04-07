import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CreatorApplicants({ user }) {
  const { patternId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [project, setProject] = useState(null);
  const [selectedTesters, setSelectedTesters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Pattern ID:", patternId);

    const fetchData = async () => {
      if (!user || user.role !== "creator") {
        navigate("/");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        console.log("Fetching patterns...");
        const projectResponse = await axios.get(
          `http://localhost:5000/api/pattern/created/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Project response:", projectResponse.data);
        const foundProject = projectResponse.data.find(
          (p) => p._id === patternId
        );
        if (!foundProject) throw new Error("Project not found");
        console.log("Found project:", foundProject);
        setProject(foundProject);

        // Filter out already selected testers from applicants
        const availableApplicants = foundProject.applicants.filter(
          (applicant) =>
            !foundProject.selectedTesters.some(
              (testerId) => testerId.toString() === applicant._id.toString()
            )
        );
        setApplicants(availableApplicants);
        console.log("Available applicants:", availableApplicants);

        // Optionally, initialize selectedTesters with already approved testers
        setSelectedTesters(foundProject.selectedTesters || []);
      } catch (error) {
        console.error("Error fetching data:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        alert("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, patternId, navigate]);

  const handleSelectTester = (testerId) => {
    setSelectedTesters((prev) =>
      prev.includes(testerId)
        ? prev.filter((id) => id !== testerId)
        : [...prev, testerId]
    );
  };

  const handleApproveTesters = async () => {
    if (selectedTesters.length === 0) {
      alert("Please select at least one tester.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/pattern/creator/patterns/${patternId}/select-testers`,
        { selectedTesters },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Selected ${selectedTesters.length} tester(s) successfully!`);

      // Refetch the project to update the UI with the new selectedTesters
      const projectResponse = await axios.get(
        `http://localhost:5000/api/pattern/created/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedProject = projectResponse.data.find(
        (p) => p._id === patternId
      );
      setProject(updatedProject);
      const availableApplicants = updatedProject.applicants.filter(
        (applicant) =>
          !updatedProject.selectedTesters.some(
            (testerId) => testerId.toString() === applicant._id.toString()
          )
      );
      setApplicants(availableApplicants);
      setSelectedTesters(updatedProject.selectedTesters || []);

      navigate("/creator");
    } catch (error) {
      console.error("Error approving testers:", error.response?.data || error);
      alert(
        "Failed to approve testers: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">
              Applicants for {project?.title || "Project"}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Select testers for your project ({selectedTesters.length} chosen)
            </p>
          </div>
          <Link
            to="/creator"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applicants...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">
              No testers have applied to this project yet.
            </p>
            <Link
              to="/creator"
              className="mt-4 inline-block text-blue-600 hover:underline font-medium"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-700">
                Available Applicants
              </h2>
              <span className="text-sm text-gray-500">
                {applicants.length} applicant
                {applicants.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {applicants.map((applicant) => {
                const isAlreadySelected = project?.selectedTesters?.some(
                  (testerId) => testerId.toString() === applicant._id.toString()
                );
                return (
                  <div
                    key={applicant._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-blue-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                        {applicant.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {applicant.username || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Skill:</span>{" "}
                          {project?.skillLevel || "N/A"} |{" "}
                          <span className="font-medium">Points:</span> N/A
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTesters.includes(applicant._id)}
                        onChange={() => handleSelectTester(applicant._id)}
                        disabled={isAlreadySelected} // Disable if already selected
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">
                        {isAlreadySelected
                          ? "Already Approved"
                          : selectedTesters.includes(applicant._id)
                          ? "Selected"
                          : "Select"}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {selectedTesters.length}/{project?.positions || 0} testers
                selected
              </p>
              <button
                onClick={handleApproveTesters}
                disabled={selectedTesters.length === 0}
                className={`px-6 py-2 rounded-full text-white font-medium transition-colors ${
                  selectedTesters.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Approve Selected Testers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatorApplicants;
