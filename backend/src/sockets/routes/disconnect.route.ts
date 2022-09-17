import { handleDisconnectEvents } from "@sockets/controllers";
import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";

export default function registerDisconnectEvents(
  player: Player,
  socket: IServerSocket
) {
  socket.on("disconnect", handleDisconnectEvents(player, socket));
}
