import { Player } from "@common/types/models/player.model";
import { sendMessage } from "@services/chat.service";

function handleChatMessage(player: Player) {
	return (message: string) => {
		sendMessage(player, message);
	};
}

export { handleChatMessage };
