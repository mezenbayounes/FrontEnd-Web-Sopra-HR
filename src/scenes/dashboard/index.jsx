import { Box } from "@mui/material";


const Dashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
     <video
  src="/assets/sopraVD.mp4" // Path relative to the 'public' folder
  autoPlay
  loop
  muted
  style={{
    width: "100%",
    height: "100%",
  }}
/>
    </Box>
  );
};

export default Dashboard;
