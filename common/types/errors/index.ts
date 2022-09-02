export interface ServerError extends Error {
	
}

export class UnknownError extends Error {
    constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);
		this.name = Error.name;
		Error.captureStackTrace(this);
	}
}

export * from "./chat.error";
export * from "./game.error";
export * from "./room.error";
