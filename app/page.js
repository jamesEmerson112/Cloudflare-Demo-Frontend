"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    // Add user's message to the chat
    setMessages((prev) => [...prev, { sender: "User", text: message }]);

    try {
      const response = await fetch("http://127.0.0.1:5000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const responseMessage = data.response;

      // Add backend's response message to the chat
      setMessages((prev) => [...prev, { sender: "Bot", text: responseMessage }]);

    } catch (error) {
      console.error("Error fetching emoji:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "😕 Something went wrong!" },
      ]);
    }

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Chat Room</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
        <div className="h-64 overflow-y-scroll mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.sender === "User" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-4 py-2 rounded ${
                  msg.sender === "User"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
