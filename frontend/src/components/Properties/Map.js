import React, { useContext, useEffect } from "react";
import { Box, Typography, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RoleContext from "../useRole";
import axios from "../axios";
import PropertyCard from "./PropertyCard";

// Board layout on an 11-row x 12-column grid. Each id maps to [row, col].
// Perimeter is filled clockwise from the top-left corner (42).
const CELL_POSITIONS = {
  42: [1, 1],
  1: [1, 2],
  2: [1, 3],
  3: [1, 4],
  4: [1, 5],
  5: [1, 6],
  6: [1, 7],
  7: [1, 8],
  8: [1, 9],
  9: [1, 10],
  10: [1, 11],
  11: [1, 12],
  12: [2, 12],
  13: [3, 12],
  14: [4, 12],
  15: [5, 12],
  16: [6, 12],
  17: [7, 12],
  18: [8, 12],
  19: [9, 12],
  20: [10, 12],
  21: [11, 12],
  22: [11, 11],
  23: [11, 10],
  24: [11, 9],
  25: [11, 8],
  26: [11, 7],
  27: [11, 6],
  28: [11, 5],
  29: [11, 4],
  30: [11, 3],
  31: [11, 2],
  32: [11, 1],
  33: [10, 1],
  34: [9, 1],
  35: [8, 1],
  36: [7, 1],
  37: [6, 1],
  38: [5, 1],
  39: [4, 1],
  40: [3, 1],
  41: [2, 1],
};

const Map = () => {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up("md"));
  const { buildings, setBuildings } = useContext(RoleContext);

  useEffect(() => {
    if (!isWide) return undefined;
    const getProperties = async () => {
      try {
        const res = await axios.get("/land");
        setBuildings(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getProperties();
    const timer = setInterval(getProperties, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWide]);

  // Mobile: keep the original static images.
  if (!isWide) {
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
        >
          <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
            Game Map
          </Typography>
          <img
            src="/EEmap.JPG"
            alt="Map"
            style={{ maxWidth: "100%", userSelect: "none" }}
          />
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
  }

  // Wide: render an interactive board where each cell is a button.
  const byId = {};
  buildings.forEach((building) => {
    byId[building.id] = building;
  });

  const cells = Object.entries(CELL_POSITIONS).map(([idStr, [row, col]]) => {
    const id = Number(idStr);
    const building = byId[id];
    if (!building) {
      return (
        <Box
          key={id}
          sx={{
            gridColumn: col,
            gridRow: row,
            aspectRatio: "1 / 1",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: 1,
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {id}
          </Typography>
        </Box>
      );
    }
    return (
      <PropertyCard
        key={id}
        {...building}
        variant="map"
        gridRow={row}
        gridColumn={col}
      />
    );
  });

  return (
    <Container sx={{ marginTop: 9, marginBottom: 12 }}>
      <Typography
        component="h1"
        variant="h5"
        align="center"
        sx={{ marginBottom: 3 }}
      >
        Game Map
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 0.75,
          width: "100%",
          maxWidth: 1000,
          margin: "auto",
        }}
      >
        {cells}
      </Box>
    </Container>
  );
};

export default Map;
