import { handleDisconnect } from "@controllers/sockets/disconnect.controller";
import { Player } from "@common/types/models/player.model";
import { Socket } from "socket.io";

export default function registerDisconnectEvents(
	player: Player,
	socket: Socket
) {
	socket.on("disconnect", handleDisconnect(player, socket));
}
