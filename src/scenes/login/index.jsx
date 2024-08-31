import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import sopraLogo from "./sopra_hr.png"; // Replace "sopraLogo.png" with the path to your Sopra logo image
import adminimage from "../login/admin.png"; // Replace "adminimage.png" with the path to your admin image

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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
      window.location = "/";
    } catch (error) {
      if (error.response) {
        // Extract error message from response
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
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
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
