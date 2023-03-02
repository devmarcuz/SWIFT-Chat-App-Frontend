import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import isEmpty from "validator/lib/isEmpty";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Register.css";
import axios from "axios";
import { loginUserApi } from "../api/ApiRoutes";
import Loader from "../assets/loader.gif";

const Login = ({ socket }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { username, password } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoading(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (isEmpty(username) || isEmpty(password)) {
      toast.error("All fields are required", toastOptions);
      return false;
    } else {
      setLoading(true);

      axios
        .post(loginUserApi, { username, password })
        .then((res) => {
          if (!res.data.status) {
            toast.error(res.data.msg, toastOptions);
            return false;
          } else {
            localStorage.setItem(
              "chat-app-user",
              JSON.stringify(res.data.user)
            );

            setFormData({
              username: "",
              password: "",
            });

            socket.emit("join-chat", { userId: res.data.user._id });
            setLoading(false);

            if (!res.data.user.isAvatarSet) {
              navigate("/set-avatar");
            } else {
              navigate("/");
            }
          }
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            toast.error("Check your internet connection", toastOptions);
            setLoading(true);
            return err;
          } else {
            toast.error("Server error", toastOptions);
            setLoading(true);
            return err;
          }
        });
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="logo">SWIFT</h1>
        {loading && (
          <div className="img">
            <img src={Loader} alt="loader" className="loader-img" />
          </div>
        )}

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={username}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={password}
          />
          <button type="submit" className="submit-btn">
            Log In
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <span>
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
