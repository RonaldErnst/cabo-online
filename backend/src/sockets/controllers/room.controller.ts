import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";
import { createAndAddRoom, joinRoom } from "@services/rooms.service";
import socketIO from "app";
import transformRoomClientData from "utils/transformRoomClientData";

function handleCreateRoom(player: Player, socket: IServerSocket) {
	return (roomId: string, done: () => void) => {
		createAndAddRoom(roomId).match(
			(room) => {
                // Room just got created, add creating player as host
                room.host = player;
				// Tell all connected players about the new room
				socketIO.emit("CREATE_ROOM", transformRoomClientData(room));
				done();
			},
			(err) => {
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
	};
}

function handleJoinRoom(player: Player, socket: IServerSocket) {
	return (roomId: string) => {
		joinRoom(roomId, player).match(
			() => {},
			(err) => {
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
	};
}

export { handleCreateRoom, handleJoinRoom };
