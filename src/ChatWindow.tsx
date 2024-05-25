import React, { useState } from "react";
import "./ChatWindow.css";
import { Message } from "./types";

const ChatBubble = ({
  message,
  index,
}: {
  message: Message;
  index: number;
}) => (
  <div key={index} className={`message ${message.isOwn ? "own-message" : ""}`}>
    <strong>{message.username}:</strong> {message.text}
  </div>
);

function ChatWindow({
  roomId: room,
  messages,
  onSendMessage,
}: {
  roomId: string;
  messages: Message[];
  onSendMessage: (room: string, text: string) => void;
}) {
  const [message, setMessage] = useState(""); // State to track the message input

  // Handle sending a message
  const handleSend = () => {
    if (message.trim()) {
      // Check if the message is not empty
      onSendMessage(room, message); // Send the message
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.map((msg, index) => ChatBubble({ message: msg, index }))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()} // Send the message on Enter key press
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
