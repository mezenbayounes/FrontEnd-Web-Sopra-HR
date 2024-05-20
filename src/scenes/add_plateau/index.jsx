import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AddPlateau = () => {
  const [lineManagers, setLineManagers] = useState([]);
  const [selectedLineManager, setSelectedLineManager] = useState("");
  const [touched, setTouched] = useState({ numberOfParts: false });
  const token =JSON.parse(localStorage.getItem("token")).token;


  
  useEffect(() => {
    const fetchLineManagers = async () => {
      try {
       
        const response = await axios.get(
          "http://localhost:3000/auth/GetAllLineManagers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLineManagers(response.data.lineManagers);
      } catch (error) {
        console.error("Error fetching line managers:", error);
      }
    };

    fetchLineManagers();
  }, []);

  const handleFormSubmit = async (values) => {
    const { numberOfParts } = values;
    const [id] = selectedLineManager.split("-");

    console.log("Selected Line Manager ID:", id);
    console.log("Number of Parts:", numberOfParts);

    try {
     
      const response = await axios.post(
        "http://localhost:3000/plateau/CreatePlateau",
        {
          idManager: parseInt(id),
          numberOfParties: parseInt(numberOfParts),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from CreatePlateau:", response.data);

      // Handle the response as needed...
    } catch (error) {
      console.error("Error creating plateau:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    numberOfParts: Yup.number().required("Number of Parts is required"),
  });

  return (
    <Box m="20px">
        <Box display="flex" justifyContent="center">
        <h1>CREATE WORK SPACE</h1>
      </Box>
      <br></br>
      <br></br>
      <br></br>

      <h2>Create a New SPACE</h2>

      <Formik
        initialValues={{ numberOfParts: "" }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              maxWidth="400px"
              mx="auto"
            >
              <Field
                as={TextField}
                select
                fullWidth
                variant="filled"
                label="Line Manager"
                name="lineManager"
                value={selectedLineManager}
                onChange={(event) => setSelectedLineManager(event.target.value)}
                helperText={<ErrorMessage name="lineManager" />}
                sx={{ mb: 2 }}
              >
                {lineManagers.map((manager) => (
                  <MenuItem
                    key={manager.id}
                    value={`${manager.id}-${manager.username}`}
                  >
                    {`${manager.id} - ${manager.username}`}
                  </MenuItem>
                ))}
              </Field>

              <Field
                as={TextField}
                fullWidth
                variant="filled"
                type="number"
                label="Number of Parts"
                name="numberOfParts"
                error={touched.numberOfParts && !values.numberOfParts}
                onBlur={() => setTouched({ numberOfParts: true })}
                helperText={<ErrorMessage name="numberOfParts" />}
                sx={{ mb: 2 }}
              />

              <Button type="submit" variant="contained" color="primary">
                Add New Work Space
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddPlateau;