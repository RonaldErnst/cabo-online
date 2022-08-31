import { Player } from "@common/types/models/player.model";
import socketIO from "app";

function sendMessage(player: Player, message: string) {
	if (player.room === null)
		throw new Error(
			"Player has not joined any room yet. Cannot send message"
		); // TODO proper Error

	const room = player.room;
	const roomId = room.roomId;
	socketIO.in(roomId).emit("CHAT", message, player.playerId);
}

export { sendMessage };
