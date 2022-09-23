import { IEventType } from "..";

interface CreateRoomEvent extends IEventType {
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
			setting: "host";
			value: string;
	  };

interface ChangeRoomSettingEvent extends IEventType {
	type: "CHANGE_ROOM_SETTING";
	setting: ChangeRoomSetting;
}

export type ChangePlayerSetting =
	| {
			setting: "nickname";
			value: string;
	  }
	| {
			setting: "isReady";
			value: boolean;
	  }
	| {
			setting: "color";
			value: string;
	  };

interface ChangeRoomPlayerEvent extends IEventType {
	type: "CHANGE_ROOM_PLAYER";
	setting: ChangePlayerSetting;
}

export interface InitialPlayerData {
	nickname: string;
	color: string;
}

interface JoinRoomEvent extends IEventType {
	type: "JOIN_ROOM";
	roomId: string;
	password: string | null;
}

interface LeaveRoomEvent extends IEventType {
	type: "LEAVE_ROOM";
}

export type RoomClientServerEvent =
	| CreateRoomEvent
	| ChangeRoomSettingEvent
	| ChangeRoomPlayerEvent
	| JoinRoomEvent
	| LeaveRoomEvent;
