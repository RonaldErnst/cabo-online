interface CreateRoomEvent {
	type: "CREATE_ROOM";
	roomId: string;
}

export type ChangeRoomSetting =
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
	  }
	| {
			setting: "host";
			value: string;
	  };

type ChangeRoomSettingEvent = {
	type: "CHANGE_ROOM_SETTING";
	setting: ChangeRoomSetting;
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
