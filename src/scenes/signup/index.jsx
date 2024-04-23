import React, { useState } from "react";
import { Container, Box, Button, TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Axios from "axios";
import { Visibility, VisibilityOff, Email, AccountCircle, Add } from "@mui/icons-material"; // Added Add icon
import bgPage from "../login/bglogin.jpg";
import bgContainer from "../login/bg.jpg";
import { useNavigate } from "react-router-dom";
import { Link, Typography } from '@mui/material'; // Importing Typography from Material-UI

const Signup = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (values) => {
    let statusCode = 0;
  
    try {
      const formData = new FormData();
      formData.append("image", values.image); // Append the file object to the FormData
  
      // Append other form fields
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });
  
      const response = await Axios.post("http://localhost:3000/auth/signup", formData);
      statusCode = response.status;
      console.log("User signed up successfully:", response.data);
        navigate("/login");
      
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User already exists. Please choose a different username or email.");
      } else {
        setError("An error occurred. Please try again later.");
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
    overflowY: "scroll", // Always show vertical scrollbar
    height: "560px", // Example height
    width: "1000px", 
    WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS devices
    "&::-webkit-scrollbar": {
      width: "10px", // Width of the scrollbar
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Color of the thumb
      borderRadius: "5px", // Border radius of the thumb
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0, 0, 0, 0.1)", // Color of the track
      borderRadius: "5px", // Border radius of the track
    },
  }}
>


       
        <Box>
          
          
          <Header title="SIGN UP" subtitle="Create Your Account" />
        
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={signupSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="25px"
                >
     
     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  <Typography sx={{ flex: 1 }}>Upload Image</Typography>
  <input
    accept="image/*"
    style={{ display: 'none' }}
    id="contained-button-file"
    type="file"
    name="image"
    onChange={(event) => {
      const selectedFile = event.currentTarget.files[0];
      if (selectedFile) { 
        try {
          console.log(selectedFile.path);
          setFieldValue("image", selectedFile);
          setSelectedImage(URL.createObjectURL(selectedFile));
          
        } catch (error) {
          console.error("Error processing selected image:", error);
          // Handle the error, such as displaying an error message to the user
        }
      } else {
        console.error("No file selected");
        // Handle the case where no file is selected, such as displaying a message to the user
      }
    }}
  />
  <label htmlFor="contained-button-file">
    <IconButton
      aria-label="upload picture"
      component="span"
    >
      <Add />
    </IconButton>
  </label>
</Box>
{selectedImage && (
  <img src={selectedImage} alt="Uploaded" style={{width: '10%' }} />
  
)}

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 20 }}
                  />
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
                 
                  <TextField
                    select
                    fullWidth
                    variant="outlined"
                    label="Role"
                    value={values.role}
                    onChange={handleChange}
                    name="role"
                    error={!!touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
                    sx={{ borderRadius: 20 }}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="ligne_manager">Line Manager</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </TextField>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                  <Button type="submit" color="secondary" variant="contained">
                    Sign Up
                  </Button>
                  {error && (
  <Box sx={{ color: "red", mt: 1 }}>
    {error}
  </Box>
)}
                  <Link to="/login" style={{ textDecoration: 'none', marginTop: '10px' }}>
                    <Typography variant="body1" color="primary">
                      Already have an account? Login
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

const signupSchema = yup.object().shape({
  username: yup.string().required("Username Required"),
  email: yup.string().email("Invalid email").required("Email Required"),
  password: yup.string().required("Password Required"),
  role: yup.string().required("Role Required"),
  image: yup.mixed().required("Image Required"),
});

const initialValues = {
  username: "",
  email: "",
  password: "",
  role: "",
  image: null,
};

export default Signup;
