import { ChatMessage } from "types/models/chat.models";
import { IEventType } from "..";

interface MessageChatEvent extends IEventType {
	type: "MESSAGE";
	message: ChatMessage;
}

//message: string, playerId: string
export type ChatServerClientEvent = MessageChatEvent;
