import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contact from "../components/Contact";
import MessageContainer from "../components/MessageContainer";
import axios from "axios";
import "../css/Chat.css";
import { getUserApi, getUsersApi } from "../api/ApiRoutes";
import { BiUser, BiHomeAlt } from "react-icons/bi";

const Chat = ({ socket }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [otherUser, setOtherUser] = useState({});
  const [users, setUsers] = useState([]);
  const [toggleContact, setToggleContact] = useState(false);
  const [view, setView] = useState(false);
  const [otherUserBool, setOtherUserBool] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function auth() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        try {
          const res = await axios.get(
            `${getUserApi}/${await JSON.parse(
              localStorage.getItem("chat-app-user")
            )._id}`
          );
          if (!res.data.online) {
            localStorage.clear();
            navigate("/login");
          }
        } catch (err) {
          return err;
        }
      }
    }
    auth();
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`${getUsersApi}/${currentUser && currentUser._id}`)
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        if (err.message === "Network Error") {
          localStorage.clear();
          navigate("/login");
        }
        return err;
      });
  }, [currentUser, navigate]);

  useEffect(() => {
    async function auth() {
      try {
        const res = await axios.get(
          `${getUserApi}/${currentUser && currentUser._id}`
        );
        if (!res.data.online) {
          localStorage.clear();
          navigate("/login");
        }
      } catch (err) {
        return err;
      }
    }
    auth();
  }, [navigate, currentUser]);

  useEffect(() => {
    socket.on("user-online", (status) => {
      axios
        .get(`${getUsersApi}/${currentUser && currentUser._id}`)
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((err) => {
          return err;
        });
    });
  }, [socket, currentUser]);

  useEffect(() => {
    socket.on("user-left", (status) => {
      axios
        .get(`${getUsersApi}/${currentUser && currentUser._id}`)
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((err) => {
          return err;
        });
    });
  }, [socket, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser) {
      socket.emit("recieve-user", currentUser._id);
    }
  }, [currentUser, socket]);

  return (
    <div className="c-container">
      <div className="chat-container">
        <Contact
          currentUser={currentUser && currentUser}
          setOtherUser={setOtherUser}
          otherUser={otherUser}
          users={users}
          setUsers={setUsers}
          toggleContact={toggleContact}
          otherUserBool={otherUserBool}
          setOtherUserBool={setOtherUserBool}
        />
        <MessageContainer
          currentUser={currentUser && currentUser}
          otherUser={otherUser}
          socket={socket && socket}
          toggleContact={toggleContact}
          setOtherUserBool={setOtherUserBool}
          setToggleContact={setToggleContact}
          setView={setView}
        />
        <div
          className={`footer ${
            otherUserBool ? "display-footer" : "show-footer"
          }`}
        >
          <div
            className={`icon ${view && "select"} ${
              !otherUserBool && "show-footer"
            } `}
            onClick={() => {
              setToggleContact(true);
              setView(true);
            }}
          >
            <BiUser />
          </div>
          <div
            className={`icon ${!view && "select"}`}
            onClick={() => {
              setToggleContact(false);
              setView(false);
              if (otherUser._id) {
                setOtherUserBool(true);
              } else {
                setOtherUserBool(false);
              }
            }}
          >
            <BiHomeAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
