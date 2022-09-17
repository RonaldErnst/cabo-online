import { Player } from "@common/types/models/player.model";
import { RoomClientServerEvent } from "@common/types/sockets/";
import { createAndAddRoom, joinRoom, leaveRoom } from "@services/rooms.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformPlayerClientData from "utils/transformPlayerClientData";
import transformRoomClientData from "utils/transformRoomClientData";

function handleCreateRoom(
	player: Player,
	socket: IServerSocket,
	roomId: string
) {
	createAndAddRoom(roomId).match(
		(room) => {
			console.log(
				`Player ${player.playerId} created room ${room.roomId}`
			);

			// Room just got created, add creating player as host
			room.host = player;
			// Tell all connected players about the new room
			socketIO.emit("ROOM", {
				type: "CREATE_ROOM",
				room: transformRoomClientData(room),
			});
		},
		(err) => {
			console.log(err);
			socket.emit("ERROR", err);
		}
	);
}

function handleJoinRoom(
	player: Player,
	socket: IServerSocket,
	roomId: string,
	password: string | null
) {
	joinRoom(roomId, password, player).match(
		(room) => {
			console.log(`Player ${player.playerId} joined room ${room.roomId}`);

			socketIO.in(roomId).emit("ROOM", {
				type: "JOIN_ROOM",
				player: transformPlayerClientData(player),
				roomId,
			});
		},
		(err) => {
			console.log(err);
			socket.emit("ERROR", err);
		}
	);
}

function handleLeaveRoom(player: Player, socket: IServerSocket) {
	leaveRoom(player).match(
		(roomId) => {
			console.log(`Player ${player.playerId} left room ${roomId}`);

			socketIO.in(roomId).emit("ROOM", {
				type: "LEAVE_ROOM",
				playerId: player.playerId,
                roomId: roomId
			});
		},
		(err) => {
			console.log(err);
			socket.emit("ERROR", err);
		}
	);
}

export default function handleRoomEvents(player: Player, socket: IServerSocket) {
	return (roomEvent: RoomClientServerEvent) => {
		switch (roomEvent.type) {
			case "CREATE_ROOM":
				handleCreateRoom(player, socket, roomEvent.roomId);
				break;
			case "LEAVE_ROOM":
				handleLeaveRoom(player, socket);
				break;
			case "JOIN_ROOM":
				handleJoinRoom(
					player,
					socket,
					roomEvent.roomId,
					roomEvent.password
				);
				break;
			default:
				socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Room Event",
				});
		}
	};
}
