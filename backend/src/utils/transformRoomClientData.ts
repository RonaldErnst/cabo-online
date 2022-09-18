import { Room, RoomClientData } from "@common/types/models/room.model";

function transformRoomClientData(rooms: Room[]): RoomClientData[];
function transformRoomClientData(room: Room): RoomClientData;
function transformRoomClientData(
	rooms: Room | Room[]
): RoomClientData | RoomClientData[] {
	if (Array.isArray(rooms)) {
		return rooms.map((r) => transformRoomClientData(r));
	} else {
		return {
			roomId: rooms.roomId,
			host: rooms.host || null,
			isPrivate: rooms.isPrivate,
			maxPlayerCount: rooms.maxPlayerCount,
			currPlayerCount: rooms.players.length,
		};
	}
}

export default transformRoomClientData;
