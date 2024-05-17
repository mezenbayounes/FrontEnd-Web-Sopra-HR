import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const colors = tokens(theme.palette.mode);
  const [mockDataTeam, setMockDataTeam] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTcxNTk1NzYyMywiZXhwIjoxNzE1OTc1NjIzfQ.wrdfPRS9sNtL-txZH5FChTwOXfWLdK1pfbdU6qxD7Hc";

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:3000/equipe/GetAllEquipe",
        config
      );

      setMockDataTeam(response.data.equipes); // Update the data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddPlateau = () => {
    navigate("/AddEquipe");
  };

  const handleRowSelection = (selection) => {
    setSelectedRows(selection.selectionModel);
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
            <IconButton onClick={handleAddPlateau}>
              <AddBoxIcon style={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        }
        subtitle="Managing The Teams"
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
        <DataGrid
          rows={mockDataTeam}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={handleRowSelection}
          selectionModel={selectedRows}
        />
      </Box>
    </Box>
  );
};

export default Team;