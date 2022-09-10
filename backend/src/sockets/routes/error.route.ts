import { handleError } from "@sockets/controllers";
import { Player } from "@common/types/models/player.model";
import { Socket } from "socket.io";

export default function registerErrorEvents(player: Player, socket: Socket) {
	socket.on("error", handleError(player, socket));
}
