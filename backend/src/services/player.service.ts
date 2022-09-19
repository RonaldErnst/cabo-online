import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import { ChangePlayerSetting } from "@common/types/sockets/player";
import { IServerSocket } from "@types";
import { err, ok, Result } from "neverthrow";

// Map of socketIDs to Players
const players = new Map<string, Player>();

function getPlayer(socketId: string) {
	return players.get(socketId);
}

function getExistingPlayer(socketId: string): Result<Player, IError> {
	const player = getPlayer(socketId);

	// Player not found, most likely not in any room
	if (player === undefined)
		return err({
			type: "UnknownPlayerError",
			message: "Player unknown",
		});

	return ok(player);
}

function addPlayer(player: Player) {
	players.set(player.playerId, player);
}

function createAndAddPlayer(socket: IServerSocket): Result<Player, IError> {
	const player: Player = {
		socket,
		playerId: socket.id,
		nickname: "", // TODO: find solution for nickname. Player should only get created
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

	console.log(`Added player ${player.playerId}`);

	return ok(player);
}

function changePlayerSetting(
	player: Player,
	{ setting, value }: ChangePlayerSetting
): Result<Player, IError> {
	switch (setting) {
		case "isReady":
			player.isReady = value;
			break;
		case "nickname":
			player.nickname = value;
			break;
		default:
			return err({
				type: "InvalidPlayerSetting",
				message: "Invalid Player setting sent",
			});
	}

	return ok(player);
}

function removePlayer(playerId: string) {
	players.delete(playerId);
    console.log(`Removed player ${playerId}`);
}

export {
	createAndAddPlayer,
	getExistingPlayer,
	changePlayerSetting,
	removePlayer,
};
