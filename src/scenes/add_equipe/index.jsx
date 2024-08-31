import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, MenuItem, FormControl, Select, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from "axios";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

const Plateau = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [mockDataTeam, setMockDataTeam] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [managers, setManagers] = useState([]);
  const [lineManagers, setLineManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedLineManager, setSelectedLineManager] = useState("");
  const [plateaux, setPlateaux] = useState([]);
  const [selectedPlateau, setSelectedPlateau] = useState("");

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const token = JSON.parse(localStorage.getItem("token")).token;

  const fetchPlateaux = async () => {
    try {
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const response = await axios.get("http://localhost:3000/plateau/GetAllPlateaux", config);
      setPlateaux(response.data);
    } catch (error) {
      console.error("Error fetching plateaux:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("http://localhost:3000/auth/GetAllManagers", config);
      setManagers(response.data.Managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const fetchLineManagers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("http://localhost:3000/auth/GetAllLineManagers", config);
      setLineManagers(response.data.lineManagers);
    } catch (error) {
      console.error("Error fetching line managers:", error);
    }
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("http://localhost:3000/auth/GetAllEmployees", config);
      setMockDataTeam(response.data.employees);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchManagers();
    fetchLineManagers();
    fetchPlateaux();
  }, []);

  const handleSelectionModelChange = (selection) => {
    setSelectedIds(selection);
  };

  const handleAddEquipe = async (values) => {
    const { numberOfParts } = values;
    const [idManager] = selectedManager.split("-");
    const [idLineManager] = selectedLineManager.split("-");

    try {
      const response = await axios.post(
        "http://localhost:3000/equipe/CreateEquipe",
        {
          idManager: parseInt(idManager),
          idLigneManager: parseInt(idLineManager),
          employees: selectedIds,
          idPlateau: parseInt(selectedPlateau),
          Partie: parseInt(numberOfParts),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDialogContent("Equipe created successfully!");
      setIsSuccess(true); // Set success state
      setOpenDialog(true);
    } catch (error) {
      console.error("Error creating equipe:", error);
      setDialogContent("Failed to create equipe.");
      setIsSuccess(false); // Set failure state
      setOpenDialog(true);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "username", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { role } }) => (
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
      ),
    },
  ];

  const validationSchema = Yup.object({
    numberOfParts: Yup.number().required("Number of parts is required").positive().integer(),
  });

  return (
    <Box m="20px">
      <Header
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontSize: "38px" }}>
              Add Teams
            </Typography>
            <IconButton type="submit" form="add-equipe-form">
              <AddBoxIcon style={{ fontSize: 45 }} />
            </IconButton>
          </Box>
        }
        subtitle="Create New Team"
      />
      <Formik
        initialValues={{ numberOfParts: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddEquipe}
      >
        {({ values, setFieldTouched, handleChange, handleSubmit }) => (
          <form id="add-equipe-form" onSubmit={handleSubmit}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={selectedManager}
                  onChange={(event) => {
                    setSelectedManager(event.target.value);
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Select Manager" }}
                >
                  <MenuItem value="" disabled>
                    Select Manager
                  </MenuItem>
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={`${manager.id}-${manager.username}`}>
                      {`${manager.id} - ${manager.username}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={selectedLineManager}
                  onChange={(event) => {
                    setSelectedLineManager(event.target.value);
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Select Line Manager" }}
                >
                  <MenuItem value="" disabled>
                    Select Line Manager
                  </MenuItem>
                  {lineManagers.map((manager) => (
                    <MenuItem key={manager.id} value={`${manager.id}-${manager.username}`}>
                      {`${manager.id} - ${manager.username}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={selectedPlateau}
                  onChange={(event) => {
                    setSelectedPlateau(event.target.value);
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Select work space ID" }}
                >
                  <MenuItem value="" disabled>
                    Select Work Space ID
                  </MenuItem>
                  {plateaux.map((plateau) => (
                    <MenuItem key={plateau.id} value={plateau.id}>
                      {plateau.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Part"
                  name="numberOfParts"
                  value={values.numberOfParts}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched("numberOfParts", true)}
                  helperText={<ErrorMessage name="numberOfParts" />}
                  sx={{ mb: 2 }}
                />
              </FormControl>
            </Box>
          </form>
        )}
      </Formik>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={mockDataTeam}
          columns={columns}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
          selectionModel={selectedIds}
          onSelectionModelChange={handleSelectionModelChange}
        />
      </div>

      {/* Dialog for success/failure */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Operation Status</DialogTitle>
        <DialogContent>
          <Typography
            style={{
              color: isSuccess ? "green" : "red", // Apply green color for success, red for failure
              fontWeight: "bold",
            }}
          >
            {dialogContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Plateau;
