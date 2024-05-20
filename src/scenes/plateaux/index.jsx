import { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const colors = tokens(theme.palette.mode);
  const [mockDataTeam, setMockDataTeam] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const token =JSON.parse(localStorage.getItem("token")).token;

  const fetchData = async () => {
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get("http://localhost:3000/plateau/GetAllPlateaux", config);
      setMockDataTeam(response.data); // Update the data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleAddPlateau = () => {
    navigate("/AddPlateau");
  };
  const handleDeletePlateau =async () => {
    console.log(selectedIds);
    console.log(token);
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.delete(
        "http://localhost:3000/plateau/DeletePlateauByIds",
        {
          data: { plateauIds: selectedIds }, // Pass the payload in the "data" property
          headers: config.headers, // Pass the headers to the request
        }
      );
  
      console.log("Response from delete Plateau:", response.data);
    } catch (error) {
      console.error("Error from delete Plateau:", error);
    }
  };
  const handleSelectionModelChange = (selection) => {
    setSelectedIds(selection);
  };
  useEffect(() => { 
    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "id_manager", headerName: "ID Manager", flex: 1 },
    { field: "nmbr_de_partie", headerName: "number of parts", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
  title={
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h6" sx={{ fontSize: "28px" }}>
        Work Spaces
      </Typography>
      <Box display="flex" alignItems="center">
        <IconButton onClick={handleDeletePlateau} sx={{ marginRight: "8px" }}>
          <DeleteOutlineOutlinedIcon style={{ fontSize: 40 }} />
        </IconButton>
        <IconButton onClick={handleAddPlateau}>
          <AddBoxIcon style={{ fontSize: 40 }} />
        </IconButton>
      </Box>
    </Box>
  }
  subtitle="Managing The Work Spaces"
/>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          // additional styling...
        }}
      >
        <DataGrid checkboxSelection
         rows={mockDataTeam} 
         columns={columns}
         selectionModel={selectedIds}
         onSelectionModelChange={handleSelectionModelChange}
       
          />
      </Box>
    </Box>
  );
};

export default Team;