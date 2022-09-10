export type UnknownRoomError = "UnknownRoomError";
export type RoomAlreadyExistsError = "RoomAlreadyExistsError";
export type NoRoomChatError = "NoRoomChatError";

export type RoomError = "RoomError" | UnknownRoomError | RoomAlreadyExistsError;
export type GameError = "GameError";
export type ChatError = "ChatError" | NoRoomChatError;
export type PlayerAlreadyExistsError = "PlayerAlreadyExistsError";

export type ServerError =
  | "ServerError"
  | PlayerAlreadyExistsError
  | RoomError
  | GameError
  | ChatError;
export type UnknownError = "UnknownError";

export type ErrorType = ServerError | UnknownError;

export interface IError<T = ErrorType> {
  type: T;
  message: string;
  data?: any;
}
