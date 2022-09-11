import { ClientServerEvents, ServerClientEvents } from "@common/types/sockets";
import { Socket as ClientSocket } from "socket.io-client";
export type IClientSocket = ClientSocket<
	ServerClientEvents,
	ClientServerEvents
>;