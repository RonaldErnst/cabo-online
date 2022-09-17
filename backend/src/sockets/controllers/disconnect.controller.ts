import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";


export default function handleDisconnectEvents(player: Player, socket: IServerSocket) {
    return (reason: string) => {
        // TODO: handle Errors
		console.log(
			`Player ${player.playerId} is trying to disconnect`,
			`Reason: ${reason}`
		);
	};
}
