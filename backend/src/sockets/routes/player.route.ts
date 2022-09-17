import { Player } from "@common/types/models/player.model";
import { handlePlayerEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerPlayerEvents(
	player: Player,
	socket: IServerSocket
) {
	socket.on("PLAYER", handlePlayerEvents(player, socket));
}
