interface CreateRoomEvent {
	type: "CREATE_ROOM";
	roomId: string;
}

type ChangeRoomSettingEvent  = {
	type: "CHANGE_ROOM_SETTING";
	setting: "isPrivate";
    value: {
        isPrivate: boolean;
        password: string;
    };
} | {
    type: "CHANGE_ROOM_SETTING";
    setting: "maxPlayerCount";
    value: number;
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
    | ChangeRoomSettingEvent
	| JoinRoomEvent
	| LeaveRoomEvent;
