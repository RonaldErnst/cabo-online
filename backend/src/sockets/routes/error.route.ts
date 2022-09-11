import { handleError } from "@sockets/controllers";
import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";

export default function registerErrorEvents(player: Player, socket: IServerSocket) {
  socket.on("error", handleError(player, socket));
}
