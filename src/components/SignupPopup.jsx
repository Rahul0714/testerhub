import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupPopup({ onClose, setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tester");
  const [bio, setBio] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const payload = { username, email, password, role, bio };
      if (role === "creator") payload.contactNumber = contactNumber;
      if (role === "tester") payload.skillLevel = skillLevel;

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        payload
      );
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id); // Store userId
      onClose();
      navigate(res.data.redirect);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl mb-4">Sign Up</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 mb-4 border"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 border"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border"
        >
          <option value="tester">Tester</option>
          <option value="creator">Creator</option>
        </select>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full p-2 mb-4 border"
        />
        {role === "creator" && (
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Contact Number"
            className="w-full p-2 mb-4 border"
          />
        )}
        {role === "tester" && (
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full p-2 mb-4 border"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        )}
        <button
          onClick={handleSignup}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignupPopup;
