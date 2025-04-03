import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPopup({ onClose, onSignup, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
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
        <h2 className="text-xl mb-4">Login</h2>
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
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Login
        </button>
        <p className="mt-2">
          New here?{" "}
          <span onClick={onSignup} className="text-blue-500 cursor-pointer">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPopup;
