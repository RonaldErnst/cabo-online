import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
    useEffect
} from "react";
import { io, ManagerOptions, SocketOptions } from "socket.io-client";
import settings from "settings.frontend";
import { IClientSocket } from "@types";

interface IServerSocketProvider {
	socket: IClientSocket;
}

function connectSocket(addr: string) {
	const socketOptions: Partial<ManagerOptions & SocketOptions> = {
		transports: ["websocket", "polling"],
	};

	const newSocket = io(addr, socketOptions);
	return newSocket;
}

const socket: IClientSocket = connectSocket(settings.socketServer);

const SocketContext = createContext<IServerSocketProvider>({
	socket,
});

export function useSocket() {
	const ctx = useContext(SocketContext);
	return ctx;
}

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {

    const connErrorListener = useCallback(
        (err: Error) => {
            console.log("Couldn't connect:", err);
        },
      [],
    )

    const disconnectListener = useCallback(
        (reason: string) => {
            console.log("Disconnecting:", reason);
        },
      [],
    )

    useEffect(() => {
      socket.on("connect_error", connErrorListener);
      socket.on("disconnect", disconnectListener)
    
      return () => {
        socket.off("connect_error", connErrorListener);
        socket.off("disconnect", disconnectListener)
      }
    }, [connErrorListener, disconnectListener])
    

	const value = {
		socket,
	};

	return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	);
};
