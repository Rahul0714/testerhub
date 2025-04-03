import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ChatPage() {
  const { userId, otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/chat/${userId}/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data);
    };
    fetchChats();
  }, [userId, otherUserId]);

  const handleSend = async () => {
    const formData = new FormData();
    formData.append("sender", userId);
    formData.append("receiver", otherUserId);
    formData.append("message", message);
    if (file) formData.append("file", file);

    const token = localStorage.getItem("token");
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
    setFile(null);
  };

  const handleDelete = async (chatId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/chat/delete/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(messages.filter((m) => m._id !== chatId));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Chat with {messages[0]?.receiver.username || "User"}
      </h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="h-64 overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg._id} className="mb-2 flex justify-between">
              <div>
                <p>
                  <strong>{msg.sender.username}:</strong> {msg.message}
                </p>
                {msg.fileUrl && (
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    className="text-blue-500"
                  >
                    View PDF
                  </a>
                )}
              </div>
              {msg.sender._id === userId && (
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full p-2 mb-2 border"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
