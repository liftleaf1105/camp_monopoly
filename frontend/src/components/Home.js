import React from "react";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        mt: { xs: "56px", md: "64px" },
        height: { xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)" },
        px: 2,
        pb: { xs: 2, md: "72px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src="/visual2026.jpg"
        alt="EE Camp 2026"
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          userSelect: "none",
          borderRadius: 1,
        }}
      />
    </Box>
  );
};

export default Home;
