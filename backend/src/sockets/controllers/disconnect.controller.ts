import { Player } from "@common/types/models/player.model";
import { leaveRoom } from "@services/rooms.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformRoomClientData from "utils/transformRoomClientData";

export default function handleDisconnectEvents(
	player: Player,
	socket: IServerSocket
) {
	return (reason: string) => {
		// Leave room if player was in room
		if (player.room !== null) {
			leaveRoom(player).match(
				(room) => {
					console.log(
						`Player ${player.playerId} left room ${room.roomId}`
					);

					socketIO.emit("ROOM", {
						type: "CHANGE_ROOM",
						room: transformRoomClientData(room),
					});
				},
				(err) => {
					console.log(err);
					socket.emit("ERROR", err);
				}
			);
		}

		// TODO: handle Errors
		console.log(
			`Player ${player.playerId} is trying to disconnect`,
			`Reason: ${reason}`
		);
	};
}
