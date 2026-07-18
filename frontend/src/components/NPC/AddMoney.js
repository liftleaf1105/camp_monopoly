import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  Paper,
  Grid,
  TableBody,
  FormHelperText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AddIcon from "@mui/icons-material/Add";
import axios from "../axios";
// import navigate from "../navigate";
import RoleContext from "../useRole";
import TeamSelect from "../TeamSelect";

const AddMoney = () => {
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState({});
  const [newData, setNewData] = useState(0);

  const [amount, setAmount] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");

  const [building, setBuilding] = useState(-1);
  const [price, setPrice] = useState({});
  const [buildingOwner, setBuildingOwner] = useState(0);
  const [purchaseMode, setPurchaseMode] = useState(null);
  const [purchaseError, setPurchaseError] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleTeam = async (team) => {
    setPurchaseMode(null);
    setPurchaseError("");
    if (amount !== "-" && amount !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    const { data } = await axios.get("/team/" + team);
    // console.log(data);
    setTeamData(data);
    setTeam(team);
  };

  const handleAmount = async (amount) => {
    if (amount !== "-" && amount !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    setAmount(amount);
  };

  const handleBuilding = async (building) => {
    if (building > 0) {
      const { data } = await axios.get("/land/" + building);
      setBuilding(building);
      setPrice(data.price);
      setBuildingOwner(data.owner);
    } else {
      setBuilding(-1);
      setPrice({});
      setBuildingOwner(0);
    }
    setPurchaseMode(null);
    setPurchaseError("");
    // console.log(data);
  };

  const handleCard = async (number) => {
    if (number === 0) {
      // 小隊現金*1.5，最多30000
      setAmount(teamData.money * 0.5 > 30000 ? 30000 : teamData.money * 0.5);
    } else if (number === 1) {
      // 強制拍賣地產，賣得的錢七三分，地主七
      const payload = { building: building };
      const { data } = await axios.post("/goldenFruit", payload);
      console.log(data);
      handleAmount(
        Math.round(
          (data.land[0].price.buy +
            data.land[0].price.upgrade * (data.level - 1)) *
            0.03
        ) * 10
      );
      navigate("/teams");
      setNavBarId(2);
    } else if (number === 2) {
      // 全部損失5000
      await axios.post("/tape");
      navigate("/teams");
      setNavBarId(2);
    } else if (number === 3) {
      // 搶走錢最後一名的隨機一棟房子
      const payload = { id: team };
      const { data } = await axios.post("/rob", payload);
      console.log(data);
      if (data.building) navigate("/properties?id=" + data.building);
      else navigate("/properties");
      setNavBarId(3);
    } else if (number === 4) {
      // 與金錢榜前一名小隊平分金錢
      const payload = { id: team };
      await axios.post("/equility", payload);
      navigate("/teams");
      setNavBarId(2);
    }
  };

  const handlePercentMoney = async (percent) => {
    handleAmount(Math.round(amount * (1 + percent)));
  };

  const handlePreview = async () => {
    const { data } = await axios.get("/add", {
      params: { id: team, dollar: amount },
    });
    setNewData(data.money);
  };

  const handleSubmit = async () => {
    const payload = {
      id: team,
      teamname: `第${team}小隊`,
      dollar: parseInt(amount) ? parseInt(amount) : 0,
    };
    await axios.post("/add", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  const handlePurchaseProperty = async () => {
    try {
      await axios.post("/purchaseProperty", {
        teamId: team,
        landId: building,
        mode: purchaseMode,
      });
      navigate("/properties?id=" + building);
      setNavBarId(3);
    } catch (error) {
      setPurchaseError(
        error.response?.data?.message || "Unable to complete property purchase"
      );
    }
  };

  const selectPropertyPurchase = (mode, cost) => {
    setPurchaseMode(mode);
    setPurchaseError("");
    handleAmount(String(-cost));
  };

  const SimpleMoneyButton = ({ val }) => {
    return (
      <Button
        variant="contained"
        disabled={team === -1}
        sx={{ marginBottom: 1, width: 80 }}
        onClick={() => {
          setPurchaseMode(null);
          setPurchaseError("");
          if (!amount) {
            handleAmount(val);
          } else {
            handleAmount(parseInt(amount) + val);
          }
        }}
      >
        {val > 0 ? "+" : ""}
        {val}
      </Button>
    );
  };

  useEffect(() => {
    if (roleId < 10) {
      navigate("/permission");
      setNavBarId(0);
    }
    // axios
    //   .get("/team")
    //   .then((res) => {
    //     setTeams(res.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (team !== -1 && amount !== 0) {
      handlePreview();
    }
  }, [team, amount]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasBuildingOwner = Number(buildingOwner) > 0;
  const selectedTeamOwnsBuilding =
    team !== -1 &&
    Number(team) === Number(buildingOwner);
  const selectedTeamBlockedByOwner =
    team !== -1 && hasBuildingOwner && !selectedTeamOwnsBuilding;
  const canUpgrade =
    team !== -1 &&
    price.upgrade &&
    selectedTeamOwnsBuilding &&
    Number(teamData.money) >= Number(price.upgrade);
  const canBuy =
    team !== -1 &&
    price.buy &&
    !hasBuildingOwner &&
    Number(teamData.money) >= Number(price.buy);
  const propertyCost =
    purchaseMode === "Buy" ? Number(price.buy) : Number(price.upgrade);
  const canPurchaseProperty =
    team !== -1 &&
    building !== -1 &&
    ["Buy", "Upgrade"].includes(purchaseMode) &&
    Number(teamData.money) >= propertyCost;
  const visiblePropertyCost = !hasBuildingOwner
    ? Number(price.buy)
    : selectedTeamOwnsBuilding
    ? Number(price.upgrade)
    : NaN;
  const hasInsufficientPropertyFunds =
    team !== -1 &&
    Number.isFinite(visiblePropertyCost) &&
    Number(teamData.money) < visiblePropertyCost;

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
          Add Money
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect
            label="Team"
            team={team}
            handleTeam={handleTeam}
            hasZero={false}
          />

          <TextField
            required
            label="Amount"
            id="amount"
            value={amount}
            sx={{ marginTop: 2, marginBottom: 1 }}
            onChange={(e) => {
              const re = /^-?[0-9\b]+$/;
              if (
                e.target.value === "-" ||
                e.target.value === "" ||
                re.test(e.target.value)
              ) {
                if (Math.abs(parseInt(e.target.value)) > 1000000) {
                  setErrorMessage("Too Large");
                } else {
                  setPurchaseMode(null);
                  setPurchaseError("");
                  handleAmount(e.target.value ? e.target.value : "");
                  setErrorMessage("");
                }
              } else {
                setErrorMessage("Please enter a valid number");
              }
            }}
            helperText={errorMessage}
            FormHelperTextProps={{ error: true }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SimpleMoneyButton val={+100} />
            <SimpleMoneyButton val={+1000} />
            <SimpleMoneyButton val={+5000} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SimpleMoneyButton val={-100} />
            <SimpleMoneyButton val={-1000} />
            <SimpleMoneyButton val={-5000} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              disabled={!canBuy}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => {
                selectPropertyPurchase("Buy", price.buy);
              }}
            >
              Buy
            </Button>
            <Button
              variant="contained"
              disabled={!canUpgrade}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => {
                selectPropertyPurchase("Upgrade", price.upgrade);
              }}
            >
              Upgrade
            </Button>
          </Box>
          {selectedTeamBlockedByOwner ? (
            <FormHelperText error={true}>
              此地已有地主，只有第{buildingOwner}小隊可以升級。
            </FormHelperText>
          ) : null}
          {hasInsufficientPropertyFunds ? (
            <FormHelperText error={true}>
              Insufficient money to buy or upgrade this property.
            </FormHelperText>
          ) : null}
          {purchaseError ? (
            <FormHelperText error={true}>{purchaseError}</FormHelperText>
          ) : null}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              disabled={team === -1 || amount === 0}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => handlePercentMoney(-0.2)}
            >
              -20%
            </Button>
            <Button
              variant="contained"
              disabled={team === -1 || amount === 0}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => handlePercentMoney(0.5)}
            >
              +50%
            </Button>
            <Button
              variant="contained"
              disabled={team === -1 || amount === 0}
              sx={{ marginBottom: 1, width: 80 }}
              onClick={() => handlePercentMoney(1)}
            >
              +100%
            </Button>
          </Box> */}
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Button
                  variant="contained"
                  disabled={team === -1 || amount === ""}
                  onClick={handleSubmit}
                  fullWidth
                >
                  <SendIcon />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Button
                  variant="contained"
                  disabled={!canPurchaseProperty}
                  onClick={handlePurchaseProperty}
                  fullWidth
                >
                  <SendIcon />
                  <AddIcon />
                  <RequestQuoteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </FormControl>
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h6" sx={{ marginBottom: 0 }}>
            Query Price
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 0 }}>
            <InputLabel id="building">Building</InputLabel>
            <Select
              value={building}
              labelId="building"
              onChange={(e) => {
                handleBuilding(e.target.value);
              }}
            >
              <MenuItem value={-1}>Select Building</MenuItem>
              {filteredBuildings.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.id} {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableBody>
                <TableRow>
                  <TableCell align="left">Buy</TableCell>
                  <TableCell align="right">
                    {price.buy !== null ? price.buy : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">Upgrade</TableCell>
                  <TableCell align="right">
                    {(price.upgrade !== null) !== 0 ? price.upgrade : ""}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {showPreview ? (
          <Box
            sx={{ marginTop: 2 }}
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Typography component="h1" variant="h6" sx={{ marginBottom: 1 }}>
              Preview
            </Typography>
            <Typography component="h2" variant="body2" sx={{ marginBottom: 1 }}>
              {teamData.money} &gt;&gt; {newData}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Container>
  );
};
export default AddMoney;
