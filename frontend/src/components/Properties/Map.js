import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Map = () => {
  return (
    <Container>
      <Box
        sx={{
          marginTop: 9,
          marginBottom: 9,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >5
        
        <img
          src="/B1.jpg"
          alt="Map"
          style={{ maxWidth: "100%", userSelect: "none" }}
        />
        <img
          src="/2F.jpg"
          alt="Map"
          style={{ maxWidth: "100%", userSelect: "none" }}
        />
      </Box>
    </Container>
  );
};

export default Map;
