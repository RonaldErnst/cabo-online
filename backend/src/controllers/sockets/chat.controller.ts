import { Player } from "@common/types/models/player.model";
import { ISocket } from "@common/types/sockets";
import { sendMessage } from "@services/chat.service";

function handleChatMessage(player: Player, socket: ISocket) {
	return (message: string) => {
		sendMessage(player, message).match(
			() => {},
			(err) => socket.emit("ERROR", err)
		);
	};
}

export { handleChatMessage };
