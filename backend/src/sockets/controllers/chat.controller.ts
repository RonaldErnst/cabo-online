import { Player } from "@common/types/models/player.model";
import { ChatClientServerEvent } from "@common/types/sockets";
import { sendMessage } from "@services/chat.service";
import { IServerSocket } from "@types";
import socketIO from "app";

function handleChatMessage(player: Player, socket: IServerSocket, message: string) {
    sendMessage(player, message).match(
        (roomId) => {
            socketIO
                .in(roomId)
                .emit("CHAT", {
                    type: "MESSAGE",
                    message,
                    playerId: player.playerId,
                });
        },
        (err) => socket.emit("ERROR", err)
    );
}

export default function handleChatEvents(player: Player, socket: IServerSocket) {
    return (chatEvent: ChatClientServerEvent) => {
		switch (chatEvent.type) {
            case "MESSAGE":
                handleChatMessage(player, socket, chatEvent.message);
                break;
			default:
				socket.emit("ERROR", {
					type: "UnknownError",
					message: "Unknown Chat Event",
				});
		}
	};
}
