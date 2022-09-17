import { ChatMessage } from "types/models/chat.models";

interface MessageChatEvent {
	type: "MESSAGE";
	message: ChatMessage;
}

//message: string, playerId: string
export type ChatServerClientEvent = MessageChatEvent;
