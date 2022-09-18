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

export type PlayerClientServerEvent = PlayerChangeEvent;
