
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer } from "socket.io"
import { Server } from "socket.io"

export const config = {
  api: {
    bodyParser: false,
  },
}

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}
export default function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    res.status(200).json({ success: true, message: "Socket is already running", socket: `:${3000 + 1}` })
    return
  }

  res.setHeader('Cache-Control', 'no-store');
  console.log("Starting Socket.IO server on port:", 3000 + 1)
  const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } }).listen(3000 + 1)

  io.on("connect", socket => {
    const _socket = socket
    console.log("socket connect", socket.id)
    _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`)

    socket.on("message", (message) => {
      console.log(`Message received: ${message}`);
      const response = { id: socket.id, message };
      io.emit("message", response); // Broadcast to all clients
    });

    socket.on("disconnect", async () => {
      console.log("socket disconnect")
    })
  })

  res.socket.server.io = io
  res.status(201).json({ success: true, message: "Socket is started", socket: `:${3000 + 1}` })
}

