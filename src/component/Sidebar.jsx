import React, { useEffect, useState } from 'react';
import { FaSearch, FaPlus, FaRobot } from 'react-icons/fa';
import { MdHistory, MdExplore } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { fetchChatHistory } from '../services/chatService';
import '../style/sidebar.css';

const Sidebar = () => {
  const [historyItems, setHistoryItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check token and fetch history
  const checkLoginAndFetch = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const history = await fetchChatHistory();
        setHistoryItems(history);
      } catch (err) {
        console.error('❌ Failed to fetch chat history:', err);
      }
    } else {
      setIsLoggedIn(false);
      setHistoryItems({});
    }
  };

  useEffect(() => {
    checkLoginAndFetch();

    // Listen for login/logout changes in localStorage
    const handleStorageChange = () => {
      checkLoginAndFetch();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="top-icons">
        <FaSearch className="icon" />
        <FaPlus className="icon" />
      </div>

      <div className="ai-tools">
        <h2>AI Tools</h2>
        <ul>
          <li><Link to="/text-generator"><FaRobot className="icon" /> Text Generator</Link></li>
          <li><Link to="/image-generator"><FaRobot className="icon" /> Image Generator</Link></li>
          <li><Link to="/code-helper"><FaRobot className="icon" /> Code Helper</Link></li>
        </ul>
        <Link to="/explore">
          <button className="explore-btn"><MdExplore className="icon" /> Explore More AI</button>
        </Link>
      </div>

      <div className="history">
        <h2><MdHistory className="icon" /> History</h2>
        {isLoggedIn ? (
          <div className="history-items">
            {Object.entries(historyItems).map(([date, items], i) => (
              <div key={i} className="history-group">
                <p className="history-date">{date}</p>
                <ul>
                  {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="history-placeholder">Login to view your chat history.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
