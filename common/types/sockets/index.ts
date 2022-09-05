import { Player } from "../models/player.model";
import { Socket, Server } from "socket.io";
import { RoomEventData } from "../models/room.model";
import ErrorTypes from "../errors"; 

export interface ClientServerEvents  {
    CREATE_ROOM: (roomId: string) => void;
    JOIN_ROOM: (roomId: string) => void;
    PLAYER: () => void; // TODO for changin nickname and other stuff
    CHAT: (message: string) => void;
    GAME: (data: any) => void;
}

export interface ServerClientEvents {
    CREATE_ROOM: (room: RoomEventData) => void;
    JOIN_ROOM: (playerId: string, room: RoomEventData) => void;
    CHAT: (message: string, playerId: string) => void;
    GAME: (data: any) => void;
    ERROR: (type: ErrorTypes) => void;
    DISCONNECT: () => void;
}

export interface ServerServerEvents {
    
}

export interface SocketData extends Player {

}

export type IServer = Server<ClientServerEvents, ServerClientEvents, ServerServerEvents, SocketData>;
export type ISocket = Socket<ClientServerEvents, ServerClientEvents, ServerServerEvents, SocketData>;