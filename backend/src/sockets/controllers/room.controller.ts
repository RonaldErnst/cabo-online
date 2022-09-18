import { RoomClientServerEvent } from "@common/types/sockets/";
import { ChangeRoomSetting } from "@common/types/sockets/room";
import {
	createAndAddPlayer,
	getExistingPlayer,
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
	// Players get created here
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
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
}

function handleLeaveRoom(socket: IServerSocket) {
	const player = getExistingPlayer(socket.id)
		.andThen((player) => leaveRoom(player))
		.match(
			(room) => {
				console.log(`Player ${socket.id} left room ${room.roomId}`);

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
	const player = getExistingPlayer(socket.id)
		.andThen((player) => changeRoomSetting(player, setting))
		.match(
			(room) => {
				socketIO
					.in(room.roomId)
					.emit("ROOM", {
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
			default:
				socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Room Event",
				});
		}
	};
}
