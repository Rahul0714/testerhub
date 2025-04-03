import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ChatPage = ({ user }) => {
  const { patternId, otherUserId } = useParams(); // patternId and otherUserId from route
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(""); // Added to display errors
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user?._id || !otherUserId) {
        setError("Missing user data or token. Please log in again.");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${user._id}/${otherUserId}`, // Changed user.id to user._id
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
        setError(""); // Clear error on success
      } catch (err) {
        console.error("Fetch chats error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load chat messages");
      }
    };
    fetchChats();
  }, [user?._id, otherUserId]); // Changed user.id to user._id

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message && !uploadedFile) return;

    const formData = new FormData();
    formData.append("sender", user._id); // Changed user.id to user._id
    formData.append("receiver", otherUserId);
    formData.append("message", message);
    if (uploadedFile) formData.append("file", uploadedFile);

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/send",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessages([...messages, res.data]);
      setMessage("");
      setUploadedFile(null);
      setError(""); // Clear error on success
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const handleDelete = async (chatId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/chat/delete/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((m) => m._id !== chatId));
      setError(""); // Clear error on success
    } catch (err) {
      console.error("Delete message error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              Chat for Pattern #{patternId}
            </h2>
            <p className="text-sm">With {otherUserId}</p>{" "}
            {/* Temporary; replace with username later */}
          </div>
          <button
            onClick={() =>
              navigate(user.role === "creator" ? "/creator" : "/tester")
            }
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 container mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
        {/* Display error */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
                  msg.sender._id === user._id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="text-sm font-medium">
                  {msg.sender?.username || "Unknown User"}{" "}
                  {/* Fallback for missing username */}
                </p>
                <p className="mt-1">{msg.message}</p>
                {msg.fileUrl && (
                  <p className="mt-1 text-xs italic">
                    Attached:{" "}
                    <a href={msg.fileUrl} target="_blank" className="underline">
                      {msg.fileUrl.split("/").pop()}
                    </a>
                  </p>
                )}
                <p className="text-xs mt-1 opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
                {msg.sender._id === user._id && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-red-500 mt-1 text-xs hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="bg-white p-4 border-t shadow-md sticky bottom-0">
        <div className="container mx-auto">
          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex items-center space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Type your message..."
                rows="2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
              {uploadedFile && (
                <span className="text-sm text-gray-600">
                  {uploadedFile.name}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
