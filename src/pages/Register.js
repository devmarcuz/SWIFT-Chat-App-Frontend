import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import isEmpty from "validator/lib/isEmpty";
import isEmail from "validator/lib/isEmail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Register.css";
import axios from "axios";
import { addUserApi } from "../api/ApiRoutes";
import Loader from "../assets/loader.gif";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { username, email, password, confirmPassword } = formData;

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

    if (
      isEmpty(username) ||
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(confirmPassword)
    ) {
      toast.error("All fields are required", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username length too short");
      return false;
    } else if (password.length < 8) {
      toast.error("Password length too short");
      return false;
    } else if (!isEmail(email)) {
      toast.error("Enter a valid email", toastOptions);
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Password doesn't match", toastOptions);
      return false;
    } else {
      setLoading(true);

      axios
        .post(addUserApi, { username, email, password })
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
              confirmPassword: "",
              email: "",
            });
            setLoading(false);

            if (!res.data.isAvatarSet) {
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
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={email}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={password}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={confirmPassword}
          />
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
