import { handleErrorEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerErrorEvents(
	socket: IServerSocket
) {
	socket.on("error", handleErrorEvents(socket));
}
