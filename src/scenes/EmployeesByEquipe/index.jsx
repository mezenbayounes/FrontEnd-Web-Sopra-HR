
import React, { useState, useEffect } from "react";

import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Snackbar, TextField, Select, MenuItem, InputLabel, FormControl, useTheme } from "@mui/material";

import axios from "axios";

import { useParams } from "react-router-dom";

import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";




const EmployeeList = () => {

  const theme = useTheme();

  const colors = {

    greenAccent: {

      500: theme.palette.mode === 'light' ? '#4caf50' : '#2e7d32',

      300: theme.palette.mode === 'light' ? '#81c784' : '#4caf50',

    }

  };




  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('username');

  const [searchValue, setSearchValue] = useState('');

  const [searchBy, setSearchBy] = useState('username');

  const { equipeId } = useParams();

  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");




  useEffect(() => {

    const fetchEmployees = async () => {

      try {

        const response = await axios.post("http://localhost:3000/equipe/GetEmployeeDetailsByEquipeId", { equipeId });

        setEmployees(response.data);

        setLoading(false);

      } catch (err) {

        setError("Failed to fetch employees");

        setLoading(false);

      }

    };




    fetchEmployees();

  }, [equipeId]);




  const handleRequestSort = (property) => {

    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');

    setOrderBy(property);

  };




  const handleSearchChange = (event) => {

    setSearchValue(event.target.value);

  };




  const handleSearchByChange = (event) => {

    setSearchBy(event.target.value);

  };




  const filteredEmployees = employees.filter(employee => 

    (searchBy === 'id' ? employee.id.toString().includes(searchValue) : employee.username.toLowerCase().includes(searchValue.toLowerCase()))

  );




  const sortedEmployees = filteredEmployees.slice().sort((a, b) => {

    if (a[orderBy] < b[orderBy]) {

      return order === 'asc' ? -1 : 1;

    }

    if (a[orderBy] > b[orderBy]) {

      return order === 'asc' ? 1 : -1;

    }

    return 0;

  });




  if (loading) return <CircularProgress />;

  if (error) return <Typography color="error">{error}</Typography>;




  const handleCloseFeedbackDialog = () => {

    setOpenFeedbackDialog(false);

  };




  return (

    <Box 

      m="10px"

      display="flex"

      flexDirection="column"

      alignItems="center"

      justifyContent="center"

      height="100vh"

    >

      <Typography variant="h6" sx={{ fontSize: "28px", marginBottom: "20px" }}>

        Employees List

      </Typography>

      <Box 

        width="80%" 

        maxWidth="600px"

        mb="20px"

        display="flex"

        justifyContent="flex-start"

        gap="10px"

      >

        <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>

          <InputLabel>Search By</InputLabel>

          <Select

            value={searchBy}

            onChange={handleSearchByChange}

            label="Search By"

          >

            <MenuItem value="id">ID</MenuItem>

            <MenuItem value="username">Username</MenuItem>

          </Select>

        </FormControl>

        <TextField

          size="small"

          label="Search"

          variant="outlined"

          value={searchValue}

          onChange={handleSearchChange}

          sx={{ width: 200 }}

        />

      </Box>

      <Box 

        width="80%" 

        maxWidth="600px"

        mb="30px" // Added bottom margin for spacing

        display="flex"

        justifyContent="center"

      >

        <TableContainer component={Paper}>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>

                  <TableSortLabel

                    active={orderBy === 'id'}

                    direction={orderBy === 'id' ? order : 'asc'}

                    onClick={() => handleRequestSort('id')}

                  >

                    ID

                  </TableSortLabel>

                </TableCell>

                <TableCell>

                  <TableSortLabel

                    active={orderBy === 'username'}

                    direction={orderBy === 'username' ? order : 'asc'}

                    onClick={() => handleRequestSort('username')}

                  >

                    Username

                  </TableSortLabel>

                </TableCell>

                <TableCell>Access Level</TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {sortedEmployees.map(employee => (

                <TableRow key={employee.id}>

                  <TableCell>{employee.id}</TableCell>

                  <TableCell>{employee.username}</TableCell>

                  <TableCell>

                    <Box display="flex" alignItems="center">

                      <LockOpenOutlinedIcon style={{ color: colors.greenAccent[500], fontSize: 20 }} />

                      <Typography color={colors.greenAccent[500]} sx={{ ml: "4px" }}>

                        Employee

                      </Typography>

                    </Box>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </TableContainer>

      </Box>




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




export default EmployeeList;




