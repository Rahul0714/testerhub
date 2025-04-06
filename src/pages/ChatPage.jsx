import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatPage = ({ user }) => {
  const { patternId, otherUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // For full-screen image view
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user?._id || !otherUserId) {
      setError("Missing user data. Please log in.");
      return;
    }

    socket.connect();
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${user._id}/${otherUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
        setError("");
      } catch (err) {
        console.error("Fetch chats error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load messages");
      }
    };
    fetchChats();

    socket.on("newMessage", (newMsg) => {
      if (
        (newMsg.sender._id === user._id &&
          newMsg.receiver._id === otherUserId) ||
        (newMsg.sender._id === otherUserId && newMsg.receiver._id === user._id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    const preventDefault = (e) => e.preventDefault();
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("keydown", (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "s" || e.key === "P" || e.key === "S")
      ) {
        e.preventDefault();
      }
      if (e.key === "PrintScreen") {
        e.preventDefault();
        alert("Screenshots are disabled.");
      }
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("keydown", (e) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === "p" || e.key === "s" || e.key === "P" || e.key === "S")
        ) {
          e.preventDefault();
        }
      });
    };
  }, [user?._id, otherUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      console.log("File selected:", file.name, file.size, file.type);
      setUploadedFile(file);
    } else {
      alert("Please upload an image file (PNG, JPEG, or JPG) only.");
      setUploadedFile(null);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !uploadedFile) return;

    console.log("Uploaded file state:", uploadedFile);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("sender", user._id);
    formData.append("receiver", otherUserId);
    formData.append("message", message.trim() || "");
    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    console.log("Sending FormData with fields:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/send",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Server response:", res.data);
      setMessage("");
      setUploadedFile(null);
      fileInputRef.current.value = "";
      setError("");
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const openImagePopup = (fileUrl) => {
    console.log("Opening image popup with URL:", fileUrl);
    setSelectedImage(fileUrl);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      style={{ userSelect: "none" }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Pattern #{patternId}</h2>
            <p className="text-sm opacity-80">Chat with {otherUserId}</p>
          </div>
          <button
            onClick={() =>
              navigate(user.role === "creator" ? "/creator" : "/tester")
            }
            className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition-all shadow-md"
          >
            Back
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 relative">
        <div className="max-w-4xl mx-auto">
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4 text-center">
              {error}
            </p>
          )}
          {messages.length === 0 && !error && (
            <p className="text-gray-500 text-center">Start the conversation!</p>
          )}
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender._id === user._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md p-4 rounded-xl shadow-md ${
                    msg.sender._id === user._id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {msg.sender?.username || "Unknown"}
                  </p>
                  {msg.message && <p className="mt-1">{msg.message}</p>}
                  {msg.fileUrl && (
                    <div className="mt-2">
                      <img
                        src={msg.fileUrl}
                        alt="Uploaded image"
                        className="max-w-full h-auto rounded-md cursor-pointer"
                        onClick={() => openImagePopup(msg.fileUrl)}
                      />
                    </div>
                  )}
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 border-t shadow-lg">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="space-y-3">
            <div className="flex items-end space-x-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
                placeholder="Type a message..."
                rows="2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
              >
                Send
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full transition-all shadow-sm">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4-4m0 0l4 4m-4-4v10m6-6h6m-3-3V4"
                  />
                </svg>
                Upload Image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
              {uploadedFile && (
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                  {uploadedFile.name}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onContextMenu={(e) => e.preventDefault()}
          style={{ userSelect: "none" }}
        >
          <div className="bg-white rounded-lg w-3/4 h-3/4 p-4 relative overflow-hidden">
            <button
              onClick={closeImagePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-20"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Full-screen image"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
