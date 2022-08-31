import {
	handleCreateRoom,
	handleJoinRoom,
} from "@controllers/sockets/room.controller";
import { Player } from "@common/types/models/player.model";

export default function registerRoomEvents(player: Player) {
	const socket = player.socket;
	socket.on("CREATE_ROOM", handleCreateRoom(player));
	socket.on("JOIN_ROOM", handleJoinRoom(player));
}
