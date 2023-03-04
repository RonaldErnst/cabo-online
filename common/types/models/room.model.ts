import { GameState } from "./game.models";
import { Player, PlayerClientData } from "./player.model";

export interface RoomSettings {
	isPrivate: boolean;
	password: string | null;
	maxPlayerCount: number;
}

export type Room = {
	roomId: string;
	players: Array<Player>;
	host: string | null;
    gameState: GameState | null;
    // TODO gameSettings: GameSettings
} & RoomSettings;

export interface RoomClientData {
	roomId: string;
    host: string | null;
	isPrivate: boolean;
	maxPlayerCount: number;
	players: PlayerClientData[];
}
