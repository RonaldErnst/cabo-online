import { Player } from "@common/types/models/player.model";
import { createAndAddRoom, joinRoom, leaveRoom } from "@services/rooms.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformRoomClientData from "utils/transformRoomClientData";

function handleCreateRoom(player: Player, socket: IServerSocket) {
	return (roomId: string) => {
		createAndAddRoom(roomId).match(
			(room) => {
                console.log(`Player ${player.playerId} created room ${room.roomId}`);

				// Room just got created, add creating player as host
				room.host = player;
				// Tell all connected players about the new room
				socketIO.emit("CREATE_ROOM", transformRoomClientData(room));
			},
			(err) => {
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
	};
}

function handleJoinRoom(player: Player, socket: IServerSocket) {
	return (roomId: string, password: string | null) => {
		joinRoom(roomId, password, player).match(
			(room) => {
                console.log(`Player ${player.playerId} joined room ${room.roomId}`);

				socketIO
					.in(roomId)
					.emit(
						"JOIN_ROOM",
						player.playerId
					);
			},
			(err) => {
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
	};
}

function handleLeaveRoom(player: Player, socket: IServerSocket) {
	return () => {
		leaveRoom(player).match(
			(room) => {
                console.log(`Player ${player.playerId} left room ${room.roomId}`);

				socketIO.in(room.roomId).emit("LEAVE_ROOM", player.playerId);
			},
			(err) => {
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
	};
}

export { handleCreateRoom, handleJoinRoom, handleLeaveRoom };
