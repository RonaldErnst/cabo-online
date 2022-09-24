export type ChatMessage =
	| { text: string; isSystemMessage: true }
	| { text: string; isSystemMessage: false; playerId: string };
