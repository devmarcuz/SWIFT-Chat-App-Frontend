import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import { io } from "socket.io-client";
import { host } from "./api/ApiRoutes";

function App() {
  const socket = io(host);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" exact element={<Login socket={socket} />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/" exact element={<Chat socket={socket} />} />
          <Route path="/set-avatar" exact element={<SetAvatar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
