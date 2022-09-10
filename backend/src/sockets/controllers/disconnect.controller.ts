import { Player } from "@common/types/models/player.model";
import { ISocket } from "@common/types/sockets";
import {} from "@services/disconnect.service";

function handleDisconnect(player: Player, socket: ISocket) {
	return (reason: string) => {
		console.log(
			`Player ${player.playerId} is trying to disconnect`,
			`Reason: ${reason}`
		);
	};
}

export { handleDisconnect };
