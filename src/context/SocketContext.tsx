import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  console.log("socket context", socket);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(`:${3000}`, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
      console.log();

      setSocket(newSocket); // Update the context with the connected socket
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextProps => useContext(SocketContext);
