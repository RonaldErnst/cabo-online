import { Player } from "@common/types/models/player.model";
import { handleChatEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerChatEvents(
	player: Player,
	socket: IServerSocket
) {
	socket.on("CHAT", handleChatEvents(player, socket));
}
