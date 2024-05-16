import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from "axios";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [mockDataTeam, setMockDataTeam] = useState([]);

  const fetchData = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTcxNTg5Mjk0NiwiZXhwIjoxNzE1ODk2NTQ2fQ.4EH8_oxeKr1mpzfydbOmsvWiV7hFTbLJyuYDlsWpPME";
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
      <Header title="Work Space " subtitle="Managing The Work Spaces" />
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