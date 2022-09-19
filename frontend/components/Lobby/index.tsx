import { IError } from "@common/types/errors";
import { RoomSettings } from "@common/types/models/room.model";
import Chat from "@components/Chat";
import { usePlayer } from "@contexts";
import { ChatProvider } from "@contexts/ChatContext";
import { LobbyProvider } from "@contexts/LobbyContext";
import { useSocket } from "@contexts/SocketContext";
import { FC, useEffect } from "react";
import PasswordPrompt from "./PasswordPrompt";

interface Props {
	roomId: string;
	requiresPassword: boolean;
	password: string | null;
	defaultSettings: RoomSettings;
}

const Lobby: FC<{ data: Props }> = ({
	data: { roomId, requiresPassword, password, defaultSettings },
}) => {
	const socket = useSocket();
    const { nickname } = usePlayer();

	useEffect(() => {
		// If room requires password and no pw given, do nothing, prompt pw
		if (requiresPassword && password === null) return;

		const errorListener = (err: IError) => {
			console.log(err);
			socket.off("ERROR", errorListener);
		};

		socket.once("ERROR", errorListener);

		// Join the room. Either no pw required (pw=null) or pw already given
		socket.emit("ROOM", { type: "JOIN_ROOM", roomId, password, player: { nickname } });

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
	}, [nickname, password, requiresPassword, roomId, socket]);

	if (requiresPassword && password === null)
		return <PasswordPrompt roomId={roomId} />;

	return (
		<LobbyProvider defaultSettings={defaultSettings} roomId={roomId}>
			<ChatProvider>
				<div className="bg-slate-700 w-full h-full flex flex-row">
					<div className="grow">{roomId}</div>
					<Chat />
				</div>
			</ChatProvider>
		</LobbyProvider>
	);
};

export default Lobby;
