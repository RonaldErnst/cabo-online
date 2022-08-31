import { Player } from "./player.model";

export interface RoomOptions {
    isPrivate: boolean;
	password: string | null;
    maxPlayerCount: number;
} 

export interface Room {
	roomId: string;
	playerSockets: Array<Player>;
	host: Player | null;
    options: RoomOptions
}