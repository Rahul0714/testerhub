import { useNavigate } from "react-router-dom";
import axios from "axios";

function PatternCard({ pattern }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/pattern/apply/${pattern._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/chat/${userId}/${res.data.creatorId}`);
    } catch (err) {
      console.error(err);
      navigate(`/chat/${userId}/${pattern.creator._id}`); // Fallback
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{pattern.title}</h2>
      <p>
        <strong>Category:</strong> {pattern.category}
      </p>
      <p>
        <strong>Skill Level:</strong> {pattern.skillLevel}
      </p>
      <p>
        <strong>Positions:</strong> {pattern.positions}
      </p>
      <p>
        <strong>Completion Time:</strong> {pattern.completionTime}
      </p>
      <p>
        <strong>Compensation:</strong> {pattern.compensation}
      </p>
      <p>
        <strong>Applicants:</strong> {pattern.applicants.length}
      </p>
      <p>
        <strong>Posted Date:</strong>{" "}
        {new Date(pattern.postedDate).toLocaleDateString()}
      </p>
      <button
        onClick={handleApply}
        className="mt-4 bg-green-500 text-white p-2 rounded"
      >
        Apply Now
      </button>
    </div>
  );
}

export default PatternCard;
