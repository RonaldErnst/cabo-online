import { handleDisconnectEvents } from "@sockets/controllers";
import { IServerSocket } from "@types";

export default function registerDisconnectEvents(
  socket: IServerSocket
) {
  socket.on("disconnect", handleDisconnectEvents(socket));
}
