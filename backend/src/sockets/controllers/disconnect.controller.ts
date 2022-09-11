import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";

function handleDisconnect(player: Player, socket: IServerSocket) {
	return (reason: string) => {
		console.log(
			`Player ${player.playerId} is trying to disconnect`,
			`Reason: ${reason}`
		);
	};
}

export { handleDisconnect };
