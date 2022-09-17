import { RoomClientData } from "types/models/room.model";
import { IEventType } from "..";

export interface CreateRoomEvent extends IEventType {
	type: "CREATE_ROOM";
	room: RoomClientData;
}

export interface DeleteRoomEvent extends IEventType {
	type: "DELETE_ROOM";
	roomId: string;
}

export interface JoinRoomEvent extends IEventType {
	type: "JOIN_ROOM";
	roomId: string;
}

export interface LeaveRoomEvent extends IEventType {
	type: "LEAVE_ROOM";
	roomId: string;
}

export interface ChangeRoomEvent extends IEventType {
    type: "CHANGE_ROOM";
    room: RoomClientData;
}

export type RoomServerClientEvent =
	| CreateRoomEvent
	| DeleteRoomEvent
	| JoinRoomEvent
	| LeaveRoomEvent
    | ChangeRoomEvent;