export type UnknownRoomError = "UnknownRoomError";
export type RoomAlreadyExistsError = "RoomAlreadyExistsError";
export type NoRoomChatError = "NoRoomChatError";

export type RoomError = "RoomError" | UnknownRoomError | RoomAlreadyExistsError;
export type GameError = "GameError";
export type ChatError = "ChatError" | NoRoomChatError;
export type PlayerAlreadyExistsError = "PlayerAlreadyExistsError";

export type ServerError = "ServerError" | PlayerAlreadyExistsError | RoomError | GameError | ChatError;
export type UnknownError = "UnknownError";

type ErrorTypes = ServerError | UnknownError;

export default ErrorTypes;

type A = "Test1";
type B = A | "Test2";

let a: A = "Test1";
let b: B = "Test2";
