import {
	handleCreateRoom,
	handleJoinRoom,
} from "@sockets/controllers";
import { Player } from "@common/types/models/player.model";
import { Socket } from "socket.io";

export default function registerRoomEvents(player: Player, socket: Socket) {
	socket.on("CREATE_ROOM", handleCreateRoom(player, socket));
	socket.on("JOIN_ROOM", handleJoinRoom(player, socket));
}
