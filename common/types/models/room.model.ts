import { Player } from "./player.model";

export interface RoomSettings {
	isPrivate: boolean;
	password: string | null;
	maxPlayerCount: number;
}

export type Room = {
	roomId: string;
	players: Array<Player>;
	host: Player | null;
} & RoomSettings;

export interface RoomClientData {
	roomId: string;
    host: string | null;
	isPrivate: boolean;
	maxPlayerCount: number;
	currPlayerCount: number;
}
