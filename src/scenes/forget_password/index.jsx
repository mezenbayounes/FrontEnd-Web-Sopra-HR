import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/auth/SendOTP";
      const response = await axios.post(url, { email });
      setMsg(response.data.message);
      setTimeout(() => {
        // Navigate to the next page and pass the email as a query parameter
        navigate(`/ConfirmOTPforgetPassword?email=${email}`);
      }, 3000); // Delay of 3 seconds (3000 milliseconds)
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
    <div className={styles.forgot_password_container}>
      <div className={styles.center_container}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h1 style={{ color: "#FFFFFF", textAlign: "center", margin: "0 auto" }}>
            Forgot Password
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
            className={styles.input}
          />

          {error && <div className={styles.error_msg}>{error}</div>}
          {msg && <div className={styles.success_msg}>{msg}</div>}

          <button type="submit" className={styles.green_btn}>
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;