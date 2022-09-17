import { Player } from "@common/types/models/player.model";
import { PlayerClientServerEvent } from "@common/types/sockets";
import { IServerSocket } from "@types";

export default function handlePlayerEvents(player: Player, socket: IServerSocket) {
    return (playerEvent: PlayerClientServerEvent) => {
        switch(playerEvent.type) {
            case "CHANGE_PLAYER": // TODO: finish implementation
                break;
            default:
                socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Player Event",
				});
        }
    }
}