import { Player } from "@common/types/models/player.model";
import { sendMessage } from "@services/chat.service";
import { IServerSocket } from "@types";
import socketIO from "app";

function handleChatMessage(player: Player, socket: IServerSocket) {
	return (message: string) => {
		sendMessage(player, message).match(
			(roomId) => {
				socketIO.in(roomId).emit("CHAT", message, player.playerId);
			},
			(err) => socket.emit("ERROR", err)
		);
	};
}

export { handleChatMessage };
