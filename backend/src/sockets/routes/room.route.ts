import { handleRoomEvents } from "@sockets/controllers";
import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";

export default function registerRoomEvents(player: Player, socket: IServerSocket) {
  socket.on("ROOM", handleRoomEvents(player, socket));
}
