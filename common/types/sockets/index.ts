import { IError } from "../errors";
import { ChatClientServerEvent, ChatServerClientEvent } from "./chat";
import { GameClientServerEvent, GameServerClientEvent } from "./game";
import { RoomClientServerEvent, RoomServerClientEvent } from "./room";

export interface IEventType {
    type: string;
}

export interface ClientServerEvents {
	ROOM: (roomEvent: RoomClientServerEvent) => void;
	CHAT: (chatEvent: ChatClientServerEvent) => void;
	GAME: (gameEvent: GameClientServerEvent) => void;
}

export interface ServerClientEvents {
	ROOM: (roomEvent: RoomServerClientEvent) => void;
	CHAT: (chatEvent: ChatServerClientEvent) => void;
	GAME: (gameEvent: GameServerClientEvent) => void;
	ERROR: (err: IError) => void;
}

export interface ServerServerEvents {};
export interface SocketData {};


export * from "./chat";
export * from "./game";
export * from "./room";