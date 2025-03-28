import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function CreatorChat({ user }) {
  const { projectId, testerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchChat = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/creator/chat/${projectId}/${testerId}`
      );
      setMessages(response.data.messages);
    };
    fetchChat();
  }, [projectId, testerId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const response = await axios.post(
      `http://localhost:5000/api/creator/chat/${projectId}/${testerId}`,
      {
        sender: "creator",
        text: newMessage,
      }
    );
    if (response.data.success) {
      setMessages(response.data.chat.messages);
      setNewMessage("");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chat for Project #{projectId}</h1>
        <Link to="/creator" className="text-blue-500 hover:underline">
          Back to Dashboard
        </Link>
      </div>
      <div className="bg-white p-4 rounded shadow h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === "creator" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block p-2 rounded ${
                msg.sender === "creator" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {msg.text}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default CreatorChat;
