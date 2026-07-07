import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StyleIcon from "@mui/icons-material/Style";
import axios from "../axios";
import RoleContext from "../useRole";
import TeamSelect from "../TeamSelect";

const cards = [
  { value: "Cooz", label: "我的褲子裡有松鼠" },
  { value: "Hey", label: "黑道小弟" },
  { value: "Ayi", label: "阿姨我不想努力了" },
  { value: "GeGon", label: "擱供" },
  { value: "Jeff", label: "劫富濟貧" },
  { value: "Ala", label: "阿拉花瓜" },
];

const teamLabel = (id) => (id ? `第${id}小隊` : "");

const Card = () => {
  const [card, setCard] = useState("");
  const [owner, setOwner] = useState(-1);
  const [target, setTarget] = useState(-1);
  const [amount, setAmount] = useState("");
  const [building, setBuilding] = useState(-1);
  const [lands, setLands] = useState([]);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { roleId, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const selectedCard = cards.find((item) => item.value === card);
  const needsTarget = card === "Hey";
  const needsAmount = card === "Ayi";
  const needsBuilding = card === "GeGon" || card === "Ala";

  const buildingOptions = useMemo(() => {
    return lands.filter((land) => {
      if (
        land.type !== "Building" &&
        land.type !== "SpecialBuilding"
      ) {
        return false;
      }
      if (land.owner === 0) return false;
      if (owner !== -1 && land.owner === owner) return false;
      if (card === "Ala") return land.level > 1;
      return true;
    });
  }, [lands, card, owner]);

  const canPreview = () => {
    if (!card || owner === -1) return false;
    if (needsTarget && target === -1) return false;
    if (needsAmount && (!amount || parseInt(amount, 10) <= 0)) return false;
    if (needsBuilding && building === -1) return false;
    return true;
  };

  const fetchPreview = async () => {
    try {
      const { data } = await axios.post("/card/preview", {
        card,
        owner,
        target,
        amount,
        building,
      });
      setPreview(data);
      setErrorMessage("");
      if (!needsAmount) setAmount(String(data.amount || 0));
      if (data.target) setTarget(data.target.id);
    } catch (error) {
      setPreview(null);
      setErrorMessage(error.response?.data?.error || "Preview failed");
    }
  };

  const handleSubmit = async () => {
    await axios.post("/card", {
      card,
      owner,
      target,
      amount,
      building,
    });
    if (card === "Ala") {
      navigate("/properties?id=" + building);
      setNavBarId(3);
    } else {
      navigate("/teams");
      setNavBarId(2);
    }
  };

  useEffect(() => {
    if (roleId < 50) {
      navigate("/permission");
      setNavBarId(0);
    }
  }, [roleId, navigate, setNavBarId]);

  useEffect(() => {
    const fetchLands = async () => {
      const { data } = await axios.get("/land");
      setLands(data);
    };
    fetchLands();
  }, []);

  useEffect(() => {
    setPreview(null);
    setErrorMessage("");
    if (card !== "Ayi") setAmount("");
    if (card !== "Hey") setTarget(-1);
    if (card !== "GeGon" && card !== "Ala") setBuilding(-1);
  }, [card]);

  useEffect(() => {
    if (canPreview()) {
      fetchPreview();
    } else {
      setPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, owner, target, amount, building]);

  const handleAmount = (value) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      setAmount(value);
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a valid number");
    }
  };

  const Preview = () => {
    if (!preview) return null;
    const targets = preview.transfers
      ? preview.transfers.map((transfer) => transfer.target)
      : preview.target
      ? [preview.target]
      : [];

    return (
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
        <TableContainer component={Paper}>
          <Table aria-label="card-preview" size="small">
            <TableBody>
              <TableRow>
                <TableCell>Card</TableCell>
                <TableCell align="right">{preview.cardName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Owner</TableCell>
                <TableCell align="right">{teamLabel(preview.owner.id)}</TableCell>
              </TableRow>
              {targets.length > 0 ? (
                <TableRow>
                  <TableCell>Target</TableCell>
                  <TableCell align="right">
                    {targets.map((item) => teamLabel(item.id)).join(", ")}
                  </TableCell>
                </TableRow>
              ) : null}
              {preview.building ? (
                <TableRow>
                  <TableCell>Building</TableCell>
                  <TableCell align="right">{preview.building.name}</TableCell>
                </TableRow>
              ) : null}
              {preview.rent ? (
                <TableRow>
                  <TableCell>Rent</TableCell>
                  <TableCell align="right">{preview.rent}</TableCell>
                </TableRow>
              ) : null}
              {preview.newLevel !== undefined ? (
                <TableRow>
                  <TableCell>Level</TableCell>
                  <TableCell align="right">
                    {preview.building.level} &gt;&gt; {preview.newLevel}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">{preview.amount}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

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
        <Typography component="h1" variant="h5" sx={{ marginBottom: 1 }}>
          Card
        </Typography>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl variant="standard" fullWidth>
            <InputLabel id="card" shrink>
              Card
            </InputLabel>
            <Select
              value={card}
              labelId="card"
              onChange={(e) => setCard(e.target.value)}
            >
              <MenuItem value="">Select Card</MenuItem>
              {cards.map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <TeamSelect
              label="Owner"
              team={owner}
              handleTeam={setOwner}
              hasZero={false}
              shrink
            />
          </FormControl>

          {needsTarget ? (
            <FormControl variant="standard" fullWidth>
              <TeamSelect
                label="Target"
                team={target}
                handleTeam={setTarget}
                hasZero={false}
                shrink
              />
            </FormControl>
          ) : null}

          {needsBuilding ? (
            <FormControl variant="standard" fullWidth>
              <InputLabel id="building" shrink>
                Building
              </InputLabel>
              <Select
                value={building}
                labelId="building"
                onChange={(e) => setBuilding(e.target.value)}
              >
                <MenuItem value={-1}>Select Building</MenuItem>
                {buildingOptions.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.id} {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          {selectedCard ? (
            <TextField
              label="Amount"
              value={amount}
              disabled={!needsAmount}
              onChange={(e) => handleAmount(e.target.value)}
              helperText={errorMessage}
              FormHelperTextProps={{ error: true }}
              fullWidth
            />
          ) : null}

          <Button
            variant="contained"
            disabled={!preview || Boolean(errorMessage)}
            onClick={handleSubmit}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            <StyleIcon sx={{ marginRight: 1 }} />
            <SendIcon />
          </Button>
        </Box>
        <Preview />
      </Box>
    </Container>
  );
};

export default Card;
