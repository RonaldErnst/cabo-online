import { ServerError } from ".";

export class RoomError extends ServerError {
    constructor(message: string) {
		super(message);
    }
}

export class UnknownRoomError extends RoomError {
    constructor(roomId: string) {
        super(`Room ${roomId} does not exist`);
    }
}

export class RoomAlreadyExistsError extends RoomError {
    constructor(roomId: string) {
        super(`Room already exists ${roomId}`);
    }
}