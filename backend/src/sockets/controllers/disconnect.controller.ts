import { getPlayer } from "@services/player.service";
import { IServerSocket } from "@types";
import { handleLeaveRoom } from "./room.controller";

export default function handleDisconnectEvents(socket: IServerSocket) {
	return (reason: string) => {
        // Disconnect has to be treated as leaving
        // Leave the room, if player was in a room
        const player = getPlayer(socket.id);

        if(player !== undefined)
            handleLeaveRoom(socket);

		console.log(
			`Player ${socket.id} is trying to disconnect`,
			`Reason: ${reason}`
		);
	};
}
