import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import sopraLogo from "./sopra_hr.png";
import adminimage from "../login/admin.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import IconButton from "@mui/material/IconButton";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setData({ email: savedEmail, password: savedPassword });
    }

    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/auth/login";
      const response = await axios.post(url, data);
      localStorage.setItem("token", JSON.stringify(response.data));
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || "An unexpected error occurred";
        setError(errorMessage);
        setShowPopup(true);
      } else {
        setError("An unexpected error occurred");
        setShowPopup(true);
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.login_image_container}></div>
        <div className={styles.left}>
          <img src={sopraLogo} alt="Sopra" className={styles.sopra_logo} />
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <br />
            <h1 style={{ color: "#ff8000" }}>Login</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <div className={styles.password_container}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={data.password}
                onChange={handleChange}
                required
                className={styles.password_input}
              />
              <IconButton
                onClick={handleTogglePassword}
                className={styles.password_toggle}
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            </div>
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
          <Link to="/forgetPassword" className={styles.forget_password_link}>
            Forget Password?
          </Link>
        </div>
        <div className={styles.right}>
          <img src={adminimage} alt="admin" className={styles.image} />
          <h1>Welcome Back</h1>
        </div>
      </div>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popup_content}>
            <span className={styles.close_button} onClick={handleClosePopup}>
              &times;
            </span>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
