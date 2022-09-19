import { IEventType } from "..";

interface MessageChatEvent extends IEventType {
	type: "MESSAGE";
	message: string;
}

export type ChatClientServerEvent = MessageChatEvent;
