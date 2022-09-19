import { Room, RoomClientData } from "@common/types/models/room.model";
import transformPlayerClientData from "./transformPlayerClientData";

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
			players: transformPlayerClientData(rooms.players),
		};
	}
}

export default transformRoomClientData;
