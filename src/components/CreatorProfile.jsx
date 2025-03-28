import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CreatorProfile({ user }) {
  const [profile, setProfile] = useState({ email: "", bio: "", contact: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/creator/profile?creatorId=${user.id}`
      );
      setProfile(response.data);
    };
    fetchProfile();
  }, [user.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/creator/profile",
        {
          creatorId: user.id,
          bio: profile.bio,
          contact: profile.contact,
        }
      );
      if (response.data.success) {
        setProfile(response.data.user);
        alert("Profile updated!");
      }
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Creator Profile</h1>
        <Link to="/creator" className="text-blue-500 hover:underline">
          Back to Dashboard
        </Link>
      </div>
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact</label>
          <input
            type="text"
            value={profile.contact}
            onChange={(e) =>
              setProfile({ ...profile, contact: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default CreatorProfile;
