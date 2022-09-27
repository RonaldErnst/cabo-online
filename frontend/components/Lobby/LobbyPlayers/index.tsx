import { useLobby, useSocket } from "@contexts";
import LobbyPlayerInfo from "./LobbyPlayerInfo";

const LobbyPlayers = () => {
    const socket = useSocket();
	const { lobby } = useLobby();

	if (lobby === undefined) return null;

	const players = lobby.players.filter(p => p.playerId !== socket.id);
	return (
		<div className="flex flex-row flex-wrap gap-x-8 justify-center items-center gap-y-8 bg-slate-600 p-8 rounded-xl drop-shadow-lg">
			{
                players.length === 0? <span className="text-lg text-white font-semibold drop-shadow-md">Waiting for players</span> :
                players.map(p => <LobbyPlayerInfo key={p.playerId} player={p}/>)
            }
		</div>
	);
};

export default LobbyPlayers;
