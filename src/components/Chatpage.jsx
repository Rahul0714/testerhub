import { useState, useEffect, useRef } from "react";

const ChatPage = ({ pattern, user, onSubmit, onBack }) => {
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: pattern.creator,
      text: `Hello! Thanks for applying to test my ${pattern.title} pattern. Please send any questions or your application materials here.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const chatEndRef = useRef(null); // For auto-scrolling to latest message

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatHistory.length === 1) {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: pattern.creator,
            text: "Looking forward to your response!",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [chatHistory, pattern.creator]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message && !uploadedFile) {
      alert("Please enter a message or upload a file.");
      return;
    }

    const newMessage = {
      sender: user?.name || "Guest",
      text: message,
      timestamp: new Date().toISOString(),
      file: uploadedFile ? uploadedFile.name : null,
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage("");
    if (uploadedFile) {
      onSubmit(pattern.id, { message, file: uploadedFile });
      setUploadedFile(null);
    }
  };

  const removeFile = () => setUploadedFile(null);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{pattern.title}</h2>
            <p className="text-sm">Chat with {pattern.creator}</p>
          </div>
          <button
            onClick={onBack}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Back to Patterns
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 container mx-auto">
        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === (user?.name || "Guest")
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
                  msg.sender === (user?.name || "Guest")
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="text-sm font-medium">{msg.sender}</p>
                <p className="mt-1">{msg.text}</p>
                {msg.file && (
                  <p className="mt-1 text-xs italic">
                    Attached:{" "}
                    <span className="underline cursor-pointer">{msg.file}</span>
                  </p>
                )}
                <p className="text-xs mt-1 opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
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
              <label
                htmlFor="file-upload"
                className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828V15m-6-9v12m0-12l-6.586 6.586a2 2 0 102.828 2.828L12 9.828V15"
                  />
                </svg>
                <span>Attach PDF</span>
                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {uploadedFile && (
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="truncate max-w-[150px]">
                    {uploadedFile.name}
                  </span>
                  <button
                    onClick={removeFile}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
