import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RoleContext from "../useRole";
import axios from "../axios";

const GameBonus = () => {
  const [bonusInput, setBonusInput] = useState("1");
  const [currentBonus, setCurrentBonus] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [submitting, setSubmitting] = useState(false);
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  const loadGameBonus = async () => {
    try {
      const { data } = await axios.get("/gameBonus");
      setCurrentBonus(data.value);
      setBonusInput(String(data.value));
    } catch (error) {
      setMessageType("error");
      setMessage("Unable to load the game bonus.");
    }
  };

  const saveGameBonus = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      const { data } = await axios.put("/gameBonus", {
        value: Number(bonusInput),
      });
      setCurrentBonus(data.value);
      setBonusInput(String(data.value));
      setMessageType("success");
      setMessage("Game bonus updated.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Unable to update the game bonus.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
      return;
    }
    loadGameBonus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
          Game Bonus
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          sx={{ color: "gray", marginTop: 1, textAlign: "center" }}
        >
          Current game bonus: {currentBonus}
        </Typography>
        <TextField
          fullWidth
          label="Game Bonus"
          type="number"
          inputProps={{ min: 0.1, max: 10, step: 0.1 }}
          sx={{ marginTop: 2 }}
          value={bonusInput}
          onChange={(event) => setBonusInput(event.target.value)}
        />
        <Button
          variant="contained"
          onClick={saveGameBonus}
          disabled={submitting}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          <SaveIcon sx={{ marginRight: 1 }} />
          Save Game Bonus
        </Button>
        {message ? (
          <Alert severity={messageType} sx={{ marginTop: 2, width: "100%" }}>
            {message}
          </Alert>
        ) : null}
      </Box>
    </Container>
  );
};

export default GameBonus;
