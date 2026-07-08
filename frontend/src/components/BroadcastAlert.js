import React, { useContext, useState, useEffect } from "react";
import { Dialog, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { socket } from "../websocket";
import RoleContext from "./useRole";

const BroadcastAlert = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});
  const [queue, setQueue] = useState([]);
  const { role, roleId, setPhase, setUnreadCount } = useContext(RoleContext);

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") return;
    setOpen(false);
  };

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
      setQueue((messages) => [...messages, msg]);
      setUnreadCount((count) => count + 1);
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

  const accentColor = (level) => {
    if (level === null || level === undefined) return "#2196f3";
    else if (level >= 100) return "#f44336";
    else if (level >= 10) return "#EFA53A";
    else return "#2196f3";
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
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
};

export default BroadcastAlert;
