import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import image_user from "./user_image.jpg";

const Signup = () => {
  const [data, setData] = useState({
    UserName: "",
    choice: "employee", // Set default value to "employee"
    email: "",
    password: "",
    selectedImage: null,
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token")).token;

  const theme = useTheme(); // Use the useTheme hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setData((prevData) => ({
      ...prevData,
      selectedImage: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/auth/signup";
      const formData = new FormData();
      formData.append("image", data.selectedImage);
      formData.append("username", data.UserName);
      formData.append("role", data.choice);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMsg(response.data.message);
      setOpenFeedbackDialog(true);
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

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>New Account</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: "400px" }}
      >
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }} // Hide the file input
        />
        <Box
          sx={{ display: "flex", justifyContent: "center", my: 2 }}
          onClick={() => document.getElementById("imageInput").click()} // Clickable area to trigger file input
        >
          <img
            src={
              data.selectedImage
                ? URL.createObjectURL(data.selectedImage)
                : image_user
            }
            alt="User Preview"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              cursor: "pointer",
            }} // Add cursor pointer
          />
        </Box>
        <TextField
          label="UserName"
          name="UserName"
          value={data.UserName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <InputLabel id="role-select-label">Role</InputLabel>
        <Select
          labelId="role-select-label"
          name="choice"
          value={data.choice}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="ligne_manager">Line Manager</MenuItem>
          <MenuItem value="employee">Employee</MenuItem>
        </Select>
        <TextField
          label="Password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        {msg && <Typography color="success">{msg}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            width: "200px", // Set the desired width
            display: "block",
            mx: "auto", // Center the button horizontally
          }}
        >
          Create
        </Button>

        <br></br>
        <br></br>
      </Box>

      <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog}>
        <DialogTitle>Signup </DialogTitle>
        <DialogContent>
          <MuiAlert severity={error ? "error" : "success"}>
            {error || "User created "}
          </MuiAlert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signup;
