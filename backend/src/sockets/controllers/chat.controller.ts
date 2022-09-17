import { ChatMessage } from "@common/types/models/chat.models";
import { Player } from "@common/types/models/player.model";
import { ChatClientServerEvent } from "@common/types/sockets";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformPlayerClientData from "utils/transformPlayerClientData";

function handleChatMessage(
	player: Player,
	socket: IServerSocket,
	message: string
) {
	if (player.room !== null) {
		socketIO.in(player.room.roomId).emit("CHAT", {
			type: "MESSAGE",
			message: {
                text: message,
                isSystemMessage: false,
                player: transformPlayerClientData(player)
            },
		});
	} else {
		socket.emit("ERROR", {
			type: "PlayerNotInRoomError",
			message: "Player is not in any room. Cannot send message",
		});
	}
}

export default function handleChatEvents(
	player: Player,
	socket: IServerSocket
) {
	return (chatEvent: ChatClientServerEvent) => {
		switch (chatEvent.type) {
			case "MESSAGE":
				handleChatMessage(player, socket, chatEvent.message);
				break;
			default:
				socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Chat Event",
				});
		}
	};
}
