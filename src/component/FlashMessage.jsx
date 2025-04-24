import React from 'react';
import '../style/FlashMessage.css';

const FlashMessage = ({ message, type }) => {
  if (!message) return null;

  const className = `flash-message ${type === "error" ? "error" : ""}`;
  return <div className={className}>{message}</div>;
};

export default FlashMessage;
