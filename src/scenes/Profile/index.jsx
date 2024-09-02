import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Link,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  LinkedIn,
  GitHub,
  Email,
  Phone,
  School,
  Build,
  Language,
  ContactMail,
  AccountCircle as AccountCircleIcon,
  VerifiedUser as VerifiedIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import StatBox from "../../components/StatBox";
//import aboutPic from './user.png';

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const { candidate } = location.state || {};

  if (!candidate) {
    return <Typography>Pas de candidat sélectionné.</Typography>;
  }
  return (
    <Box>
      <Box m="10px">
        {/* IMAGE */}
        
        <Grid
  container
  justifyContent="center" // Center items horizontally
  alignItems="center" // Center items vertically
  style={{ marginBottom: "10px" }}
>
  <Grid
    item
    xs={12} // Typically ranges from 1 to 12
    md={12}
    style={{ display: 'flex', justifyContent: 'center' }} // Center content within the item
  >
    {candidate.Texte_CV?.Images.map((image, index) => (
      <Box key={index} p="10px">
        <img
          src={`http://localhost:5000/images/${image}`}
          alt={`extracted-${index}`}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "20%", // Make the image circular
            objectFit: "cover",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)" // Add shadow effect
          }}
        />
      </Box>
    ))}
  </Grid>
</Grid>


        {/* TEXT */}
        <Typography
          variant="h3"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          {candidate.Email}
        </Typography>
        {/* GRID */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="100px"
          gap="5px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop="5px"
          >
            <StatBox
              title="Profile score"
              progress={`${candidate.Score / 100}`}
              increase={`${candidate.Score}%`}
              icon={
                <AccountCircleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Box>

        {/* Container */}
        <Container>
          {/* About Section */}
          <Box id="about" sx={{ mt: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} style={{ marginTop: "5px" }}>
                    <Card style={{ height: "100%", marginTop: "0" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Build
                            fontSize="large"
                            sx={{ color: "orange", marginRight: "10px" }}
                          />{" "}
                          {/* Changer la couleur et ajouter une marge à droite */}
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Compétences
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {candidate.Compétences}
                          <br />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} style={{ marginTop: "5px" }}>
                    <Card style={{ height: "100%", marginTop: "0" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <School
                            fontSize="large"
                            sx={{ color: "#8B0000", marginRight: "10px" }}
                          />{" "}
                          {/* Changer la couleur et ajouter une marge à droite */}
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Diplôme
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {candidate.Diplôme}
                          <br />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} style={{ marginTop: "5px",marginBottom:"20px" }}>
                    <Card style={{ height: "100%", marginTop: "0" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Language
                            fontSize="large"
                            sx={{ color: "black", marginRight: "10px" }}
                          />{" "}
                          {/* Changer la couleur et ajouter une marge à droite */}
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Langues
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {candidate.Langues}
                          <br />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} style={{ marginTop: "5px" ,marginBottom:"20px"}}>
                    <Card style={{ height: "100%", marginTop: "0" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ContactMail
                            fontSize="large"
                            sx={{ color: "#0077CC", marginRight: "10px" }}
                          />{" "}
                          {/* Petite icône d'email */}
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Contact
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{ marginRight: "40px" }}
                        >
                          <Email
                            fontSize="small"
                            sx={{ color: "red", marginRight: "5px" }}
                          />{" "}
                          {/* Petite icône d'email */}
                          {candidate.Email}
                        </Typography>
                        <Typography variant="body1">
                          <Phone
                            fontSize="small"
                            sx={{ color: "#2E8B57", marginRight: "5px" }}
                          />{" "}
                          {/* Petite icône de téléphone */}
                          {candidate.Tel}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
