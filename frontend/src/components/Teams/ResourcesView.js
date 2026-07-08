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

const loveConversion = [
  { qty: 1, discount: "5%" },
  { qty: 2, discount: "7.50%" },
  { qty: 3, discount: "10%" },
  { qty: 4, discount: "12.50%" },
  { qty: 5, discount: "15%" },
  { qty: 6, discount: "16.50%" },
  { qty: 7, discount: "18%" },
  { qty: 8, discount: "19.50%" },
  { qty: 9, discount: "21%" },
  { qty: 10, discount: "22.50%" },
  { qty: 11, discount: "24%" },
  { qty: 12, discount: "25.50%" },
  { qty: 13, discount: "27%" },
  { qty: 14, discount: "28.50%" },
  { qty: 15, discount: "30%" },
];

const LOVE_GROUPS_PER_ROW = 4;
const loveConversionRows = [];
for (let i = 0; i < loveConversion.length; i += LOVE_GROUPS_PER_ROW) {
  loveConversionRows.push(loveConversion.slice(i, i + LOVE_GROUPS_PER_ROW));
}

const ResourcesView = () => {
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
      

  const updatePrices = async () => {
    // console.log(resources);
    // console.log(1);
    // const payload = { resources: resources };
    await axios.post("/resource");
  };

  useEffect(() => {
    // getResourcesQuan();
    getResources();
    const update = setInterval(() => {
      // getResourcesQuan();
      getResources();
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
                Resources Trading View
              </Typography>
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


            <Box sx={{ marginTop: "40px" }}>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontWeight: 500,
                  marginBottom: "10px",
                  userSelect: "none",
                }}
              >
                總召的愛
              </Typography>
              <TableContainer>
                <Table size="small" aria-label="love conversion table">
                  <TableHead>
                    <TableRow>
                      {Array.from({ length: LOVE_GROUPS_PER_ROW }).map(
                        (_, groupIndex) => (
                          <React.Fragment key={groupIndex}>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5 }}
                              style={{ fontWeight: 800, userSelect: "none" }}
                            >
                              持有數量
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                py: 0.5,
                                borderRight:
                                  groupIndex < LOVE_GROUPS_PER_ROW - 1
                                    ? "1px solid rgba(0,0,0,0.12)"
                                    : "none",
                              }}
                              style={{ fontWeight: 800, userSelect: "none" }}
                            >
                              過路費減免量
                            </TableCell>
                          </React.Fragment>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loveConversionRows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Array.from({ length: LOVE_GROUPS_PER_ROW }).map(
                          (_, groupIndex) => {
                            const item = row[groupIndex];
                            return (
                              <React.Fragment key={groupIndex}>
                                <TableCell
                                  align="center"
                                  sx={{ py: 0.5 }}
                                  style={{ userSelect: "none" }}
                                >
                                  {item ? item.qty : ""}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    py: 0.5,
                                    borderRight:
                                      groupIndex < LOVE_GROUPS_PER_ROW - 1
                                        ? "1px solid rgba(0,0,0,0.12)"
                                        : "none",
                                  }}
                                  style={{ userSelect: "none" }}
                                >
                                  {item ? item.discount : ""}
                                </TableCell>
                              </React.Fragment>
                            );
                          }
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        
      </>
    );
  };

export default ResourcesView;
