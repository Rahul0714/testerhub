import { Link } from "react-router-dom";
import axios from "axios";

const PatternList = ({ patterns, user }) => {
  const handleApply = async (patternId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply");
      return;
    }
    if (user?.role !== "tester") {
      alert("Only testers can apply to patterns");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/pattern/apply/${patternId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
    } catch (err) {
      console.error("Apply error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="space-y-6">
      {patterns.map((pattern) => {
        const hasApplied = pattern.applicants.includes(user?._id);
        return (
          <div
            key={pattern._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{pattern.title}</h2>
                <p className="text-gray-600">{pattern.description}</p>
                <p className="text-gray-500 text-sm">
                  by {pattern.creator.username}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {pattern.skillLevel}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <p>
                <span className="font-medium">Positions:</span>{" "}
                {pattern.positions}
              </p>
              <p>
                <span className="font-medium">Applicants:</span>{" "}
                {pattern.applicants.length}
              </p>
              <p>
                <span className="font-medium">Compensation:</span>{" "}
                {pattern.compensation}
              </p>
              <p>
                <span className="font-medium">Completion:</span>{" "}
                {pattern.completionTime}
              </p>
              <p>
                <span className="font-medium">Posted:</span>{" "}
                {new Date(pattern.postedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleApply(pattern._id)}
                disabled={hasApplied || user?.role !== "tester"}
                className={`px-4 py-2 rounded transition-colors ${
                  hasApplied || user?.role !== "tester"
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {hasApplied ? "Applied" : "Apply Now"}
              </button>
              {user && (
                <Link
                  to={`/chat/${pattern._id}/${pattern.creator._id}`}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Chat with Creator
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PatternList;
