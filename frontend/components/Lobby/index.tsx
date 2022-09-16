import { IError } from "@common/types/errors";
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

		const removeListeners = () => {
			socket.off("ERROR", errorListener);
			socket.off("JOIN_ROOM", joinListener);
		};

		const joinListener = (playerId: string) => {
			console.log(`Player ${playerId} joined the room`);
			removeListeners();
		};

		const errorListener = (err: IError) => {
			console.log(err);
			removeListeners();
		};

		socket.once("ERROR", errorListener);
		socket.once("JOIN_ROOM", joinListener);

        // Join the room. Either no pw required (pw=null) or pw already given
		socket.emit("JOIN_ROOM", roomId, password);

		return () => {
            // If room requires password and no pw given, do nothing, prompt pw
			if (requiresPassword && password === null) return;

			const removeListeners = () => {
				socket.off("ERROR", errorListener);
				socket.off("LEAVE_ROOM", leaveListener);
			};

			const errorListener = (err: IError) => {
				console.log(err); // TODO handle Error
				removeListeners();
			};

			const leaveListener = (playerId: string) => {
				console.log(`Player ${playerId} left the room`);
				removeListeners();
			};

			socket.once("ERROR", errorListener);
			socket.once("LEAVE_ROOM", leaveListener);

			// Only leave if player has joined the room
			socket.emit("LEAVE_ROOM");
		};
	}, [password, requiresPassword, roomId, socket]);

    if(requiresPassword && password === null)
        return <PasswordPrompt roomId={roomId} />;

	return <div>{roomId}</div>;
};

export default Lobby;
