import { ChatError } from "./chat.error";
import { GameError } from "./game.error";
import { PlayerError } from "./player.error";
import { RoomError } from "./room.error";

export type ServerError =
  | "ServerError"
  | PlayerError
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
