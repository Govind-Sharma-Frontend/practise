import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ id: string; message: string }[]>(
    []
  );

  useEffect(() => {
    socket = io(`:${3000 + 1}`, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("message", (data) => {
      console.log("Message received from server:", data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      try {
        const res = await fetch("http://localhost:3000/api/socket"); // Adjust the URL to match the Socket.IO server's actual URL.
        // const res = await fetch(
        //   "https://govind-practise.vercel.app/api/socket"
        // );

        console.log("res Socket", await res.json());
      } catch (fetchError) {
        console.log("Error fetching socket status:", fetchError);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("message", message); // Emit message to server
      setMessage(""); // Clear input
    }
  };

  return (
    <div>
      <div>
        <h2>Chat</h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            height: "300px",
            overflowY: "scroll",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.id}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}
