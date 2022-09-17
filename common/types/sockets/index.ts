import { IError } from "../errors";
import { Player } from "../models/player.model";
import { RoomClientData } from "../models/room.model";

export interface ClientServerEvents {
	CREATE_ROOM: (roomId: string) => void;
	JOIN_ROOM: (roomId: string, password: string | null) => void;
    LEAVE_ROOM: () => void;
	PLAYER: () => void; // TODO for changin nickname and other stuff
	CHAT: (message: string) => void;
	GAME: (data: any) => void;
}

export interface ServerClientEvents {
	CREATE_ROOM: (room: RoomClientData) => void;
    DELETE_ROOM: (roomId: string) => void;
	JOIN_ROOM: (playerId: string) => void;
    LEAVE_ROOM: (playerId: string) => void;
	CHAT: (message: string, playerId: string) => void;
	GAME: (data: any) => void;
	ERROR: (err: IError) => void;
	DISCONNECT: () => void;
}

export interface ServerServerEvents {}

export interface SocketData extends Player {}
