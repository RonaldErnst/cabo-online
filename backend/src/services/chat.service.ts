import { Player } from "@common/types/models/player.model";
import socketIO from "app";
import { NoRoomChatError, ChatError } from "@common/types/errors";
import { Result, ok, err } from "neverthrow";

function sendMessage(player: Player, message: string): Result<null, ChatError> {
	if (player.room === null) return err(new NoRoomChatError());

	const room = player.room;
	const roomId = room.roomId;
	socketIO.in(roomId).emit("CHAT", message, player.playerId);

	return ok(null);
}

export { sendMessage };
