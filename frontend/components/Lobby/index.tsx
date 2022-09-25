import Chat from "@components/Chat";
import LobbyPlayers from "@components/LobbyPlayers";
import PlayerDetails from "@components/PlayerDetails";
import { useLobby, useSocket } from "@contexts";
import { FC } from "react";
import LobbySettings from "./LobbySettings";

const Lobby: FC = () => {
	const socket = useSocket();
	const { lobby } = useLobby();

	if (lobby === undefined) return null;

	return (
		<div className="bg-slate-700 w-full h-full flex flex-row">
			<div className="grow flex flex-col justify-center items-center gap-y-12">
				<div className="flex flex-row justify-center items-center gap-x-8">
					<PlayerDetails />
					{lobby.host === socket.id ? <LobbySettings /> : null}
				</div>
				<LobbyPlayers />
			</div>
			<Chat />
		</div>
	);
};

export default Lobby;
