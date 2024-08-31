import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Header from "../../components/Header";
import { tokens } from "../../theme";
 
const Candidat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cvFiles, setCvFiles] = useState([]);
  const [descriptionFile, setDescriptionFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const sortedData = [...tableData].sort((a, b) => b.Score - a.Score);
 
  const location = useLocation();
  const navigate = useNavigate();
 
  useEffect(() => {
    const storedData = localStorage.getItem("tableData");
    if (storedData) {
      setTableData(JSON.parse(storedData));
    }
  }, []);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/compare");
        const data = await response.json();
        setTableData(data);
        localStorage.setItem("tableData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    if (location.pathname === "/Candidat") {
      fetchData();
    }
  }, [location.pathname]);
 
 
 
  const handleDetailsClick = (id) => {
    const candidate = tableData.find((item) => item.id === id);
    navigate(`/Profile/${id}`, { state: { candidate } });
  };
 
 
 
  const handleCVUpload = (event) => {
    const files = event.target.files;
    setCvFiles(files);
  };
 
  const handleDescriptionUpload = (event) => {
    const file = event.target.files[0];
    setDescriptionFile(file);
  };
 
 
 
 
 
  const handleSend = async () => {
    const formData = new FormData();
    formData.append("jobDescriptionFile", descriptionFile);
    Array.from(cvFiles).forEach((file) => {
      formData.append("cvFiles", file);
    });
 
    try {
      const response = await fetch("http://localhost:5000/compare", {
        method: "POST",
        body: formData,
      });
      let data = await response.json();
      console.log(data);
 
      data = data.map((item, index) => ({ ...item, id: index + 1 }));
 
      data.sort((a, b) => b.Score - a.Score);
 
     
 
      setTableData(data);
      localStorage.setItem("tableData", JSON.stringify(data));
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };
 
  const columns = [
    {
      field: "Images",
      headerName: "Images",
      minWidth: 70,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            {row.Texte_CV?.Images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/images/${image}`}
                alt={`Image ${index}`}
                style={{
                  width: "40px",
                  height: "40px", // Assurez-vous que la hauteur et la largeur sont identiques pour obtenir une image parfaitement ronde
                  borderRadius: "30%", // Définit le bord de l'image comme circulaire
                  objectFit: "cover" // S'assure que l'image couvre toute la zone
              }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      field: "Email",
      headerName: "Email",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "Score",
      headerName: "Score",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => {
        const formattedScore = `${Math.round(params.value)}%`;
        return <Typography>{formattedScore}</Typography>;
    },
    },
    {
      field: "Tel",
      headerName: "Numéro Téléphone",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "Résultat",
      headerName: "Statut",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => {
        const { Résultat } = row;
 
        const getBackgroundColor = (Résultat) => {
          switch (Résultat) {
            case "Expert":
              return colors.greenAccent[400];
            case "Medium":
              return colors.orange[700];
            case "Débutant":
              return colors.redAccent[600];
            default:
              return colors.grey[700];
          }
        };
 
        const getIcon = (Résultat) => {
          switch (Résultat) {
            case "Expert":
              return <CheckCircleOutlineIcon />;
            case "Medium":
              return <CloudUploadIcon />;
            case "Débutant":
              return <CancelIcon />;
            default:
              return <SecurityOutlinedIcon />;
          }
        };
 
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="4px"
            backgroundColor={getBackgroundColor(Résultat)}
          >
            {getIcon(Résultat)}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {Résultat}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Details",
      headerName: "Details",
      minWidth: 100,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleDetailsClick(row.id)}
          >
            Détails
          </Button>
        );
      },
    },
  ];
 
  return (
    <Box m="20px">
      <Header subtitle="Gérer les candidatures par poste" />
      <Box
        m="40px 0 0 0"
        minHeight="300px"
        height={`calc(${sortedData.length * 52}px + 120px)`}
        maxHeight="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiButton-root": {
            width: "auto",
            minWidth: "auto",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          mb={2}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Sélectionner une description de poste"
              variant="outlined"
              size="small"
              multiline
              rows={descriptionFile ? 1 : 0}
              InputProps={{ readOnly: true }}
              sx={{ mr: 2, maxWidth: "none", width: "100%" }}
              value={descriptionFile ? descriptionFile.name : ""}
            />
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="description-upload"
              type="file"
              onChange={handleDescriptionUpload}
            />
            <label htmlFor="description-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 3 }}
              >
                Upload Description
              </Button>
            </label>
           
          </Box>
          <Box
            display="flex"
            alignItems="center"
            className="flex-grow"
            mb={1}
          >
            <TextField
              label="Sélectionner une liste de CV"
              variant="outlined"
              size="small"
              multiline
              rows={Math.max(1, cvFiles.length)}
              InputProps={{ readOnly: true }}
              sx={{ mr: 2, maxWidth: "none", width: "200%" }}
              value={cvFiles.length ? `${cvFiles.length} files selected` : ""}
            />
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="cv-upload"
              multiple
              type="file"
              onChange={handleCVUpload}
            />
            <label htmlFor="cv-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 3 }}
              >
                Upload CV
              </Button>
            </label>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSend}
              sx={{ width: "auto", minWidth: "auto" ,backgroundColor: '#db4059' }}
            >
              Envoyer
            </Button>
           
          </Box>
        </Box>
        <DataGrid checkboxSelection rows={tableData} columns={columns} />
 
 
      </Box>
 
     
    </Box>
  );
};
 
export default Candidat;
 