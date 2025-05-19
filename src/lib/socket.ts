import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = () => {
  console.log("io function:", io); // Debug log
  if (!socket && typeof window !== "undefined") {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    console.log("Socket initialized:", socket); // Debug log
  }
  return socket;
};