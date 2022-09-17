import { IError } from "@common/types/errors";
import { ChatProvider } from "@contexts/ChatContext";
import { useSocket } from "@contexts/SocketContext";
import { FC, useEffect } from "react";
import PasswordPrompt from "./PasswordPrompt";

interface Props {
	roomId: string;
	requiresPassword: boolean;
	password: string | null;
}

const Lobby: FC<Props> = ({ roomId, requiresPassword, password }) => {
	const socket = useSocket();

	useEffect(() => {
		// If room requires password and no pw given, do nothing, prompt pw
		if (requiresPassword && password === null) return;

		const errorListener = (err: IError) => {
			console.log(err);
			socket.off("ERROR", errorListener);
		};

		socket.once("ERROR", errorListener);

		// Join the room. Either no pw required (pw=null) or pw already given
		socket.emit("ROOM", { type: "JOIN_ROOM", roomId, password });

		return () => {
			// If room requires password and no pw given, do nothing, prompt pw
			if (requiresPassword && password === null) return;

			const errorListener = (err: IError) => {
				console.log(err); // TODO handle Error
				socket.off("ERROR", errorListener);
			};

			socket.once("ERROR", errorListener);

			// Only leave if player has joined the room
			socket.emit("ROOM", { type: "LEAVE_ROOM" });
		};
	}, [password, requiresPassword, roomId, socket]);

	if (requiresPassword && password === null)
		return <PasswordPrompt roomId={roomId} />;

	return (
		<ChatProvider>
			<div className="bg-slate-700 w-full h-full flex flex-col">
				{roomId}
			</div>
		</ChatProvider>
	);
};

export default Lobby;
