import { handleChatEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerChatEvents(
	socket: IServerSocket
) {
	socket.on("CHAT", handleChatEvents(socket));
}
