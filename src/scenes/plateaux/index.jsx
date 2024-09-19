
import { useState, useEffect } from "react";

import {

  Box,

  Typography,

  useTheme,

  IconButton,

  Dialog,

  DialogTitle,

  DialogContent,

  DialogActions,

  Button,

  Snackbar,

} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import AddBoxIcon from '@mui/icons-material/AddBox';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

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

      const response = await axios.get("http://localhost:3000/plateau/GetAllPlateaux", {

        headers: { Authorization: `Bearer ${token}` }

      });




      const plateauxWithManagerNames = await Promise.all(

        response.data.map(async (plateau) => {

          const managerUsername = await getUserNameById(plateau.id_manager);




          return {

            ...plateau,

            id_manager: `${plateau.id_manager} - ${managerUsername}`, // Include manager username

          };

        })

      );




      setMockDataTeam(plateauxWithManagerNames); // Update the data with the manager's username

    } catch (error) {

      console.error("Error fetching data:", error);

    }

  };




  const getUserNameById = async (userId) => {

    try {

      const response = await axios.post("http://localhost:3000/auth/getUserNameByIdd", { userId }, {

        headers: { Authorization: `Bearer ${token}` }

      });

      return response.data.username; // Return the username from the API response

    } catch (error) {

      console.error(`Error fetching username for user ${userId}:`, error);

      return "Unknown"; // Return "Unknown" if there is an error

    }

  };




  const handleAddPlateau = () => {

    navigate("/AddPlateau");

  };




  const handleDeletePlateau = async () => {

    try {

      await axios.delete("http://localhost:3000/plateau/DeletePlateauByIds", {

        data: { plateauIds: selectedIds },

        headers: { Authorization: `Bearer ${token}` }

      });




      setSnackbarMessage("Work space(s) deleted successfully.");

      setIsSuccess(true);

      fetchData(); // Refresh data after deletion

    } catch (error) {

      setSnackbarMessage("Failed to delete work space(s).");

      setIsSuccess(false);

      console.error("Error deleting work space(s):", error);

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

    { field: "id_manager", headerName: "ID Manager - Username", flex: 1 }, // Updated to show ID and username

    { field: "nmbr_de_partie", headerName: "Number of Parts", flex: 1 }

  ];




  return (

    <Box m="20px">

      <Typography variant="h6" sx={{ fontSize: "28px", marginBottom: "20px" }}>

        Work Spaces

      </Typography>

      <Box display="flex" justifyContent="flex-end">

        <IconButton onClick={handleOpenConfirmDialog} sx={{ marginRight: "8px" }}>

          <DeleteOutlineOutlinedIcon style={{ fontSize: 40 }} />

        </IconButton>

        <IconButton onClick={handleAddPlateau}>

          <AddBoxIcon style={{ fontSize: 40 }} />

        </IconButton>

      </Box>




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

          selectionModel={selectedIds}

          onSelectionModelChange={handleSelectionModelChange}

        />

      </Box>




      {/* Confirm Deletion Dialog */}

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>

        <DialogTitle>Confirm Deletion</DialogTitle>

        <DialogContent>Are you sure you want to delete the selected work space(s)?</DialogContent>

        <DialogActions>

          <Button onClick={handleCloseConfirmDialog} color="primary">Cancel</Button>

          <Button onClick={handleDeletePlateau} sx={{ backgroundColor: 'red', color: 'white' }}>

            Delete

          </Button>

        </DialogActions>

      </Dialog>




      {/* Feedback Dialog after Deletion */}

      <Snackbar

        open={openFeedbackDialog}

        autoHideDuration={3000}

        onClose={handleCloseFeedbackDialog}

        message={snackbarMessage}

        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

      />

    </Box>

  );

};




export default Team;




