import { Player } from "@common/types/models/player.model";
import {  } from "@services/error.service";

function handleError(player: Player) {
	return (error: Error) => {
		console.log(`Player ${player.playerId} had an error`, error);
	};
}

export { handleError };
