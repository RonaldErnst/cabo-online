import { IServerSocket } from "@types";

export default function handleDisconnectEvents(socket: IServerSocket) {
	return (reason: string) => {
		console.log(
			`Player ${socket.id} is trying to disconnect`,
			`Reason: ${reason}`
		);
	};
}
