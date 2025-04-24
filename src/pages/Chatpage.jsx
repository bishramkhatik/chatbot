import React, { useState, useEffect } from "react";
import "../style/ChatPage.css";
import AuthModal from "../component/AuthModal";
import Topnav from "../component/Topnav";
import FlashMessage from "../component/FlashMessage";
import { sendMessageToGPT, saveChatToDB } from "../services/chatService";
import { useAuth } from "../context/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => setFlash(""), 2500); // hide flash after 2.5s
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setShowWelcome(false);
    setIsLoading(true);

    try {
      const botReply = await sendMessageToGPT(input);
      const updatedMessages = [...newMessages, { sender: "bot", text: botReply }];
      setMessages(updatedMessages);

      if (user?._id) {
        await saveChatToDB(updatedMessages, user._id);
        console.log("✅ Chat saved to DB!");
      } else {
        setFlash("⚠️ You're not logged in. Your chat won’t be saved.");
        // Pop login after short delay
        setTimeout(() => setShowAuth(true), 2500);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <Topnav
        onLoginClick={() => {
          setAuthType("login");
          setShowAuth(true);
        }}
        onSignupClick={() => {
          setAuthType("signup");
          setShowAuth(true);
        }}
      />

      {/* 🔥 Red flash message */}
      <FlashMessage message={flash} type="error" />

      {showWelcome && (
        <div className="chat-welcome">
          <img
            src="/B.k.jpg"
            alt="Bot"
            className="chat-avatar"
          />
          <h2>What can I assist you with?</h2>
        </div>
      )}

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Typing...</div>}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <i className="fas fa-paper-plane"></i> send
        </button>
      </div>

      {showAuth && (
        <AuthModal authType={authType} onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
};

export default ChatPage;
