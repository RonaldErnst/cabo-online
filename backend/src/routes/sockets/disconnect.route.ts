import { handleDisconnect } from "@controllers/sockets/disconnect.controller";
import { Player } from "@common/types/models/player.model";

export default function registerDisconnectEvents(player: Player) {
	const socket = player.socket;
	socket.on("disconnect", handleDisconnect(player));
}
