import { Player } from "@common/types/models/player.model";
import { createAndAddRoom, joinRoom } from "@services/rooms.service";
import socketIO from "app";

function handleCreateRoom(player: Player) {
	return (roomId: string) => {
		createAndAddRoom(roomId);
		joinRoom(roomId, player);

		socketIO.in(roomId).emit("CREATE_ROOM");
		socketIO.in(roomId).emit("JOIN_ROOM", player.playerId);
	};
}

function handleJoinRoom(player: Player) {
	return (roomId: string) => {
		joinRoom(roomId, player);

		socketIO.in(roomId).emit("JOIN_ROOM", player.playerId);
	};
}

export { handleCreateRoom, handleJoinRoom };
