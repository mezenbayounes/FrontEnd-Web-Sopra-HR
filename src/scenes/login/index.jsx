import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import sopraLogo from "./sopra_hr_bw.png"; // Replace "sopraLogo.png" with the path to your Sopra logo image

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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
      localStorage.setItem("token", response.data.data);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.login_image_container}></div>
        <div className={styles.left}>
          <img src={sopraLogo} alt="Sopra" className={styles.sopra_logo} />
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <br />
            <h1 style={{ color: "#5e01b5" }}>Login</h1>
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
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
          <Link to="/forgetPassword" className={styles.forget_password_link}>
            Forget Password?
          </Link>
        </div>
        <div className={styles.right}>
          <h1>New Account</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;