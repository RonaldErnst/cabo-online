import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";
import {} from "@services/error.service";

function handleError(player: Player, socket: IServerSocket) {
	return (error: Error) => {
		console.log(`Player ${player.playerId} had an error`, error);
	};
}

export { handleError };
