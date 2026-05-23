import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

    // شغال أونلاين ولوكال بذكاء وبدون أخطاء
    const socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join", user.id || user._id);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("newNotification", (data) => {
      setLiveAlerts((prev) =>
        [{ ...data, id: Date.now() }, ...prev].slice(0, 20),
      );
    });

    return () => {
      if (socketRef.current) {
        socket.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
    };
  }, [user]);

  const clearAlert = (id) =>
    setLiveAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connected, liveAlerts, clearAlert }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
