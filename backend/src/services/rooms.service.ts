import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import { Room, RoomOptions } from "@common/types/models/room.model";
import { err, ok, Result } from "neverthrow";
import settings from "settings.backend";

const rooms = new Map<string, Room>();

//const cleanRoomsInterval = setInterval(cleanRooms, settings.cleanRoomsInterval);

// Mock data
rooms.set("test123", {
	host: null,
	players: [],
	roomId: "test123",
	options: {
		isPrivate: false,
		maxPlayerCount: 4,
		password: null,
	},
});
rooms.set("anotherRoom", {
	host: null,
	players: [],
	roomId: "anotherRoom",
	options: {
		isPrivate: true,
		maxPlayerCount: 5,
		password: "password",
	},
});

function cleanRooms() {
	const idsForDeletion: string[] = [];
	rooms.forEach((room, roomId) => {
		if (room.players.length === 0) idsForDeletion.push(roomId);
	});

	idsForDeletion.forEach((id) => rooms.delete(id));
}

function existsRoom(roomId: string) {
	return rooms.has(roomId);
}

function addRoom(room: Room) {
	rooms.set(room.roomId, room);
}

function getRoom(roomId: string) {
	return rooms.get(roomId);
}

function getAllRooms() {
	return Array.from(rooms.values());
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
		players: new Array(),
		options,
	};

	addRoom(room);

	return ok(room);
}

function joinRoom(
	roomId: string,
	password: string | null,
	player: Player
): Result<Room, IError> {
	const room = getRoom(roomId);
	if (room === undefined)
		return err({
			type: "UnknownRoomError",
			message: `Room ${roomId} does not exist`,
		});

	if (player.room === room)
		return err({
			type: "AlreadyInRoomError",
			message: `Player is already in a room`,
		});

	if (room.options.isPrivate && password != room.options.password)
		return err({
			type: "WrongPasswordRoomError",
			message: `Password does not match`,
		});

	room.players.push(player);
	player.socket.join(roomId);
	player.room = room;

	return ok(room);
}

function leaveRoom(player: Player): Result<string, IError> {
	const room = player.room;

	if (room === null)
		return err({
			type: "PlayerNotInRoomError",
			message: `Player is not in any room`,
		});

	room.players = room.players.filter((p) => p != player);
	player.room = null;
	player.socket.leave(room.roomId);

	if (settings.removeEmptyRoom && room.players.length === 0)
		rooms.delete(room.roomId);

	return ok(room.roomId);
}

function checkPassword(
	roomId: string,
	password: string
): Result<boolean, IError> {
	const room = getRoom(roomId);

	if (room === undefined)
		return err({ type: "UnknownRoomError", message: "Room not found" });

	if (!room.options.isPrivate)
		return err({
			type: "NotPrivateRoomError",
			message: "Room is not private",
		});

	if (room.options.password != password)
		return err({
			type: "WrongPasswordRoomError",
			message: "Wrong password",
		});

	return ok(true);
}

export {
	createAndAddRoom,
	joinRoom,
	getRoom,
	getAllRooms,
	leaveRoom,
	checkPassword,
};
