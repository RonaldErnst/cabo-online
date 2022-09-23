import {
	ChangePlayerSetting,
	ChangeRoomSetting,
	RoomClientServerEvent,
} from "@common/types/sockets";
import {
	changePlayerSetting,
	createAndAddPlayer,
	getExistingPlayer,
	removePlayer,
} from "@services/player.service";
import {
	changeRoomSetting,
	createAndAddRoom,
	joinRoom,
	leaveRoom,
} from "@services/rooms.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformRoomClientData from "utils/transformRoomClientData";

function handleCreateRoom(socket: IServerSocket, roomId: string) {
	createAndAddRoom(roomId).match(
		(room) => {
			console.log(`Player ${socket.id} created room ${room.roomId}`);

			// Room just got created, add creating player as host
			room.host = socket.id;
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
	socket: IServerSocket,
	roomId: string,
	password: string | null
) {
	// Players have to be created here because of link invites
	createAndAddPlayer(socket)
		.andThen((player) => joinRoom(roomId, password, player))
		.match(
			(room) => {
				console.log(`Player ${socket.id} joined room ${roomId}`);

				socketIO.emit("ROOM", {
					type: "CHANGE_ROOM",
					room: transformRoomClientData(room),
				});
			},
			(err) => {
				// Something went wrong during player creation, delete player again
				removePlayer(socket.id);

				console.log(err);
				socket.emit("ERROR", err);
			}
		);
}

function handleLeaveRoom(socket: IServerSocket) {
	getExistingPlayer(socket.id)
		.andThen((player) =>
			leaveRoom(player).map((room) => ({ room, player }))
		)
		.match(
			({ room, player }) => {
				console.log(
					`Player ${player.playerId} left room ${room.roomId}`
				);

				// Players have to be removed since they only get created when joining
				// Players dont exist outside of rooms
				removePlayer(player.playerId);

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

function handleChangeRoomSetting(
	socket: IServerSocket,
	setting: ChangeRoomSetting
) {
	getExistingPlayer(socket.id)
		.andThen((player) => changeRoomSetting(player, setting))
		.match(
			(room) => {
				socketIO.in(room.roomId).emit("ROOM", {
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

function handleChangePlayerSetting(
	socket: IServerSocket,
	setting: ChangePlayerSetting
) {
	getExistingPlayer(socket.id)
		.andThen((player) => changePlayerSetting(player, setting))
		.match(
			(player) => {
				if (player.room !== null)
					socketIO.in(player.room.roomId).emit("ROOM", {
						type: "CHANGE_ROOM",
						room: transformRoomClientData(player.room),
					});
			},
			(err) => {
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
}

export default function handleRoomEvents(socket: IServerSocket) {
	return (roomEvent: RoomClientServerEvent) => {
		switch (roomEvent.type) {
			case "CREATE_ROOM":
				handleCreateRoom(socket, roomEvent.roomId);
				break;
			case "LEAVE_ROOM":
				handleLeaveRoom(socket);
				break;
			case "JOIN_ROOM":
				handleJoinRoom(socket, roomEvent.roomId, roomEvent.password);
				break;
			case "CHANGE_ROOM_SETTING":
				handleChangeRoomSetting(socket, roomEvent.setting);
				break;
			case "CHANGE_ROOM_PLAYER":
				handleChangePlayerSetting(socket, roomEvent.setting);
				break;
			default:
				socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Room Event",
				});
		}
	};
}
