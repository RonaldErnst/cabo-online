import { PlayerClientServerEvent } from "@common/types/sockets";
import { ChangePlayerSetting } from "@common/types/sockets/player";
import {
	changePlayerSetting,
	createAndAddPlayer,
	getExistingPlayer,
} from "@services/player.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformPlayerClientData from "utils/transformPlayerClientData";
import transformRoomClientData from "utils/transformRoomClientData";

function handleCreatePlayer(socket: IServerSocket, nickname: string) {
	createAndAddPlayer(socket).match(
		(player) => {
            // Nothing to do
			// socket.emit("PLAYER", { type: "CREATE_PLAYER" });
		},
		(err) => {
			console.log(err);
			socket.emit("ERROR", err);
		}
	);
}

function handleChangePlayer(
	socket: IServerSocket,
	setting: ChangePlayerSetting
) {
	getExistingPlayer(socket.id)
		.andThen((player) => changePlayerSetting(player, setting))
		.match(
			(player) => {
                // Tell lobby that player changed
                if(player.room !== null)
                    socketIO.in(player.room.roomId).emit("ROOM", {
                        type: "CHANGE_ROOM",
                        room: transformRoomClientData(player.room),
                    });
			},
			(err) => {
				console.log(err);
				socket.emit("ERROR", err);
			}
		);
}

export default function handlePlayerEvents(socket: IServerSocket) {
	return (playerEvent: PlayerClientServerEvent) => {
		switch (playerEvent.type) {
			case "CREATE_PLAYER":
				handleCreatePlayer(socket, playerEvent.nickname);
				break;
			case "CHANGE_PLAYER": // TODO: finish implementation
				handleChangePlayer(socket, playerEvent.setting);
				break;
			default:
				socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Player Event",
				});
		}
	};
}
