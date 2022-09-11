import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import { err, ok, Result } from "neverthrow";

function sendMessage(player: Player, message: string): Result<string, IError> {
	if (player.room === null)
		return err({
			type: "NoRoomChatError",
			message: `Player has not joined a room yet. Cannot send message`,
		});

	const room = player.room;
	const roomId = room.roomId;

	return ok(roomId);
}

export { sendMessage };
