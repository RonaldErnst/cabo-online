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
			isPrivate: rooms.options.isPrivate,
			maxPlayerCount: rooms.options.maxPlayerCount,
			currPlayerCount: rooms.players.length
		};
	}
}

export default transformRoomClientData;
