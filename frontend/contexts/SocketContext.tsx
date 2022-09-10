import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { ServerClientEvents, ClientServerEvents } from "@common/types/sockets";
import settings from "settings.frontend";

interface ISocketProvider {
  socket: Socket<ServerClientEvents, ClientServerEvents> | null;
}

const SocketContext = createContext<ISocketProvider | null>(null);

export function useSocket() {
  const ctx = useContext(SocketContext);

  if (ctx === null) throw new Error("Socket context not initialized"); // TODO proper Error

  return ctx;
}

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<
    ServerClientEvents,
    ClientServerEvents
  > | null>(null);

  useEffect(() => {
    if (socket === null) {
      const serverAddr = `http://localhost:${settings.wsPort}`;
      const socketOptions: Partial<ManagerOptions & SocketOptions> = {
        transports: ["websocket", "polling"],
      };

      const newSocket = io(serverAddr, socketOptions);
      setSocket(newSocket);
    }

    return () => {
      if (socket !== null) socket.close();
    };
  }, [socket]);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
