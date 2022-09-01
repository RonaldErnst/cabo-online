import { Player } from "@common/types/models/player.model";
import {  } from "@services/disconnect.service";

function handleDisconnect(player: Player) {
	return (reason: string) => {
		console.log(`Player ${player.playerId} is trying to disconnect`, `Reason: ${reason}`);
	};
}

export { handleDisconnect };
