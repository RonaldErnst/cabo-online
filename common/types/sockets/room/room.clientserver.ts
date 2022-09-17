interface CreateRoomEvent {
	type: "CREATE_ROOM";
	roomId: string;
}

export type RoomSettingType =
	| {
			setting: "isPrivate";
			value:
				| { isPrivate: true; password: string }
				| { isPrivate: false; password: null };
	  }
	| {
			setting: "maxPlayerCount";
			value: number;
	  }
	| {
			setting: "currPlayerCount";
			value: number;
	  };

type ChangeRoomSettingEvent = {
	type: "CHANGE_ROOM_SETTING";
	setting: RoomSettingType;
};

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
