import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import socketIO from "app";
import { err, ok, Result } from "neverthrow";

function sendMessage(player: Player, message: string): Result<null, IError> {
	if (player.room === null)
		return err({
			type: "NoRoomChatError",
			message: `Player has not joined a room yet. Cannot send message`,
		});

	const room = player.room;
	const roomId = room.roomId;
	socketIO.in(roomId).emit("CHAT", message, player.playerId);

	return ok(null);
}

export { sendMessage };
