import React, { useState, useEffect, useContext } from "react";
import {
  Stack,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "./Loading";
import axios from "./axios";
import RoleContext from "./useRole";
import { socket } from "../websocket";

const Notifications = () => {
  const [eventMessage, setEventMessage] = useState({});
  const [cardMessages, setCardMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const { roleId, setUnreadCount } = useContext(RoleContext);

  const fetchEvent = async () => {
    const { data } = await axios.get("/event");
    if (data !== null) setEventMessage(data);
  };

  const fetchCardMessages = async () => {
    const { data } = await axios.get("/broadcast");
    setCardMessages(data.filter((item) => item.category === "card"));
  };

  const addCardMessage = (message) => {
    setCardMessages((messages) => {
      if (messages.some((item) => item.createdAt === message.createdAt)) {
        return messages;
      }
      return [message, ...messages];
    });
  };

  const canSeeCardMessage = (item) => {
    const viewerId = Number(roleId) || 0;
    if (viewerId === 100) return true;
    if (item.targetTeamId !== undefined && item.targetTeamId !== null) {
      return viewerId === Number(item.targetTeamId);
    }
    return viewerId >= Number(item.level || 0);
  };

  const handleDelete = async (createdAt) => {
    await axios
      .delete(`/broadcast/${createdAt}`)
      .then(() => {
        setCardMessages((messages) =>
          messages.filter((item) => item.createdAt !== createdAt)
        );
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  useEffect(() => {
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }

    setUnreadCount(0);
    localStorage.setItem("notifLastSeen", String(Date.now()));

    fetchEvent();
    fetchCardMessages();

    const handleBroadcast = (message) => {
      if (message.category === "card") addCardMessage(message);
    };

    socket.on("broadcast", handleBroadcast);

    const interval = setInterval(async () => {
      await fetchEvent();
      await fetchCardMessages();
    }, 15000);
    return () => {
      clearInterval(interval);
      socket.off("broadcast", handleBroadcast);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (eventMessage.title === undefined) {
    return <Loading />;
  }

  const visibleCardMessages = cardMessages.filter(canSeeCardMessage);

  return (
    <Container component="main" maxWidth="xs">
      <Stack
        spacing={2}
        sx={{
          maxWidth: 700,
          marginTop: "70px",
          marginLeft: "20px",
          marginRight: "20px",
          marginBottom: 10,
        }}
      >
        <Box>
          <Typography component="h1" variant="h6" sx={{ marginBottom: 1 }}>
            Event
          </Typography>
          <Card
            sx={{
              backgroundColor: "rgb(60,60,60)",
              color: "rgb(255,255,255)",
            }}
          >
            <CardContent>
              <Typography variant="h6">
                事件：{eventMessage ? eventMessage.title : "無"}
              </Typography>
              <Typography variant="body2">{eventMessage.description}</Typography>
              <Typography variant="body2">{eventMessage.note}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Typography component="h2" variant="h6" sx={{ marginBottom: 1 }}>
            Card
          </Typography>
          <Stack spacing={1}>
            {visibleCardMessages.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    目前沒有卡片通知
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              visibleCardMessages.map((item) => (
                <Alert
                  key={item._id || item.createdAt}
                  severity="info"
                  elevation={3}
                  action={
                    <IconButton
                      aria-label="delete card notification"
                      color="inherit"
                      size="small"
                      onClick={() => handleDelete(item.createdAt)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <AlertTitle>{String(item.title)}</AlertTitle>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {String(item.description)}
                  </Typography>
                  {item.note ? (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", whiteSpace: "pre-line" }}
                    >
                      {String(item.note)}
                    </Typography>
                  ) : null}
                  <Typography variant="caption" sx={{ display: "block" }}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Typography>
                </Alert>
              ))
            )}
          </Stack>
        </Box>
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        sx={{ marginBottom: 10 }}
      >
        <Alert severity="success" variant="filled">
          Successfully deleted
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Notifications;
