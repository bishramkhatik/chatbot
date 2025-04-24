import React from "react";
import { useAuth } from "../context/AuthContext";
import "../style/top.css";
import "../style/FlashMessage.css"; // ⬅️ Add this new CSS file

const Topnav = ({ onLoginClick, onSignupClick }) => {
  const { user, logout, flash } = useAuth();

  return (
    <>
      <div className="topnav">
        <div className="top-left">
          <img
            src="https://media.istockphoto.com/id/1445426863/vector/chat-bot-vector-logo-design-concept.jpg?s=612x612&w=0&k=20&c=XDdfzS4lNW9yxQ0BQGZq9KMLL4bJ8ywXlYdAhBSuoCA="
            alt="profile"
            className="profile-pic"
          />
          <span className="profile-name">Bishram and Dipesh chatbot</span>
        </div>
        <div className="top-right">
          {user ? (
            <button className="auth-btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <button className="auth-btn" onClick={onLoginClick}>
                Login
              </button>
              <button className="auth-btn" onClick={onSignupClick}>
                Signup
              </button>
            </>
          )}
        </div>
      </div>

      {/* Flash Message */}
      {flash.message && (
        <div className={`flash-message ${flash.type}`}>
          {flash.message}
        </div>
      )}
    </>
  );
};

export default Topnav;
