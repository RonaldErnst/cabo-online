import { IError } from "../errors";
import { ChatClientServerEvent, ChatServerClientEvent } from "./chat";
import { GameClientServerEvent, GameServerClientEvent } from "./game";
import { PlayerClientServerEvent, PlayerServerClientEvent } from "./player";
import { RoomClientServerEvent, RoomServerClientEvent } from "./room";

export interface IEventType {
    type: string;
}

export interface ClientServerEvents {
	ROOM: (roomEvent: RoomClientServerEvent) => void;
	PLAYER: (playerEvent: PlayerClientServerEvent) => void;
	CHAT: (chatEvent: ChatClientServerEvent) => void;
	GAME: (gameEvent: GameClientServerEvent) => void;
}

export interface ServerClientEvents {
	ROOM: (roomEvent: RoomServerClientEvent) => void;
	PLAYER: (playerEvent: PlayerServerClientEvent) => void;
	CHAT: (chatEvent: ChatServerClientEvent) => void;
	GAME: (gameEvent: GameServerClientEvent) => void;
	ERROR: (err: IError) => void;
}

export interface ServerServerEvents {};
export interface SocketData {};

export {
	ChatClientServerEvent,
	ChatServerClientEvent,
	GameServerClientEvent,
	GameClientServerEvent,
	PlayerClientServerEvent,
	PlayerServerClientEvent,
	RoomClientServerEvent,
	RoomServerClientEvent,
};
