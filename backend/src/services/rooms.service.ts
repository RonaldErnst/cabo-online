import { IError, RoomError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import {
	Room,
	RoomEventData,
	RoomOptions,
} from "@common/types/models/room.model";
import socketIO from "app";
import { err, ok, Result } from "neverthrow";

const rooms = new Map<string, Room>();

function existsRoom(roomId: string) {
	return rooms.has(roomId);
}

function addRoom(room: Room) {
	rooms.set(room.roomId, room);
}

function getRoom(roomId: string) {
	return rooms.get(roomId);
}

function createAndAddRoom(
	roomId: string,
	options: RoomOptions = {
		isPrivate: false,
		maxPlayerCount: 10,
		password: null,
	}
): Result<Room, IError> {
	if (existsRoom(roomId))
		return err({
			type: "RoomAlreadyExistsError",
			message: `Room ${roomId} already exists`,
		});

	const room: Room = {
		roomId,
		host: null,
		playerSockets: new Array(),
		options,
	};

	addRoom(room);

	// Tell all connected players about the new room
	socketIO.emit("CREATE_ROOM", {
		roomId,
		isPrivate: options.isPrivate,
		maxPlayerCount: options.maxPlayerCount,
		currPlayerCount: 0,
	});

	return ok(room);
}

function joinRoom(roomId: string, player: Player): Result<null, IError> {
	const room = getRoom(roomId);
	if (room === undefined)
		return err({
			type: "UnknownRoomError",
			message: `Room ${roomId} does not exist`,
		});

	room.playerSockets.push(player);
	player.socket.join(roomId);
	player.room = room;

	// Tell all players in room that a new person joined
	const roomEventData: RoomEventData = {
		roomId,
		isPrivate: room.options.isPrivate,
		maxPlayerCount: room.options.maxPlayerCount,
		currPlayerCount: room.playerSockets.length,
	};
	socketIO.in(roomId).emit("JOIN_ROOM", player.playerId, roomEventData);

	return ok(null);
}

export { createAndAddRoom, joinRoom };
