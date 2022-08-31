import { Socket } from "socket.io";
import { ClientServerEvents, ServerClientEvents, ServerServerEvents, SocketData } from "../sockets";
import { Room } from "./room.model";

export interface Player {
    socket: Socket<ClientServerEvents, ServerClientEvents, ServerServerEvents, SocketData>;
    playerId: string;
    nickname: string;
    room: Room | null;
    isReady: boolean;
}