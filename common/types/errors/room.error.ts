export type UnknownRoomError = "UnknownRoomError";
export type RoomAlreadyExistsError = "RoomAlreadyExistsError";
export type WrongPasswordRoomError = "WrongPasswordRoomError";
export type PlayerNotInRoomError = "PlayerNotInRoomError";
export type AlreadyInRoomError = "AlreadyInRoomError";
export type NotPrivateRoomError = "NotPrivateRoomError";
export type InvalidRoomSetting = "InvalidRoomSetting";
export type PlayerNotHostError = "PlayerNotHostError"

export type RoomError =
	| "RoomError"
	| UnknownRoomError
	| RoomAlreadyExistsError
	| WrongPasswordRoomError
	| AlreadyInRoomError
	| PlayerNotInRoomError
	| NotPrivateRoomError
    | InvalidRoomSetting
    | PlayerNotHostError;
