import React, { useEffect, useRef, useState } from "react";
import Robot from "../assets/robot.gif";
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { addMessageApi, getMessageApi } from "../api/ApiRoutes";
import { timeFormat } from "../utils/timeConversion";
import Picker from "emoji-picker-react";

const MessageContainer = ({
  currentUser,
  otherUser,
  socket,
  toggleContact,
  setView,
  setOtherUserBool,
  setToggleContact,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef();

  useEffect(() => {
    setMessage("");
  }, [otherUser]);

  useEffect(() => {
    if (currentUser && otherUser)
      axios
        .post(getMessageApi, {
          from: currentUser._id,
          to: otherUser._id,
        })
        .then((res) => {
          setMessages(res.data.messages);
        })
        .catch((err) => {
          return err;
        });
  }, [currentUser, otherUser]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (e, emoji) => {
    let msg = message;
    msg += emoji.emoji;
    setMessage(msg);
  };

  const logout = () => {
    localStorage.clear();
    socket.emit("leave-chat", currentUser._id);
    navigate("/login");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message) {
      axios
        .post(addMessageApi, {
          from: currentUser._id,
          to: otherUser._id,
          message,
        })
        .then((res) => {
          setMessage("");

          socket.emit("send-msg", {
            to: otherUser._id,
            from: currentUser._id,
            message,
          });

          const msg = [...messages];
          msg.push({ fromSelf: true, message, time: res.data.time });

          setMessages([...msg]);
        })
        .catch((err) => {
          return err;
        });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("recieve-msg", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg.message,
          time: msg.time,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    messages &&
      scrollRef.current?.scrollIntoView({
        behaviour: "smooth",
      });
    if (messages) {
      const scrollingElement = document.querySelector(".chat-box");
      if (scrollingElement)
        scrollingElement.scrollTop = scrollingElement?.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-container">
      {!otherUser.username ? (
        <>
          <div className="welcome-message">
            <div className="robot-img">
              <img src={Robot} alt="welcome" />
            </div>
            <p className="welcome">
              Welcome, <span> {currentUser && currentUser.username}</span>
            </p>
            <p>Please select a chat to start messaging</p>
          </div>

          <div
            className={`welcome-resp-message ${
              toggleContact && "display-wlc-message"
            } `}
          >
            <div className="welcome-content">
              <div className="robot-img">
                <img src={Robot} alt="welcome" />
              </div>
              <p className="welcome">
                Welcome, <span> {currentUser && currentUser.username}</span>
              </p>
              <p>Please select a chat to start messaging</p>
            </div>
            <div className="footer"></div>
          </div>
        </>
      ) : (
        <div className="chat-content">
          <div
            className="back"
            onClick={() => {
              setOtherUserBool(false);
              setToggleContact(true);
              setView(true);
            }}
          >
            <FaArrowLeft />
            <p>back</p>
          </div>
          <div className="chat-header">
            <div className="logo">
              <img
                // src={`data:image/svg+xml;base64,${otherUser.avatarImage}`}
                    src={`/avatars/Multiavatar-User${otherUser.avatarImage}.png`}
                alt="avatar"
              />
              <p>{otherUser.username}</p>
            </div>
            <button className="logout" onClick={logout}>
              <BiPowerOff />
            </button>
          </div>
          <div className="message-box">
            <div className="chat-box">
              {messages &&
                messages.map((msg, index) => (
                  <div
                    className={`message ${!msg.fromSelf && "sender"}`}
                    key={index}
                  >
                    <div className="cover">
                      <p>{msg.message}</p>
                      <div className="time">{timeFormat(msg.time)}</div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="chat-input">
              <form onSubmit={handleSendMessage}>
                <div className="smile">
                  <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                  {showEmojiPicker && (
                    <Picker onEmojiClick={handleEmojiClick} />
                  )}
                </div>
                <div className="input">
                  <input
                    type="text"
                    placeholder="Enter message"
                    name="message"
                    value={message}
                    autoComplete="off"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {message ? (
                    <button type="submit">
                      <IoMdSend />
                    </button>
                  ) : (
                    <button type="submit" disabled className="disable">
                      <IoMdSend />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
