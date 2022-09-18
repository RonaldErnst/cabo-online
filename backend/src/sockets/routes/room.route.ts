import { handleRoomEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerRoomEvents(socket: IServerSocket) {
	socket.on("ROOM", handleRoomEvents(socket));
}
