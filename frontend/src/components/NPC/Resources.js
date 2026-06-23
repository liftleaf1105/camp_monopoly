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
} from "@mui/material";
import Loading from "../Loading";
import SendIcon from "@mui/icons-material/Send";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const Resources = () => {
  let flag = false;
  const [team, setTeam] = useState(-1);
  const [teamToCheckBalance, setTeamToCheckBalance] = useState(0);
  const [resourceToCheckQuan, setResourceToCheckQuan] = useState(0);
  const [mode, setMode] = useState(0);
  const [resourceId, setResourceId] = useState(-1);
  const [number, setNumber] = useState(0);
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

  const getCheck = async (team, resourceId) => {
    axios
      .get("/team/" + team)
      .then((res) => {
        setTeamToCheckBalance(res.data.money);

        if(resourceId == 0){
          setResourceToCheckQuan(res.data.resources.love);
          console.log(res.data.resources.love);
          console.log(resourceToCheckQuan);
        }else if(resourceId == 1){
          setResourceToCheckQuan(res.data.resources.eecoin);
        }

        console.log(resourceToCheckQuan);
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
      mode: mode, // 0 for sell, 1 for buy
    };

    console.log(payload);
    //check whether the trade is valid
    getCheck(team, resourceId);

    if(mode === 1){//buy
      if(teamToCheckBalance < resources[resourceId].price * number){
        alert("Not enough money to buy");
        return;
      }
    }else{//sell
      if(resourceToCheckQuan < number){
        alert("Not enough resource to sell");
        return;
      }
    }

    await axios.post("/sellResource", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  const handleTeam = (team) => {
    if (team === 0) {
      setNumber(0);
    }
    setTeam(team);
  };

  const updatePrices = async () => {
    // console.log(resources);
    // console.log(1);
    // const payload = { resources: resources };
    await axios.post("/resource");
  };

  useEffect(() => {
    // getResourcesQuan();
    getResources();
    getCheck(team, resourceId);
    const update = setInterval(() => {
      // getResourcesQuan();
      getResources();
      getCheck(team, resourceId);
      flag = !flag;
      if (flag) updatePrices();
      console.log("update");
    }, 80000);

    return () => clearInterval(update);
  }, []);

  return (
      <>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Resource Trading
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
                  <MenuItem value={0}>Sell</MenuItem>
                  <MenuItem value={1}>Buy</MenuItem>
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
                  type="text"
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
                  <SendIcon/>
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
                              ? resource.name
                              : column.id === "price"
                              ? resource.price
                              : null}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </TableContainer>


            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src="/love.jpg"
                alt="Map"
                style={{
                  maxWidth: "100%",
                  userSelect: "none",
                  marginTop: "20px",
                }}
              />
            </Box>
          </Paper>
        
      </>
    );
  };

export default Resources;
