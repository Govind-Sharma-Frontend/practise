// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export default function Chat() {
//   const [message, setMessage] = useState<string>("");
//   const [messages, setMessages] = useState<{ id: string; message: string }[]>(
//     []
//   );

//   console.log("messages", messages);

//   useEffect(() => {
//     socket = io(`:${3000 + 1}`, {
//       path: "/api/socket",
//       addTrailingSlash: false,
//     });
//     socket.on("connect", () => {
//       console.log("Connected");
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected");
//     });

//     socket.on("message", (data) => {
//       console.log("Message received from server:", data);
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("connect_error", async (err) => {
//       console.log(`connect_error due to ${err.message}`);
//       try {
//         const res = await fetch("http://localhost:3000/api/socket"); // Adjust the URL to match the Socket.IO server's actual URL.
//         // const res = await fetch(
//         //   "https://govind-practise.vercel.app/api/socket"
//         // );

//         console.log("res Socket", await res.json());
//       } catch (fetchError) {
//         console.log("Error fetching socket status:", fetchError);
//       }
//     });

//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   const sendMessage = () => {
//     console.log("s", socket);
//     if (socket && message.trim()) {
//       socket.emit("message", message); // Emit message to server
//       setMessage(""); // Clear input
//     }
//   };

//   return (
//     <div>
//       <div>
//         <h2>Chat</h2>
//         <div
//           style={{
//             border: "1px solid #ddd",
//             padding: "10px",
//             height: "300px",
//             overflowY: "scroll",
//           }}
//         >
//           {messages.map((msg, index) => (
//             <div key={index}>
//               <strong>{msg.id}:</strong> {msg.message}
//             </div>
//           ))}
//         </div>
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message..."
//         style={{ width: "80%" }}
//       />
//       <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
//         Send
//       </button>
//     </div>
//   );
// }
import { useSocket } from "@/context";
import { useState, useEffect } from "react";

interface Message {
  from: string;
  message: string;
}

const Chat: React.FC = () => {
  const { socket } = useSocket();
  const [recipientId, setRecipientId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log("socket", socket);
    if (!socket) return;

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket?.off("receive_message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && recipientId && message) {
      socket.emit("private_message", { to: recipientId, message });
      setMessages((prev) => [...prev, { from: "Me", message }]);
      setMessage("");
    }
  };

  return (
    <>
      <h1>Personal Chat</h1>
      <input
        type="text"
        placeholder="Recipient ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
        style={{ marginBottom: "10px", display: "block" }}
      />
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: "10px", display: "block" }}
      />
      <button onClick={sendMessage}>Send</button>

      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
