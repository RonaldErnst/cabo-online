import { Player } from "@common/types/models/player.model";
import { ISocket } from "@common/types/sockets";
import generateNickname from "utils/nicknameGenerator";
// Map of socketIDs to Players
const players = new Map<string, Player>();

function getPlayer(socketId: string) {
	return players.get(socketId);
}

function addPlayer(player: Player) {
	players.set(player.playerId, player);
}

function createAndAddPlayer(socket: ISocket) {
	const player: Player = {
		socket,
		playerId: socket.id,
		nickname: generateNickname(),
		room: null,
		isReady: false,
	};

	socket.data = player;

	addPlayer(player);

    console.log(`Created and added Player ${player.playerId}`);

	return player;
}

export { createAndAddPlayer, getPlayer };
