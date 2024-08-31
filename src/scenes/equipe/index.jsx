import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const theme = useTheme();
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

      const response = await axios.get("http://localhost:3000/equipe/GetAllEquipe", config);
      setMockDataTeam(response.data.equipes); // Update the data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddEquipe = () => {
    navigate("/AddEquipe");
  };

  const handleDeleteEquipe = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        "http://localhost:3000/equipe/DeleteEquipeByIds",
        {
          data: { equipeIds: selectedIds }, // Pass the payload in the "data" property
          headers: config.headers, // Pass the headers to the request
        }
      );

      setSnackbarMessage("Teams deleted successfully.");
      setIsSuccess(true);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      setSnackbarMessage("Failed to delete teams.");
      setIsSuccess(false);
      console.error("Error deleting teams:", error);
    }

    setOpenFeedbackDialog(true); // Open feedback dialog after deletion
    setOpenConfirmDialog(false); // Close confirmation dialog
  };

  const handleSelectionModelChange = (selection) => {
    setSelectedIds(selection);
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
    { field: "id_manager", headerName: "ID Manager", flex: 1 },
    { field: "id_ligne_manager", headerName: "ID Ligne Manager", flex: 1 },
    { field: "id_plateau", headerName: "ID Plateau", flex: 1 },
    { field: "partie", headerName: "Partie", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontSize: "28px" }}>
              Teams
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleOpenConfirmDialog} sx={{ marginRight: "8px" }}>
                <DeleteOutlineOutlinedIcon style={{ fontSize: 40 }} />
              </IconButton>
              <IconButton onClick={handleAddEquipe}>
                <AddBoxIcon style={{ fontSize: 40 }} />
              </IconButton>
            </Box>
          </Box>
        }
        subtitle="Managing The Teams"
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
          rows={mockDataTeam}
          columns={columns}
          checkboxSelection
          selectionModel={selectedIds}
          onSelectionModelChange={handleSelectionModelChange}
        />
      </Box>

      {/* Confirm Deletion Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete the selected teams?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeleteEquipe} sx={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
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

export default Team;
