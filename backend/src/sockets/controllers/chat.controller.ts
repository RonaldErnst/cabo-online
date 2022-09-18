import { ChatClientServerEvent } from "@common/types/sockets";
import { getExistingPlayer } from "@services/player.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformPlayerClientData from "utils/transformPlayerClientData";

function handleChatMessage(socket: IServerSocket, message: string) {
	getExistingPlayer(socket.id).match(
		(player) => {
			if (player.room === null) {
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
		},
		(err) => {
			console.log(err);
			socket.emit("ERROR", err);
		}
	);
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
