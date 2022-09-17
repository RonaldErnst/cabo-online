import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";
import { err, ok, Result } from "neverthrow";

// Map of socketIDs to Players
const players = new Map<string, Player>();

function getPlayer(socketId: string) {
	return players.get(socketId);
}

function addPlayer(player: Player) {
	players.set(player.playerId, player);
}

function createAndAddPlayer(socket: IServerSocket): Result<Player, IError> {
	const player: Player = {
		socket,
		playerId: socket.id,
		nickname: null,
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
