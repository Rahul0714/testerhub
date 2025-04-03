import { useState, useEffect } from "react";
import axios from "axios";

function Chat({ userId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get(`http://localhost:5000/api/chat/${userId}`);
      setMessages(res.data);
    };
    fetchChats();
  }, [userId]);

  const handleSend = async () => {
    const formData = new FormData();
    formData.append("sender", userId);
    formData.append("receiver", receiverId);
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
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg._id} className="mb-2">
            <p>
              {msg.sender.username}: {msg.message}
            </p>
            {msg.fileUrl && (
              <a href={msg.fileUrl} target="_blank" className="text-blue-500">
                View PDF
              </a>
            )}
            <button
              onClick={() => handleDelete(msg._id)}
              className="text-red-500 ml-2"
            >
              Delete
            </button>
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
  );
}

export default Chat;
