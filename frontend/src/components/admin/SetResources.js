import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Container,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
  FormControl,
  Grid,
} from "@mui/material";
import Loading from "../Loading";
import SendIcon from "@mui/icons-material/Send";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const SetResources = () => {
  let flag = false;
  const [team, setTeam] = useState(-1);
  const [teamToCheckBalance, setTeamToCheckBalance] = useState(0);
  const [resourceToCheckQuan, setResourceToCheckQuan] = useState(0);
  const [mode, setMode] = useState(0);
  const [resourceId, setResourceId] = useState(-1);
  const [resourceIdPrice, setResourceIdPrice] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [number, setNumber] = useState(0);
  const [price, setPrice] = useState(0);
  const { roleId, teams, setTeams, setNavBarId, resources, setResources } =
    useContext(RoleContext); // eslint-disable-line no-unused-vars

  const navigate = useNavigate();

  const columns = [
    { id: "name", label: "Type", minWidth: "15vw", align: "center" },
    { id: "price", label: "Price", minWidth: "17vw", align: "center" },
  ];

  const getResources = async () => {
    axios
      .get("/resourceInfo")
      .then((res) => {
        setResources(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClick = async () => {
    const payload = {
      teamId: team,
      resourceId: resourceId,
      number: number,
      mode: mode, // 0 for -, 1 for +
    };

    await axios.post("/controlResource", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  const handleTeam = (team) => {
    if (team === 0) {
      setNumber(0);
    }
    setTeam(team);
  };

  const updatePrice = async () => {
    const payload = {
      resourceId: resourceIdPrice,
      price: price,
    }

    await axios.post("updateResourcePrice", payload);
    navigate("/resources");
  };

  const handlePrice = async (price) => {
    // if (price !== "-" && price !== "" && team !== -1) {
    //   setShowPreview(true);
    // } else {
    //   setShowPreview(false);
    // }
    setPrice(price);
  };

  useEffect(() => {
    getResources();
    const update = setInterval(() => {
      getResources();
    }, 80000);

    return () => clearInterval(update);
  }, []);

    return (
      <>
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Center the Boxes
            gap: "24px", // Add space between the Boxes
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Typography component="h1" variant="h5">
              Resource Control
            </Typography>

            <FormControl
              variant="standard"
              sx={{ minWidth: 250, marginTop: 2 }}
            >
              <TeamSelect
                label="Team"
                team={team}
                handleTeam={handleTeam}
                hasZero={false}
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ minWidth: 250, marginTop: 2 }}
            >
              <InputLabel id="resource">Resource</InputLabel>
              <Select
                value={resourceId}
                labelId="resource"
                onChange={(e) => {
                  setResourceId(e.target.value);
                }}
              >
                <MenuItem value={-1}>Select Resource</MenuItem>
                {resources.map((resource, index) => (
                  <MenuItem value={index} key={index}>
                    {resource.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ minWidth: 250, marginTop: 2 }}
            >
              <InputLabel id="mode">Mode</InputLabel>
              <Select
                value={mode}
                labelId="mode"
                onChange={(e) => {
                  setMode(e.target.value);
                }}
              >
                <MenuItem value={0}>-</MenuItem>
                <MenuItem value={1}>+</MenuItem>
              </Select>
            </FormControl>
            <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <TextField
                  required
                  label="enter the amount"
                  id="number"
                  // autoComplete="enter the number"
                  type="text"
                  // sx={{ marginTop: 1, marginBottom: 1 }}
                  autoFocus
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                />
              </FormControl>
            <FormControl
              variant="standard"
              sx={{ minWidth: 250, marginTop: 2 }}
            >
              <Button
                variant="contained"
                disabled={team === -1 || number === -1}
                onClick={handleClick}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                <SendIcon />
              </Button>
            </FormControl>
          </Box>

          {/* set Price */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Typography component="h1" variant="h5">
              Set Price
            </Typography>

            <FormControl
              variant="standard"
              sx={{ minWidth: 250, marginTop: 2 }}
            >
              <InputLabel id="resource">Resource</InputLabel>
              <Select
                value={resourceIdPrice}
                labelId="resourcePrice"
                onChange={(e) => {
                  setResourceIdPrice(e.target.value);
                }}
              >
                <MenuItem value={-1}>Select Resource</MenuItem>
                {resources.map((resource, index) => (
                  <MenuItem value={index} key={index}>
                    {resource.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ minWidth: 250 }}>
                <TextField
                  required
                  label="Price"
                  id="price"
                  value={price}
                  sx={{ marginTop: 2, marginBottom: 1 }}
                  onChange={(e) => {
                    const re = /^-?[0-9\b]+$/;
                    if (
                      e.target.value === "-" ||
                      e.target.value === "" ||
                      re.test(e.target.value)
                    ) {
                        handlePrice(e.target.value ? e.target.value : "");
                        setErrorMessage("");
                    } else {
                      setErrorMessage("Please enter a valid number");
                    }
                  }}
                  helperText={errorMessage}
                  FormHelperTextProps={{ error: true }}
                />
              </FormControl>

            <FormControl
              variant="standard"
              sx={{ minWidth: 250, marginTop: 2 }}
            >
              <Button
                variant="contained"
                disabled={resourceIdPrice === -1}
                onClick={updatePrice}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                <SendIcon />
              </Button>
            </FormControl>
          </Box>
        </Container>

        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            paddingTop: "60px",
            paddingBottom: "60px",
            marginLeft: "2vw",
            marginRight: "2vw",
          }}
        >
          <TableContainer
            sx={{
              maxHeight: 900,
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((item) => (
                    <TableCell
                      key={item.id}
                      align={item.align}
                      style={{
                        minWidth: item.minWidth,
                        fontWeight: "800",
                        userSelect: "none",
                      }}
                    >
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((resource, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ userSelect: "none" }}
                      >
                        {column.id === "name"
                          ? resource.name // Assuming resourceName is aligned with resourcesQuan by index
                          : column.id === "price"
                          ? resource.price // Assuming resourcePrice is aligned with resourcesQuan by index // Use the value from resourceQuan directly
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </>
    );
};

export default SetResources;
