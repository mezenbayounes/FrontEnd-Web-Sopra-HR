import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Plateau = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token")).token;

  const [mockDataTeam, setMockDataTeam] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // For confirmation before deletion
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false); // For feedback after deletion
  const [isSuccess, setIsSuccess] = useState(false); // For success/failure feedback
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get("http://localhost:3000/auth/GetAllUser", config);
      setMockDataTeam(response.data.users); // Update the data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddUser = () => {
    navigate("/signup");
  };

  const handleDeleteUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        "http://localhost:3000/auth/deleteUsersByIds",
        {
          data: { userIds: selectedIds }, // Pass the payload in the "data" property
          headers: config.headers, // Pass the headers to the request
        }
      );

      setSnackbarMessage("Users deleted successfully.");
      setIsSuccess(true);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      setSnackbarMessage("Failed to delete users.");
      setIsSuccess(false);
      console.error("Error deleting users:", error);
    }

    setOpenFeedbackDialog(true); // Open feedback dialog after deletion
    setOpenConfirmDialog(false); // Close confirmation dialog
  };

  const handleSelectionModelChange = (selection) => {
    setSelectedIds(selection);
    console.log("Selected IDs:", selection.join(", "));
  };

  const handleOpenConfirmDialog = () => {
    if (selectedIds.length > 0) {
      setOpenConfirmDialog(true);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "username", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "admin"
                ? colors.greenAccent[600]
                : role === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {role === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {role === "manager" && <SecurityOutlinedIcon />}
            {role === "ligne_manager" && <SecurityOutlinedIcon />}
            {role === "employee" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role === "ligne_manager" ? "Ligne Manager" : role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontSize: "28px" }}>
              TEAM
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleOpenConfirmDialog} sx={{ marginRight: "8px" }}>
                <DeleteOutlineOutlinedIcon style={{ fontSize: 40 }} />
              </IconButton>
              <IconButton onClick={handleAddUser}>
                <AddBoxIcon style={{ fontSize: 40 }} />
              </IconButton>
            </Box>
          </Box>
        }
        subtitle="Managing the Team Members"
      />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={mockDataTeam}
          columns={columns}
          onSelectionModelChange={handleSelectionModelChange}
        />
      </Box>

      {/* Confirm Deletion Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete the selected users?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeleteUsers} sx={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={openFeedbackDialog}
        autoHideDuration={3000}
        onClose={handleCloseFeedbackDialog}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Plateau;
