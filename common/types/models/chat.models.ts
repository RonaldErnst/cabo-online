import { PlayerClientData } from "./player.model";

export interface ChatMessage {
    text: string;
    player: PlayerClientData
}