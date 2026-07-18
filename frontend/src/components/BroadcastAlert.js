import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  Dialog,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { socket } from "../websocket";
import RoleContext from "./useRole";

const isFullscreenMessage = (msg) => Boolean(msg?.fullscreen);

const BroadcastAlert = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});
  const [queue, setQueue] = useState([]);
  const openRef = useRef(open);
  const messageRef = useRef(message);
  const { role, roleId, setPhase, setUnreadCount } = useContext(RoleContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  useEffect(() => {
    if (!open && queue.length > 0) {
      setMessage(queue[0]);
      setQueue((messages) => messages.slice(1));
      setOpen(true);
    }
  }, [open, queue]);

  useEffect(() => {
    const viewerLevel = Number(roleId) || 0;
    const currentTeamId =
      viewerLevel ||
      Number(String(role).match(/(?:team|第)(\d{1,2})/i)?.[1]);
    const broadcastLevel = currentTeamId || viewerLevel;

    const enqueue = (msg) => {
      if (isFullscreenMessage(msg)) {
        const activeMessage = messageRef.current;

        if (openRef.current && isFullscreenMessage(activeMessage)) {
          setQueue((messages) => [msg, ...messages]);
        } else {
          if (openRef.current) {
            setQueue((messages) => [activeMessage, ...messages]);
          }
          setMessage(msg);
          setOpen(true);
        }

        setUnreadCount((count) => count + 1);
        return;
      }

      setQueue((messages) => [...messages, msg]);
    };

    const handleBroadcast = (args) => {
      const isTargeted = args.targetTeamId !== undefined;
      const shouldShow = isTargeted
        ? currentTeamId === Number(args.targetTeamId)
        : broadcastLevel >= Number(args.level || 0);

      if (shouldShow) {
        enqueue(args);
        console.log("broadcast", args);
      } else {
        console.log("broadcast ignored", {
          role,
          roleId,
          currentTeamId,
          broadcastLevel,
          message: args,
        });
      }
    };

    const handlePhase = (phase) => {
      enqueue({
        title: `Phase Changed to ${phase}`,
        description: "",
      });
      setPhase(phase);
      console.log("phase", phase);
    };

    socket.on("broadcast", handleBroadcast);
    socket.on("phase", handlePhase);

    return () => {
      socket.off("broadcast", handleBroadcast);
      socket.off("phase", handlePhase);
    };
  }, [role, roleId, setPhase, setUnreadCount]);

  const severity = (level) => {
    if (level === null || level === undefined) return "info";
    else if (level >= 100) return "error";
    else if (level >= 10) return "warning";
    else return "info";
  };

  const accentColor = (level) => {
    if (level === null || level === undefined) return "#5A4638";
    else if (level >= 100) return "#f44336";
    else if (level >= 10) return "#C98345";
    else return "#5A4638";
  };

  if (message.fullscreen) {
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        sx={(theme) => ({ zIndex: theme.zIndex.snackbar + 10 })}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          },
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            textAlign: "center",
            maxWidth: 640,
            width: "100%",
            borderTop: `6px solid ${accentColor(message.level)}`,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.06)",
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, wordBreak: "break-word" }}
          >
            {String(message.title || "")}
          </Typography>
          {message.description ? (
            <Typography variant="h6" sx={{ mb: 1, wordBreak: "break-word" }}>
              {String(message.description)}
            </Typography>
          ) : null}
          {message.note ? (
            <Typography variant="body1" sx={{ opacity: 0.85 }}>
              {String(message.note)}
            </Typography>
          ) : null}
        </Box>
      </Dialog>
    );
  }

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ top: { xs: 72, md: 80 } }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={severity(message.level)}
        variant="filled"
        sx={{ width: "100%", maxWidth: 600, alignItems: "center" }}
      >
        {message.title ? (
          <AlertTitle sx={{ fontWeight: 700, mb: message.description ? 0.5 : 0 }}>
            {String(message.title)}
          </AlertTitle>
        ) : null}
        {message.description ? String(message.description) : null}
        {message.note ? (
          <div style={{ opacity: 0.85, fontSize: "0.85rem" }}>
            {String(message.note)}
          </div>
        ) : null}
      </Alert>
    </Snackbar>
  );
};

export default BroadcastAlert;
