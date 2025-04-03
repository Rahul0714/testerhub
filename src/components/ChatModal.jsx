import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatModal = ({ isOpen, onClose, pattern }) => {
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message && !uploadedFile) return;

    const formData = new FormData();
    formData.append("sender", userId);
    formData.append("receiver", pattern.creator._id);
    formData.append("message", message);
    if (uploadedFile) formData.append("file", uploadedFile);

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/pattern/apply/${pattern._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await axios.post("http://localhost:5000/api/chat/send", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/chat/${userId}/${pattern.creator._id}`);
    } catch (err) {
      console.error(err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Apply for {pattern.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your application message here..."
            rows="3"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload PDF (optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 w-full"
            />
            {uploadedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Uploaded: {uploadedFile.name}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Send Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
