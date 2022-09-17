import { ChatMessage } from "types/models/chat.models";

interface MessageChatEvent {
	type: "MESSAGE";
	message: string;
}

export type ChatClientServerEvent = MessageChatEvent;
