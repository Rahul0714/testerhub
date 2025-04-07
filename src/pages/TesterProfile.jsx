import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TesterProfile({ user }) {
  const navigate = useNavigate();
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedPatterns = async () => {
      if (!user || user.role !== "tester") {
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
        const response = await axios.get(
          `http://localhost:5000/api/pattern/applied/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Applied patterns:", response.data);
        setPatterns(response.data);
      } catch (error) {
        console.error("Error fetching applied patterns:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        alert("Failed to load applied patterns");
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedPatterns();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            My Applied Patterns
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            View the status of your pattern applications
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patterns...</p>
          </div>
        ) : patterns.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">
              You haven’t applied to any patterns yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {patterns.map((pattern) => (
              <div
                key={pattern._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {pattern.title}
                    </h2>
                    <p className="text-gray-600">
                      Creator: {pattern.creator.username}
                    </p>
                    <p className="text-gray-600">
                      Skill Level: {pattern.skillLevel} | Positions:{" "}
                      {pattern.positions}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-white font-medium ${
                        pattern.status === "Approved"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {pattern.status}
                    </span>
                    {pattern.status === "Approved" && (
                      <p className="mt-2 text-sm text-gray-600">
                        Congratulations! You’ve been selected.
                      </p>
                    )}
                  </div>
                </div>
                {pattern.status === "Approved" && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Next Steps
                    </h3>
                    <p className="text-gray-600">
                      Download the pattern PDF:{" "}
                      <a
                        href={pattern.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Click here
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TesterProfile;
