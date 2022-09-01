import { handleError } from "@controllers/sockets/error.controller";
import { Player } from "@common/types/models/player.model";

export default function registerErrorEvents(player: Player) {
	const socket = player.socket;
	socket.on("error", handleError(player));
}
