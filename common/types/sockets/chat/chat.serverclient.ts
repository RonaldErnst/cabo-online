interface MessageChatEvent {
	type: "MESSAGE";
	message: string;
	playerId: string;
}

//message: string, playerId: string
export type ChatServerClientEvent = MessageChatEvent;
