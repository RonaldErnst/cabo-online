import { handleChatMessage } from "@controllers/sockets/chat.controller";
import { Player } from "@common/types/models/player.model";

export default function registerChatEvents(player: Player) {
	const socket = player.socket;
	socket.on("CHAT", handleChatMessage(player));
}
