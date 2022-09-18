import { PlayerClientServerEvent } from "@common/types/sockets";
import { ChangePlayerSetting } from "@common/types/sockets/player";
import {
	changePlayerSetting,
	getExistingPlayer,
} from "@services/player.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformPlayerClientData from "utils/transformPlayerClientData";

function handleChangePlayer(
	socket: IServerSocket,
	setting: ChangePlayerSetting
) {
	getExistingPlayer(socket.id)
		.andThen((player) => changePlayerSetting(player, setting))
		.match(
			(player) => {
				socketIO
					.in(player.room!.roomId)
					.emit("PLAYER", {
						type: "CHANGE_PLAYER",
						player: transformPlayerClientData(player),
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
