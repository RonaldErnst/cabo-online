import {
	ClientServerEvents,
	ServerClientEvents,
	ServerServerEvents,
	SocketData,
} from "@common/types/sockets";
import { Server, Socket } from "socket.io";

export type IServer = Server<
	ClientServerEvents,
	ServerClientEvents,
	ServerServerEvents,
	SocketData
>;
export type IServerSocket = Socket<
	ClientServerEvents,
	ServerClientEvents,
	ServerServerEvents,
	SocketData
>;