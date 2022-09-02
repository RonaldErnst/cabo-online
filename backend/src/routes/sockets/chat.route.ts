import { handleChatMessage } from "@controllers/sockets/chat.controller";
import { Player } from "@common/types/models/player.model";
import { Socket } from "socket.io";

export default function registerChatEvents(player: Player, socket: Socket) {
	socket.on("CHAT", handleChatMessage(player, socket));
}
