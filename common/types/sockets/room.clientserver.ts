interface CreateRoomEvent {
	type: "CREATE_ROOM";
	roomId: string;
}

interface JoinRoomEvent {
	type: "JOIN_ROOM";
	roomId: string;
	password: string | null;
}

interface LeaveRoomEvent {
	type: "LEAVE_ROOM";
}

export type RoomClientServerEvent =
	| CreateRoomEvent
	| JoinRoomEvent
	| LeaveRoomEvent;
