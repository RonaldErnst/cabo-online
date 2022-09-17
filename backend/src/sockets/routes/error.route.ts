import { Player } from "@common/types/models/player.model";
import { handleErrorEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerErrorEvents(
	player: Player,
	socket: IServerSocket
) {
	socket.on("error", handleErrorEvents(player, socket));
}
