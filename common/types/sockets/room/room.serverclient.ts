import { RoomClientData } from "types/models/room.model";
import { IEventType } from "..";

interface CreateRoomEvent extends IEventType {
	type: "CREATE_ROOM";
	room: RoomClientData;
}

interface DeleteRoomEvent extends IEventType {
	type: "DELETE_ROOM";
	roomId: string;
}

interface ChangeRoomEvent extends IEventType {
    type: "CHANGE_ROOM";
    room: RoomClientData;
}

export type RoomServerClientEvent =
	| CreateRoomEvent
	| DeleteRoomEvent
    | ChangeRoomEvent;