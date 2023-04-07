// eslint-disable

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/SetAvatar.css";
import Loader from "../assets/loader.gif";
import { setAvatarApi } from "../api/ApiRoutes";
import { useNavigate } from "react-router-dom";
// import { Buffer } from "buffer";

const SetAvatar = () => {
  // const api = "https://api.multiavatar.com/4645646";

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

  // useEffect(() => {
  //   async function auth() {
  //     fetch(`${api}/${JSON.stringify(Math.round(Math.random * 1000))}`)
  //       .then((res) => res.text())
  //       .then((svg) => console.log(svg))
  //       .catch((err) => console.log(err, "errorrororo"));
  //     const data = [];
  //     try {
  //       let config = {
  //         headers: {
  //           "Access-Control-Allow-Origin": "*",
  //           "Access-Control-Allow-Credentials": "true",
  //           "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  //           "Access-Control-Allow-Headers":
  //             "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, if-Modified-Since, X-File-Name, Cache-Control",
  //         },
  //       };
  //       for (let i = 0; i < 4; i++) {
  //         const image = await axios.get(`${api}`, config);

  //         const buffer = Buffer.from(image.data);
  //         data.push(buffer.toString("base64"));
  //       }
  //       setAvatars(data);
  //       setIsLoading(false);
  //     } catch (err) {
  //       return err;
  //     }
  //   }
  //   auth();
  // }, [api]);

  // useEffect(() => {
  //   async function auth() {
  //     const data = [];
  //     try {
  //       let config = {
  //         headers: {
  //           "Access-Control-Allow-Origin": "*",
  //           "Access-Control-Allow-Credentials": "true",
  //           "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  //           "Access-Control-Allow-Headers":
  //             "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, if-Modified-Since, X-File-Name, Cache-Control",
  //         },
  //       };
  //       for (let i = 0; i < 4; i++) {
  //         const image = await axios.get(
  //           `${api}/${Math.round(Math.random() * 1000)}`,
  //           config
  //         );
  //         const buffer = Buffer.from(image.data);
  //         data.push(buffer.toString("base64"));
  //       }
  //       setAvatars(data);
  //       setIsLoading(false);
  //     } catch (err) {
  //       return err;
  //     }
  //   }
  //   auth();
  // }, [api]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = [];
  //     let config = {
  //       headers: {
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Credentials": "true",
  //         "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  //         "Access-Control-Allow-Headers":
  //           "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, if-Modified-Since, X-File-Name, Cache-Control",
  //       },
  //     };
  //     for (let i = 0; i < 20; i++) {
  //       const instance = axios.create({
  //         baseURL: `${api}/${Math.round(Math.random() * 1000)}`,
  //         headers: {
  //           "Access-Control-Allow-Origin": "*",
  //           "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
  //           "Access-Control-Allow-Headers":
  //             "Origin, Content-Type, X-Requested-WIth, Accept",
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const image = await instance.get("/");
  //       const buffer = Buffer.from(image.data);
  //       // const buffer = new Buffer(image.data);
  //       data.push(buffer.toString("base64"));
  //       console.log(image);
  //     }
  //     setAvatars(data);
  //     console.log(data);
  //     setIsLoading(false);
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const data = [];
      for (let i = 1; i <= 4; i++) {
        let randomNumber = Math.floor(Math.random() * 20) + 1;
        if (!data.includes(randomNumber)) {
          data.push(randomNumber);
        }
      }
      setAvatars(data);
      setIsLoading(false);
    }, Math.floor(Math.random() * 5000) + 1000);
    return () => clearTimeout(timeout);
  }, []);

  // useEffect(() => {
  //   async function fetchImageData() {
  //     const data = [];
  //     for (let i = 0; i < 4; i++) {
  //       fetch(`${api}/${Math.round(Math.random() * 1000)}`)
  //         .then((res) => res.arrayBuffer())
  //         .then((buffer) => {
  //           const imageData = Buffer.from(buffer);
  //           data.push(imageData.toString("base64"));
  //           console.log(data);
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //     setAvatars(data);
  //     setIsLoading(false);
  //   }
  //   fetchImageData();
  // }, []);

  const submitAvatar = () => {
    if (!selectedAvatar) {
      toast.error("Please pick an avatar", toastOptions);
      return false;
    } else
      axios
        .post(`${setAvatarApi}/${currentUser._id}`, {
          avatarImage: selectedAvatar,
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
                    // src={`data:image/svg+xml;base64,${avr}`}
                    src={`/avatars/Multiavatar-User${avatars[index]}.png`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(avatars[index])}
                    className={`${
                      selectedAvatar === avatars[index] && "selected"
                    }`}
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
