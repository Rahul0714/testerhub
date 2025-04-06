import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function TesterProfile({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appliedTestings, setAppliedTestings] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      console.log(user);
      const appliedRes = await axios.get(
        `http://localhost:5000/api/pattern/applied/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppliedTestings(appliedRes.data);
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  const rank =
    profile.rewardPoints < 50
      ? "Newbie"
      : profile.rewardPoints < 100
      ? "Proficient"
      : profile.rewardPoints < 200
      ? "Advanced"
      : profile.rewardPoints < 300
      ? "Expert"
      : profile.rewardPoints < 500
      ? "Elite"
      : "Master";

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center border-b-2">
        <div className=" flex flex-col md:flex-row items-center md:items-start mb-6">
          <img
            src={
              profile.profilePhoto ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                profile.username
            }
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 md:mr-6 md:mb-0"
          />
          <div>
            <h2 className="text-2xl font-semibold">{profile.username}</h2>
            <p className="text-gray-600">{profile.bio}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <span className="font-medium">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-medium">Skill Level:</span>{" "}
                {profile.skillLevel}
              </p>
              <p>
                <span className="font-medium">Reward Points:</span>{" "}
                {profile.rewardPoints}
              </p>
              <p>
                <span className="font-medium">Rank:</span> {rank}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            navigate(user.role === "creator" ? "/creator" : "/tester")
          }
          className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors h-1/2"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Applied Testings</h3>
        {appliedTestings.length === 0 ? (
          <p className="text-gray-600">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {appliedTestings.map((testing) => (
              <div key={testing._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <span className="font-medium">Project:</span>{" "}
                      {testing.title}
                    </p>
                    <p>
                      <span className="font-medium">Creator:</span>{" "}
                      {testing.creator.username}
                    </p>
                    <p>
                      <span className="font-medium">Applied:</span>{" "}
                      {new Date(testing.postedDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Due:</span>{" "}
                      {testing.completionTime}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      testing.applicants.includes(id)
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {testing.applicants.includes(id) ? "Pending" : "Accepted"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TesterProfile;
