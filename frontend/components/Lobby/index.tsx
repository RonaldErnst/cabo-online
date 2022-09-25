import { IError } from "@common/types/errors";
import { RoomSettings } from "@common/types/models/room.model";
import Chat from "@components/Chat";
import PlayerDetails from "@components/PlayerDetails";
import LobbyPlayers from "@components/LobbyPlayers";
import { ChatProvider } from "@contexts/ChatContext";
import { LobbyProvider } from "@contexts/LobbyContext";
import { useSocket } from "@contexts/SocketContext";
import { FC, useEffect } from "react";
import PasswordPrompt from "./PasswordPrompt";
import LobbySettings from "./LobbySettings";

interface Props {
	roomId: string;
	requiresPassword: boolean;
	password: string | null;
	defaultRoomSettings: RoomSettings;
}

const Lobby: FC<{ data: Props }> = ({
	data: { roomId, requiresPassword, password, defaultRoomSettings },
}) => {
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
		// TODO: nickname erstellung und color vergabe auf Serverseite anstatt von Client aus
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
		<LobbyProvider
			defaultRoomSettings={defaultRoomSettings}
			roomId={roomId}
		>
			<ChatProvider>
				<div className="bg-slate-700 w-full h-full flex flex-row">
					<div className="grow flex flex-col justify-center items-center gap-y-12"> {/* TODO upper part 3/5 or 3/4 of height */}
						<div className="flex flex-row justify-center items-center gap-x-8">
							<PlayerDetails /> {/* TODO Show that you are the lobby host */}
                            <LobbySettings />
						</div>
                        <LobbyPlayers />
					</div>
					<Chat />
				</div>
			</ChatProvider>
		</LobbyProvider>
	);
};

export default Lobby;
