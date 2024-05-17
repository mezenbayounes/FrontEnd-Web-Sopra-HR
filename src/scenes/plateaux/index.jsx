import { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AddBoxIcon from '@mui/icons-material/AddBox';

import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const colors = tokens(theme.palette.mode);
  const [mockDataTeam, setMockDataTeam] = useState([]);

  const fetchData = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTcxNTk1NzYyMywiZXhwIjoxNzE1OTc1NjIzfQ.wrdfPRS9sNtL-txZH5FChTwOXfWLdK1pfbdU6qxD7Hc";
    
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
      <Header title={
       <Box display="flex" alignItems="center" justifyContent="space-between">
<Typography variant="h6" sx={{ fontSize: "28px" }}>
        Work Spaces
      </Typography>
             <IconButton onClick={handleAddPlateau}>
         <AddBoxIcon style={{ fontSize: 40 }} />
       </IconButton>
     </Box>
      } subtitle="Managing The Work Spaces" />
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
        <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;