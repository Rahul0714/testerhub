import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreatorProfile({ user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [createdPatterns, setCreatedPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const profileRes = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(profileRes.data);

        const patternsRes = await axios.get(
          `http://localhost:5000/api/pattern/created/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched patterns:", patternsRes.data);
        setCreatedPatterns(patternsRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!profile)
    return (
      <div className="text-center text-gray-600">Error loading profile</div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start mb-6 md:mb-0">
              <img
                src={
                  profile.profilePhoto ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 md:mr-6 md:mb-0 border-2 border-blue-200"
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {profile.username}
                </h2>
                <p className="text-gray-600 italic mt-1">
                  {profile.bio || "No bio available"}
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p className="text-gray-700">
                    <span className="font-medium text-blue-600">Email:</span>{" "}
                    {profile.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-blue-600">Contact:</span>{" "}
                    {profile.contactNumber || "Not set"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-blue-600">
                      Patterns Created:
                    </span>{" "}
                    {createdPatterns.length}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/creator")}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center"
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
            </button>
          </div>

          {/* Created Patterns Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Created Patterns
            </h3>
            {createdPatterns.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No patterns created yet. Start by adding one!
              </p>
            ) : (
              <div className="space-y-4">
                {createdPatterns.map((pattern) => (
                  <div
                    key={pattern._id}
                    className="border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-800">
                          <span className="font-medium text-blue-600">
                            Title:
                          </span>{" "}
                          {pattern.title}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-blue-600">
                            Skill Level:
                          </span>{" "}
                          {pattern.skillLevel || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-blue-600">
                            Created:
                          </span>{" "}
                          {new Date(
                            pattern.postedDate || Date.now()
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-blue-600">
                            Applicants:
                          </span>{" "}
                          {pattern.applicants?.length || 0}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          pattern.selectedTesters?.length > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {pattern.selectedTesters?.length > 0
                          ? "Active"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorProfile;
