export type UnknownRoomError = "UnknownRoomError";
export type RoomAlreadyExistsError = "RoomAlreadyExistsError";
export type WrongPasswordRoomError = "WrongPasswordRoomError";
export type PlayerNotInRoomError = "PlayerNotInRoomError";
export type AlreadyInRoomError = "AlreadyInRoomError";
export type RoomAlreadyFullError = "RoomAlreadyFullError";
export type NotPrivateRoomError = "NotPrivateRoomError";
export type InvalidRoomSetting = "InvalidRoomSetting";
export type PlayerNotHostError = "PlayerNotHostError";
// TODO clean up errors, too many
// Only individual error type needed if it requires different messages
export type RoomError =
	| "RoomError"
	| UnknownRoomError
	| RoomAlreadyExistsError
	| WrongPasswordRoomError
	| AlreadyInRoomError
	| RoomAlreadyFullError
	| PlayerNotInRoomError
	| NotPrivateRoomError
	| InvalidRoomSetting
	| PlayerNotHostError;
