import { Player } from "@common/types/models/player.model";
import { Room, RoomOptions } from "@common/types/models/room.model";

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
) {
	if (existsRoom(roomId)) throw new Error("Room already exists"); // TODO proper Error

	const room: Room = {
		roomId,
		host: null,
		playerSockets: new Array(),
		options,
	};

	addRoom(room);

    return room;
}

function joinRoom(roomId: string, player: Player) {
	const room = getRoom(roomId);
	if (room === undefined) throw new Error("Room does not exist"); // TODO proper Error

	room.playerSockets.push(player);
	player.socket.join(roomId);
    player.room = room;
}

export { createAndAddRoom, joinRoom };
