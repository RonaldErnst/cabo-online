import { PlayerClientData } from "types/models/player.model";
import { IEventType } from "..";


export interface ChangeRoomEvent extends IEventType {
    type: "CHANGE_PLAYER";
    player: PlayerClientData;
}

export type PlayerServerClientEvent = ChangeRoomEvent;