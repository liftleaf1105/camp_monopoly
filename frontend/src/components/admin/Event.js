import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  Box,
  Button,
  FormControl,
  Alert,
} from "@mui/material";
import Loading from "../Loading";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const Event = () => {
  const [event, setEvent] = useState("");
  const [message, setMessage] = useState("");
  const [APIResponse, setAPIResponse] = useState("");
  const [events, setEvents] = useState([]);
  const [jailTeams, setJailTeams] = useState([-1, -1, -1]);
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  const selectedEvent = events.find((item) => item.id === event);
  const selectedJailTeams = jailTeams.filter((team) => team !== -1);
  const hasDuplicateJailTeam =
    selectedJailTeams.length !== new Set(selectedJailTeams).size;
  const needsJailTeams = event === 2;
  const canSubmit =
    event !== "" &&
    (!needsJailTeams ||
      (selectedJailTeams.length === 3 && !hasDuplicateJailTeam));

  const handleClick = async () => {
    const payload = needsJailTeams
      ? { id: event, targetTeamIds: jailTeams }
      : { id: event };

    await axios.post("/event", payload).then((res) => {
      setAPIResponse(res.data);
    });
    // navigate("/notifications");
  };

  const handleJailTeam = (index, team) => {
    setJailTeams((teams) =>
      teams.map((currentTeam, currentIndex) =>
        currentIndex === index ? team : currentTeam
      )
    );
  };

  useEffect(() => {
    if (!APIResponse) return undefined;
    const timer = setTimeout(() => setAPIResponse(""), 4000);
    return () => clearTimeout(timer);
  }, [APIResponse]);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
    }
    axios
      .get("/allEvents")
      .then((res) => {
        const playableEvents = res.data.filter((item) => item.id > 0);
        setEvents(playableEvents);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (events.length === 0) {
    return <Loading />;
  } else {
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
            Event Settings
          </Typography>
          <Box sx={{ minWidth: 250, marginTop: 2, width: "100%" }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="title">Title</InputLabel>
              <Select
                value={event}
                labelId="title"
                onChange={(e) => {
                  const eventId = e.target.value;
                  const nextEvent = events.find((item) => item.id === eventId);
                  setEvent(eventId);
                  setMessage(nextEvent ? nextEvent.description : "");
                  setJailTeams([-1, -1, -1]);
                  setAPIResponse("");
                }}
              >
                <MenuItem value="">Select Event</MenuItem>
                {events.map((item) => {
                  return (
                    <MenuItem value={item.id} key={item.id}>
                      {item.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              id="content"
              label="Content"
              multiline
              fullWidth
              sx={{ marginTop: 2, marginBottom: 2 }}
              variant="standard"
              value={message}
              InputProps={{ readOnly: true }}
            />
            {needsJailTeams && (
              <>
                {[0, 1, 2].map((index) => (
                  <FormControl
                    key={index}
                    variant="standard"
                    fullWidth
                    sx={{ marginTop: 1 }}
                  >
                    <TeamSelect
                      label={`Jail Team ${index + 1}`}
                      team={jailTeams[index]}
                      handleTeam={(team) => handleJailTeam(index, team)}
                    />
                  </FormControl>
                ))}
                {hasDuplicateJailTeam && (
                  <Alert severity="warning" sx={{ marginTop: 2 }}>
                    請選擇三個不同的小隊
                  </Alert>
                )}
              </>
            )}
            <Button
              disabled={!canSubmit || !selectedEvent}
              onClick={handleClick}
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </Box>
          {APIResponse && <Alert severity="info">{APIResponse}</Alert>}
        </Box>

        {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              sx={{ marginBottom: 1, width: 80 }}
              onClick={handleMoneyPercent}
            >
              money -30%
            </Button>

            <Button
              variant="contained"
              sx={{ marginBottom: 1, width: 80 }}
              onClick={handleResourcePercent}
            >
              Resource -50%
            </Button>
          </Box> */}
        {/* <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Phase Settings
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="title">Select Phase</InputLabel>
            <Select
              value={tempPhase}
              onChange={(e) => setTempPhase(e.target.value)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
            <Button onClick={handleClick2} sx={{ marginTop: 2 }}>
              Submit
            </Button>
          </FormControl>
        </Box> */}
      </Container>
    );
  }
};

export default Event;
