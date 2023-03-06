import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/SetAvatar.css";
import Loader from "../assets/loader.gif";
import { setAvatarApi } from "../api/ApiRoutes";
import { useNavigate } from "react-router-dom";
import { Buffer } from "Buffer";

const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678945";

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  const navigate = useNavigate();

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    async function auth() {
      if (!(await JSON.parse(localStorage.getItem("chat-app-user")))) {
        navigate("/login");
      }
      setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
    }
    auth();
  }, [navigate]);

  useEffect(() => {
    async function auth() {
      const data = [];
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
            "Access-Control-Allow-Headers":
              "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, if-Modified-Since, X-File-Name, Cache-Control",
          },
        };
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`,
            config
          );
          const buffer = Buffer.from(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (err) {
        return err;
      }
    }
    auth();
  }, [api]);

  const submitAvatar = () => {
    if (!selectedAvatar) {
      toast.error("Please pick an avatar", toastOptions);
      return false;
    } else
      axios
        .post(`${setAvatarApi}/${currentUser._id}`, {
          avatarImage: avatars[selectedAvatar],
        })
        .then((res) => {
          if (!res.data.status) {
            toast.error(res.data.msg, toastOptions);
            return false;
          }
          localStorage.setItem("chat-app-user", JSON.stringify(res.data.user));
          navigate("/");
          return;
        })
        .catch((err) => {
          toast.error("Server error", toastOptions);
        });
  };

  return (
    <div className="container">
      {isLoading ? (
        <img src={Loader} alt="" className="img-loader" />
      ) : (
        <>
          <h2>Pick an avatar as your profile picture</h2>

          <div className="img-container">
            {avatars &&
              avatars.map((avr, index) => (
                <div className="img" key={index}>
                  <img
                    src={`data:image/svg+xml;base64,${avr}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                    className={`${selectedAvatar === index && "selected"}`}
                  />
                </div>
              ))}
          </div>

          <button className="submit-btn" onClick={submitAvatar}>
            Set as a profile picture
          </button>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default SetAvatar;
