import { ChatError } from "./chat.error";
import { GameError } from "./game.error";
import { PlayerAlreadyExistsError } from "./player.error";
import { RoomError } from "./room.error";

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
