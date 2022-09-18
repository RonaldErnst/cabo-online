import { ChatClientServerEvent } from "@common/types/sockets";
import { getPlayer } from "@services/player.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformPlayerClientData from "utils/transformPlayerClientData";

function handleChatMessage(socket: IServerSocket, message: string) {
	const player = getPlayer(socket.id);

	if (player === undefined) {
		// Player not found, most likely not in any room
		socket.emit("ERROR", {
			type: "UnknownPlayerError",
			message: "Player unknown",
		});
		return;
	} else if (player.room === null) {
        // Player not in any room
		socket.emit("ERROR", {
			type: "PlayerNotInRoomError",
			message: "Player is not in any room. Cannot send message",
		});
		return;
	}

	socketIO.in(player.room.roomId).emit("CHAT", {
		type: "MESSAGE",
		message: {
			text: message,
			isSystemMessage: false,
			player: transformPlayerClientData(player),
		},
	});
}

export default function handleChatEvents(socket: IServerSocket) {
	return (chatEvent: ChatClientServerEvent) => {
		switch (chatEvent.type) {
			case "MESSAGE":
				handleChatMessage(socket, chatEvent.message);
				break;
			default:
				socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Chat Event",
				});
		}
	};
}
