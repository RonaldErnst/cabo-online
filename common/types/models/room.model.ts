import { Player } from "./player.model";

export interface RoomSettings {
	isPrivate: boolean;
	password: string | null;
	maxPlayerCount: number;
}

export interface Room {
	roomId: string;
	players: Array<Player>;
	host: Player | null;
	options: RoomSettings;
}

export interface RoomClientData {
	roomId: string;
	isPrivate: boolean;
	maxPlayerCount: number;
	currPlayerCount: number;
}
