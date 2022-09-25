import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import { Room, RoomSettings } from "@common/types/models/room.model";
import { ChangeRoomSetting } from "@common/types/sockets";
import socketIO from "app";
import { err, ok, Result } from "neverthrow";
import settings from "settings.backend";

/**
 * Rooms Map
 *
 * Maps a roomId to a room
 */
const rooms = new Map<string, Room>();

/**
 * Create Interval for periodic room cleanup
 */
const cleanRoomsInterval = setInterval(cleanRooms, settings.cleanRoomsInterval);

// Mock data
rooms.set("test123", {
	host: null,
	players: [],
	roomId: "test123",
	isPrivate: false,
	maxPlayerCount: 4,
	password: null,
});
rooms.set("anotherRoom", {
	host: null,
	players: [],
	roomId: "anotherRoom",
	isPrivate: true,
	maxPlayerCount: 5,
	password: "password",
});

/**
 * Function to clean up all currently existing rooms
 *
 * All dirty rooms get cleaned up.
 * A room is dirty when it still exists in the rooms map
 * but has no connected players
 */
function cleanRooms() {
	// Clean rooms if settings allows it
	if (!settings.removeEmptyRoom) return;

	const idsForDeletion: string[] = [];
	rooms.forEach((room, roomId) => {
		if (room.players.length === 0) idsForDeletion.push(roomId);
	});

	idsForDeletion.forEach((id) => {
		rooms.delete(id);
		socketIO.emit("ROOM", {
			type: "DELETE_ROOM",
			roomId: id,
		});
	});
}

function getDefaultRoomSettings(): RoomSettings {
	return {
		isPrivate: false,
		maxPlayerCount: 10,
		password: null,
	};
}

/**
 * Checks if a given room exists
 * @param roomId
 * @returns true if the room exists
 */
function existsRoom(roomId: string) {
	return rooms.has(roomId);
}

/**
 * Adds a given room to the room map
 * @param room
 */
function addRoom(room: Room) {
	rooms.set(room.roomId, room);
}

/**
 * @param roomId
 * @returns Room Object to a given roomId if it exists
 */
function getRoom(roomId: string) {
	return rooms.get(roomId);
}

/**
 * Delete a given room
 * @param roomId 
 * @returns true if the room was successfully deleted
 */
function deleteRoom(roomId: string) {
    return rooms.delete(roomId);
}

/**
 * @returns Array of all currently available rooms
 */
function getAllRooms() {
	return Array.from(rooms.values());
}

/**
 * Helper function to create and add a room to the rooms map
 * @param roomId
 * @param options
 * @returns newly created Room object
 */
function createAndAddRoom(
	roomId: string,
	options: RoomSettings = getDefaultRoomSettings()
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
		...options,
	};

	addRoom(room);

	return ok(room);
}

/**
 * Helper function to let a given player join a given room
 * @param roomId
 * @param password
 * @param player
 */
function joinRoom(
	roomId: string,
	password: string | null,
	player: Player
): Result<Room, IError> {
	const room = getRoom(roomId);

	if (room === undefined)
		return err({ type: "UnknownRoomError", message: "Room not found" });

	if (player.room === room)
		return err({
			type: "AlreadyInRoomError",
			message: `Player is already in a room`,
		});

	if (room.isPrivate && password !== room.password)
		return err({
			type: "WrongPasswordRoomError",
			message: `Password does not match`,
		});

    if(room.players.length >= room.maxPlayerCount)
        return err({
            type: "RoomAlreadyFullError",
            message: "Room is already full"
        });

    // Set host if room has no host, can only happen if settings.removeEmptyRoom is false
    if(room.players.length === 0 && room.host === null) 
        room.host = player.playerId;

	room.players.push(player);
	player.socket.join(room.roomId);
	player.room = room;
    
	return ok(room);
}

/**
 * Helper function to let a player leave their room
 * @param player
 * @returns
 */
function leaveRoom(player: Player): Result<{deleted: boolean, room: Room}, IError> {
	const room = player.room;

	if (room === null)
		return err({
			type: "PlayerNotInRoomError",
			message: `Player is not in any room`,
		});

	room.players = room.players.filter((p) => p != player);
	player.room = null;
	player.socket.leave(room.roomId);


	if (settings.removeEmptyRoom && room.players.length === 0) {
		if(deleteRoom(room.roomId)) // Room was deleted, handle in controller
            ok({deleted: true, room});
	}

	// Room is not empty
	// If host left the lobby, assign new host
    // Only assign host, if room is not empty
	if (room.host === player.playerId) {
        room.host = null;

		// Room can be empty if settings.removeEmptyRoom is false
        if(room.players.length > 0)
		    room.host = room.players[0].playerId;
	}

	return ok({deleted: false, room});
}

/**
 * Checks if the given password matches a rooms password
 * @param roomId
 * @param password
 * @returns true if the password match
 */
function checkPassword(
	roomId: string,
	password: string
): Result<boolean, IError> {
	const room = getRoom(roomId);

	if (room === undefined)
		return err({ type: "UnknownRoomError", message: "Room not found" });

	if (!room.isPrivate)
		return err({
			type: "NotPrivateRoomError",
			message: "Room is not private",
		});

	if (room.password !== password)
		return err({
			type: "WrongPasswordRoomError",
			message: "Wrong password",
		});

	return ok(true);
}

function changeRoomSetting(
	player: Player,
	{ setting, value }: ChangeRoomSetting
): Result<Room, IError> {
	if (player.room === null)
		return err({
			type: "PlayerNotInRoomError",
			message: `Player is not in any room`,
		});

	const room = player.room;
	if (room.host !== player.playerId)
		return err({
			type: "PlayerNotHostError",
			message:
				"Player is not the host of this lobby. Cannot change settings",
		});

	switch (setting) {
		case "host":
			// Host got transferred
			room.host = value;
			break;
		case "isPrivate":
			room.isPrivate = value.isPrivate;
			room.password = value.password;
			break;
		case "maxPlayerCount":
			room.maxPlayerCount = value;
			break;
		default:
			return err({
				type: "InvalidRoomSetting",
				message: "Invalid room setting sent",
			});
	}

	return ok(room);
}

export {
	createAndAddRoom,
	joinRoom,
	getRoom,
	getAllRooms,
	leaveRoom,
	checkPassword,
	getDefaultRoomSettings,
	changeRoomSetting,
};
