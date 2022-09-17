import { PlayerClientData } from "../models/player.model";

interface PlayerChangeEvent {
	type: "CHANGE_PLAYER";
    player: PlayerClientData;
}

export type PlayerClientServerEvent = PlayerChangeEvent;