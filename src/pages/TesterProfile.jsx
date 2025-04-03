import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TesterProfile() {
  const { id } = useParams();
  const [tester, setTester] = useState(null);
  const [appliedTestings, setAppliedTestings] = useState([]);

  useEffect(() => {
    const fetchTester = async () => {
      const res = await axios.get(`http://localhost:5000/api/auth/user/${id}`);
      setTester(res.data);
      const appliedRes = await axios.get(
        `http://localhost:5000/api/pattern/applied/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAppliedTestings(appliedRes.data);
    };
    fetchTester();
  }, [id]);

  if (!tester) return <div>Loading...</div>;

  const rank =
    tester.rewardPoints < 50
      ? "Newbie"
      : tester.rewardPoints < 100
      ? "Proficient"
      : tester.rewardPoints < 200
      ? "Advanced"
      : tester.rewardPoints < 300
      ? "Expert"
      : tester.rewardPoints < 500
      ? "Elite"
      : "Master";

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Tester Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img
          src={tester.profilePhoto || "default-photo.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold">{tester.username}</h2>
        <p>
          <strong>Bio:</strong> {tester.bio}
        </p>
        <p>
          <strong>Email:</strong> {tester.email}
        </p>
        <p>
          <strong>Skill Level:</strong> {tester.skillLevel}
        </p>
        <p>
          <strong>Reward Points:</strong> {tester.rewardPoints}
        </p>
        <p>
          <strong>Rank:</strong> {rank}
        </p>
        <h3 className="text-lg font-semibold mt-4">Portfolio</h3>
        <div className="grid grid-cols-3 gap-4">
          {tester.portfolio.map((item, index) => (
            <img
              key={index}
              src={item}
              alt="Portfolio item"
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
        <h3 className="text-lg font-semibold mt-4">Applied Testings</h3>
        <ul className="list-disc pl-5">
          {appliedTestings.map((test) => (
            <li key={test._id}>
              {test.title} by {test.creator.username} - Status:{" "}
              {test.applicants.includes(id) ? "Pending" : "Accepted"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TesterProfile;
