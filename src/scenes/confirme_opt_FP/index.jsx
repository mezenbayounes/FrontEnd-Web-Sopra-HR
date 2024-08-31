import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography, TextField, InputAdornment, IconButton  } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import styles from "./styles.module.css";
import { useSearchParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ConfirmOTPforgetPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emaill, setEmail] = useState("");

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const otpSchema = yup.object().shape({
    otp1: yup.string().required("Required").matches(/^\d{1}$/, "Invalid OTP"),
    otp2: yup.string().required("Required").matches(/^\d{1}$/, "Invalid OTP"),
    otp3: yup.string().required("Required").matches(/^\d{1}$/, "Invalid OTP"),
    otp4: yup.string().required("Required").matches(/^\d{1}$/, "Invalid OTP"),
    otp5: yup.string().required("Required").matches(/^\d{1}$/, "Invalid OTP"),
    otp6: yup.string().required("Required").matches(/^\d{1}$/, "Invalid OTP"),
  });
  const handleChange = (e) => {
    setEmail(e.target.value);
   
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleFormSubmit = async (values) => {
    try {
      const otp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}${values.otp5}${values.otp6}`;
      console.log(otp);
      console.log(email);
      console.log(password);



      const response = await Axios.put("http://localhost:3000/auth/ChangeForgotPassword", {
        email: email, // Utilisation de l'email passé en tant que prop
        inputOtp: otp,
        newPassword:password
      });

      if (response.status === 200) {
        setSubmitted(true);
        setTimeout(() => {
          // Navigate to the next page and pass the email as a query parameter
          navigate(`/login?email=${emaill}`);
        }, 3000); // Delay of 3 seconds (3000 milliseconds)
      } else {
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  

  return (
    <Box
      className={`${styles.forgot_password_container}`}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={90} md={6} className={`${styles.center_container}`}>
          <Typography
            variant="h5"
          
          >
<h1 style={{ color: "#FFFFFF", textAlign: "center", margin: "0 auto" }}>Confirme OTP</h1>            
          </Typography>
          <br></br>
        
       
          
          <Formik
            initialValues={{
              otp1: "",
              otp2: "",
              otp3: "",
              otp4: "",
              otp5: "",
              otp6: "",
            }}
            validationSchema={otpSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} className={`${styles.form_container}`}>
                <div className={`${styles.otp_input_container}`}>
                  {[...Array(6)].map((_, index) => (
                    <TextField
                      key={index}
                      type="text"
                      name={`otp${index + 1}`}
                      value={values[`otp${index + 1}`]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched[`otp${index + 1}`] &&
                        Boolean(errors[`otp${index + 1}`])
                      }
                      helperText={
                        touched[`otp${index + 1}`] &&
                        errors[`otp${index + 1}`]
                      }
                      maxLength={1}
                      variant="outlined"
                      className={`${styles.otp_input}`}
                      style={{ marginRight: "10px" }}
                    />  
                  ))}
                </div>
                <br>
                </br>
                <br>
                </br>
                <TextField
  type={showPassword ? "text" : "password"}
  placeholder="New Password"
  name="password"
  value={password}
  onChange={handlePasswordChange}
  required
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={togglePasswordVisibility}>
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
    style: { 
      backgroundColor: 'white', // Set the background to white
      color: 'black', // Set the text color to black
    },
  }}
  InputLabelProps={{
    style: { color: 'gray' } // Set the placeholder (label) text to gray
  }}
  className={styles.input}
/>

                <br></br>

                <button type="submit" className={styles.white_btn}>
            Send OTP
          </button>
              </form>
            )}
          </Formik>
          {submitted && (
            <Typography variant="body1" className={`${styles.success_message}`}>
              OTP correct
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfirmOTPforgetPassword;