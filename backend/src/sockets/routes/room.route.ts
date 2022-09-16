import { handleCreateRoom, handleJoinRoom, handleLeaveRoom } from "@sockets/controllers";
import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";

export default function registerRoomEvents(player: Player, socket: IServerSocket) {
  socket.on("CREATE_ROOM", handleCreateRoom(player, socket));
  socket.on("JOIN_ROOM", handleJoinRoom(player, socket));
  socket.on("LEAVE_ROOM", handleLeaveRoom(player, socket));
}
