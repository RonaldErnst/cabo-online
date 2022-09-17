import { IError } from "../errors";
import { ChatClientServerEvent } from "./chat.clientserver";
import { ChatServerClientEvent } from "./chat.serverclient";
import { GameClientServerEvent } from "./game.clientserver";
import { GameServerClientEvent } from "./game.serverclient";
import { PlayerClientServerEvent } from "./player.clientserver";
import { PlayerServerClientEvent } from "./player.serverclient";
import { RoomClientServerEvent } from "./room.clientserver";
import { RoomServerClientEvent } from "./room.serverclient";

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
