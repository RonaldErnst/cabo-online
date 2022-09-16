import { IClientSocket } from "@types";
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
} from "react";
import settings from "settings.frontend";
import { io, ManagerOptions, SocketOptions } from "socket.io-client";

function connectSocket(addr: string) {
	const socketOptions: Partial<ManagerOptions & SocketOptions> = {
		transports: ["websocket", "polling"],
	};

	const newSocket = io(addr, socketOptions);
	return newSocket;
}

const socket = connectSocket(settings.socketServer);

const SocketContext = createContext<IClientSocket>(socket);

export function useSocket() {
	const ctx = useContext(SocketContext);

	// if(ctx === null)
	//     throw new Error("Socket Context not initialized yet");

	return ctx;
}

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
	const connErrorListener = useCallback((err: Error) => {
		console.log("Couldn't connect:", err);
	}, []);

	const disconnectListener = useCallback((reason: string) => {
		console.log("Disconnecting:", reason);
	}, []);

	useEffect(() => {
		socket.on("connect_error", connErrorListener);
		socket.on("disconnect", disconnectListener);

		return () => {
			socket.off("connect_error", connErrorListener);
			socket.off("disconnect", disconnectListener);
		};
	}, [connErrorListener, disconnectListener]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};
