import Sidebar from "./component/Sidebar";
import Topnav from "./component/Topnav";
import ChatPage from "./pages/Chatpage";
import "./App.css";
import AuthModal from "./component/AuthModal";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Topnav/>
      <ChatPage/>
    </div>
  );
}

export default App;
