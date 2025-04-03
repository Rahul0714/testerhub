import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CreatorProfile() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    const fetchCreator = async () => {
      const res = await axios.get(`http://localhost:5000/api/auth/user/${id}`);
      setCreator(res.data);
    };
    fetchCreator();
  }, [id]);

  if (!creator) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Creator Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img
          src={creator.profilePhoto || "default-logo.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold">{creator.username}</h2>
        <p>
          <strong>Bio:</strong> {creator.bio}
        </p>
        <p>
          <strong>Email:</strong> {creator.email}
        </p>
        <p>
          <strong>Contact Number:</strong> {creator.contactNumber}
        </p>
        <h3 className="text-lg font-semibold mt-4">Portfolio</h3>
        <div className="grid grid-cols-3 gap-4">
          {creator.portfolio.map((item, index) => (
            <img
              key={index}
              src={item}
              alt="Portfolio item"
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreatorProfile;
