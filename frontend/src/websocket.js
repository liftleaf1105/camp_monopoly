// import React from "react";
import io from "socket.io-client";
// import { usedispatch } from "react-redux";

const defaultWSURL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:2022";

export const socket = io(process.env.REACT_APP_WS_URL || defaultWSURL);
// export const SocketContext = React.createContext(socket);

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log("disconnect");
});
