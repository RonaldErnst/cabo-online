import { Player } from "@common/types/models/player.model";
import { ISocket } from "@common/types/sockets";
import { createAndAddRoom, joinRoom } from "@services/rooms.service";

function handleCreateRoom(player: Player, socket: ISocket) {
	return (roomId: string) => {
		createAndAddRoom(roomId)
			//.andThen(() => joinRoom(roomId, player))
			.match(
				() => {},
				(err) => {
					console.log(err);
					socket.emit("ERROR", err);
				}
			);
	};
}

function handleJoinRoom(player: Player, socket: ISocket) {
	return (roomId: string) => {
		joinRoom(roomId, player).match(
			() => {},
			(err) => socket.emit("ERROR", err)
		);
	};
}

export { handleCreateRoom, handleJoinRoom };
