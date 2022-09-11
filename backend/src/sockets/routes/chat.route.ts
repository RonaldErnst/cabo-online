import { handleChatMessage } from "@sockets/controllers";
import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";

export default function registerChatEvents(player: Player, socket: IServerSocket) {
  socket.on("CHAT", handleChatMessage(player, socket));
}
