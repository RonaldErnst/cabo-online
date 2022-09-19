export type ChangePlayerSetting =
	| {
			setting: "nickname";
			value: string;
	  }
	| {
			setting: "isReady";
			value: boolean;
	  };

interface PlayerChangeEvent {
	type: "CHANGE_PLAYER";
	setting: ChangePlayerSetting;
}

interface CreatePlayerEvent {
	type: "CREATE_PLAYER";
	nickname: string;
}

interface DeletePlayerEvent {
	type: "DELETE_PLAYER";
}

export type PlayerClientServerEvent = PlayerChangeEvent | CreatePlayerEvent | DeletePlayerEvent;
