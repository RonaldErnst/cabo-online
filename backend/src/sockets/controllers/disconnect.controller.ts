import { IServerSocket } from "@types";
import { handleLeaveRoom } from "./room.controller";

export default function handleDisconnectEvents(socket: IServerSocket) {
	return (reason: string) => {
        // Disconnect has to be treated as leaving
        // Leave the room
        handleLeaveRoom(socket);

		console.log(
			`Player ${socket.id} is trying to disconnect`,
			`Reason: ${reason}`
		);
	};
}
