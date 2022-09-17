import { PlayerClientData } from "../models/player.model";
import { RoomClientData } from "../models/room.model";

interface CreateRoomEvent {
	type: "CREATE_ROOM";
	room: RoomClientData;
}

interface DeleteRoomEvent {
	type: "DELETE_ROOM";
	roomId: string;
}

interface JoinRoomEvent {
	type: "JOIN_ROOM";
	roomId: string;
}

interface LeaveRoomEvent {
	type: "LEAVE_ROOM";
	roomId: string;
}

interface ChangeRoomEvent {
    type: "CHANGE_ROOM";
    room: RoomClientData;
}

export type RoomServerClientEvent =
	| CreateRoomEvent
	| DeleteRoomEvent
	| JoinRoomEvent
	| LeaveRoomEvent
    | ChangeRoomEvent;