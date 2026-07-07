import React, { useContext, useState, useEffect } from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { socket } from "../websocket";
import RoleContext from "./useRole";

const BroadcastAlert = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});
  const [queue, setQueue] = useState([]);
  const { role, roleId, setPhase } = useContext(RoleContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
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
      viewerLevel || Number(String(role).match(/(?:team|第)(\d{1,2})/i)?.[1]);
    const broadcastLevel = currentTeamId || viewerLevel;

    const handleBroadcast = (args) => {
      // console.log(args.level, roleId);
      // console.log(args);
      const isTargeted = args.targetTeamId !== undefined;
      const shouldShow = isTargeted
        ? currentTeamId === Number(args.targetTeamId)
        : broadcastLevel >= Number(args.level || 0);

      if (shouldShow) {
        setQueue((messages) => [...messages, args]);
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
      setQueue((messages) => [
        ...messages,
        {
          title: `Phase Changed to ${phase}`,
          description: "",
        },
      ]);
      setPhase(phase);
      console.log("phase", phase);
    };

    socket.on("broadcast", handleBroadcast);
    socket.on("phase", handlePhase);

    return () => {
      socket.off("broadcast", handleBroadcast);
      socket.off("phase", handlePhase);
    };
  }, [role, roleId, setPhase]);

  const broadcastType = (level) => {
    console.log(level);
    if (level === null || level === undefined) return "info";
    else if (level >= 100) return "error";
    else if (level >= 10) return "warning";
    else return "info";
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      sx={{ marginTop: 15 }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        sx={{ width: "100%" }}
        severity={broadcastType(message.level)}
        elevation={6}
        variant="filled"
      >
        <AlertTitle>{String(message.title)}</AlertTitle>
        {String(message.description)} <br />
        {String(message.note || "")}
      </Alert>
    </Snackbar>
  );
};

export default BroadcastAlert;
