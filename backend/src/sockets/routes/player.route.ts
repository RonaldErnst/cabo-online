import { handlePlayerEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerPlayerEvents(
	socket: IServerSocket
) {
	socket.on("PLAYER", handlePlayerEvents(socket));
}
