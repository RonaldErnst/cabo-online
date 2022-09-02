import { createContext, FC, PropsWithChildren, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { ServerClientEvents, ClientServerEvents } from "@common/types/sockets";
import settings from "settings.frontend";

interface ISocketProvider {
	//socket: Socket<ServerClientEvents, ClientServerEvents>;
}

const SocketContext = createContext<ISocketProvider | null>(null);

export function useSocket() {
	const ctx = useContext(SocketContext);

	if (ctx === null) throw new Error("Socket context not initialized"); // TODO proper Error

	return ctx;
}

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
	

	const value = {
	};

	return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	);
};
