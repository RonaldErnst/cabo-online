interface MessageChatEvent {
	type: "MESSAGE";
	message: string;
	playerId: string;
}


export type ChatClientServerEvent = MessageChatEvent;