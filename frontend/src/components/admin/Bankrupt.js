import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import RoleContext from "../useRole";
import Shop2Icon from "@mui/icons-material/Shop2";
import TeamSelect from "../TeamSelect";
import axios from "../axios";

const Bankrupt = () => {
  const [team, setTeam] = useState(-1);
  const [building, setBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState({});
  const [teamData, setTeamData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const getPropertyValue = (land) => {
    return land.price.buy + land.price.upgrade * (land.level - 1);
  };

  const resetPreview = () => {
    setBuildingData({});
    setTeamData(null);
    setPreview(null);
    setErrorMessage("");
  };

  const handleTeam = (selectedTeam) => {
    setTeam(selectedTeam);
    setBuilding(-1);
    resetPreview();
  };

  const handleBuilding = async (selectedBuilding) => {
    setBuilding(selectedBuilding);
    resetPreview();

    if (selectedBuilding === -1 || team === -1) return;

    try {
      const [{ data: land }, { data: selectedTeam }] = await Promise.all([
        axios.get("/land/" + selectedBuilding),
        axios.get("/team/" + team),
      ]);
      const propertyValue = getPropertyValue(land);
      const soldOutPrice = Math.round(propertyValue * 0.5);
      const before = Math.round(selectedTeam.money);

      setBuildingData(land);
      setTeamData(selectedTeam);
      setPreview({
        propertyValue,
        soldOutPrice,
        before,
        after: before + soldOutPrice,
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Preview failed");
    }
  };

  const handleSoldOut = async () => {
    const payload = { id: team, building: building };
    await axios.post("/soldout", payload);
    navigate("/properties?id=" + buildingData.id);
    setNavBarId(3);
  };

  useEffect(() => {
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 9,
          marginBottom: 9,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 0 }}>
          Bankrupt
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect
            label="Team"
            team={team}
            handleTeam={handleTeam}
            hasZero={false}
          />
        </FormControl>
        <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
          <InputLabel id="building">Building</InputLabel>
          <Select
            value={building}
            labelId="building"
            onChange={(e) => {
              handleBuilding(e.target.value);
            }}
          >
            <MenuItem value={-1}>Select Building</MenuItem>
            {filteredBuildings.map((item) =>
              item.owner === team ? (
                <MenuItem value={item.id} key={item.id}>
                  {item.id} {item.name}
                </MenuItem>
              ) : null
            )}
          </Select>
          <Button
            variant="contained"
            disabled={building === -1 || team === -1 || !preview}
            onClick={handleSoldOut}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            <Shop2Icon />
          </Button>
        </FormControl>
        {preview ? (
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6">Preview</Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: 1, textAlign: "center" }}
            >
              {buildingData.id} {buildingData.name} / 第{teamData.id}小隊
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="bankrupt-preview" size="small">
                <TableBody>
                  <TableRow>
                    <TableCell align="center">Property Value</TableCell>
                    <TableCell align="center">
                      {preview.propertyValue}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Sold Price</TableCell>
                    <TableCell align="center">
                      +{preview.soldOutPrice}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Team Before</TableCell>
                    <TableCell align="center">{preview.before}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Team After</TableCell>
                    <TableCell align="center">{preview.after}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
        {errorMessage ? (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {errorMessage}
          </Typography>
        ) : null}
      </Box>
    </Container>
  );
};

export default Bankrupt;
