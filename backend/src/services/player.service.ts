import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import { ISocket } from "@common/types/sockets";
import { err, ok, Result } from "neverthrow";
import generateNickname from "utils/nicknameGenerator";

// Map of socketIDs to Players
const players = new Map<string, Player>();

function getPlayer(socketId: string) {
	return players.get(socketId);
}

function addPlayer(player: Player) {
	players.set(player.playerId, player);
}

function createAndAddPlayer(socket: ISocket): Result<Player, IError> {
	const player: Player = {
		socket,
		playerId: socket.id,
		nickname: generateNickname(),
		room: null,
		isReady: false,
	};

	if (players.has(player.playerId))
		return err({
			type: "PlayerAlreadyExistsError",
			message: `Player ${player.playerId} already exists`,
		});

	// Link socket and player
	socket.data = player;

	addPlayer(player);

	console.log("Added player ", player.playerId);

	return ok(player);
}

export { createAndAddPlayer, getPlayer };
