import { io } from "socket.io-client";

export default function Chat() {
  const socket = io(`:${3000 + 1}`, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  socket.on("connect", () => {
    console.log("Connected");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("connect_error", async (err) => {
    console.log(`connect_error due to ${err.message}`);
    const res = await fetch("/api/socket");

    console.log("res", res);
  });

  return <div>hello</div>;
}
