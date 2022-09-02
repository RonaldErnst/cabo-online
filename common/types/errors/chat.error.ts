import { ServerError } from ".";

export class ChatError extends ServerError {
    constructor(message: string) {
        super(message);
    }
}

export class NoRoomChatError extends ChatError {
    constructor() {
        super("Player has not joined any room yet. Cannot send message");
    }
}