import { PlayerClientData } from "./player.model";

export type ChatMessage =
	| { text: string; isSystemMessage: true }
	| { text: string; isSystemMessage: false; player: PlayerClientData };
