import React, { useState } from "react";
import { Container, Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Axios from "axios";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import bgPage from "./bglogin.jpg";
import bgContainer from "./bg.jpg";
import { useNavigate } from "react-router-dom";
import { Link, Typography } from '@mui/material'; // Importing Typography from Material-UI


const Login = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };


  const handleFormSubmit = async (values) => {
    let statusCode = 0;
  
    try {
      const response = await Axios.post("http://localhost:3000/auth/login", values);
      statusCode = response.status;
      console.log("User logged in successfully:", response.data);
  
      if (response.status === 200) {
      
          console.log(response.data);
          navigate("/");
      }
    } catch (error) {
      if (error.response) {
        // If there is a response from the server
        statusCode = error.response.status;
        console.error("Error logging in:", error.response.data);
        // Handle different status codes here
        if (error.response.status === 401) {
          setError("Unauthorized. Please check your credentials");
        } else if (error.response.status === 404) {
          setError("User not found");
        } else if (error.response.status === 403) {
          setError("Unauthorized. Please verify your account");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        // If there is no response from the server (e.g., network error)
        console.error("Network error:", error.message);
        setError("Login failed. Please check your internet connection.");
      }
    }
    
  };
  
  

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgPage})`,
        backgroundSize: "30%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundImage: `url(${bgContainer})`,
          backgroundSize: "cover",
          borderRadius: 10,
          p: 3,
          overflow: "hidden",
          height: "360px", // Example height
          width: "470px", 
        }}
      >
        <Box>
          <Header title="LOGIN" subtitle="Login to Your Account" />

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={loginSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="25px"
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 20 }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 20 }}
                  />
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
  <Button type="submit" color="secondary" variant="contained">
    Login
  </Button>
  {error && (
    <Box sx={{ color: "red", mt: 1 }}>
      {error}
    </Box>
  )}
  <Link to="/sign_up" style={{ textDecoration: 'none', marginTop: '10px' }}>
    <Typography variant="body1" color="primary">
      Sign Up
    </Typography>
  </Link>
</Box>
              </form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
};

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email Required"),
  password: yup.string().required("Password Required"),
});

const initialValues = {
  email: "",
  password: "",
};

export default Login;
