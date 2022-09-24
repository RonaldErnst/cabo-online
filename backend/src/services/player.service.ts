import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import { ChangePlayerSetting } from "@common/types/sockets";
import { IServerSocket } from "@types";
import { err, ok, Result } from "neverthrow";
import settings from "settings.backend";
import generateColor from "utils/generateColor";
import generateNickname from "utils/generateNickname";

// Map of socketIDs to Players
const players = new Map<string, Player>();

const cleanPlayesInterval = setInterval(
	cleanPlayers,
	settings.cleanPlayersInterval
);

/**
 * Function to clean up player map
 *
 * All dirty players get cleaned up.
 * A player is dirty when they're not in any room
 */
function cleanPlayers() {
	const idsForDeletion: string[] = [];
	players.forEach((player, playerId) => {
		const room = player.room;

		if (
			room === null ||
			room.players.find((p) => p === player) === undefined
		)
			idsForDeletion.push(playerId);
	});

	idsForDeletion.forEach((id) => {
		players.delete(id);
	});
}

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

	console.log(`Added player ${player.playerId}`);
}

function createAndAddPlayer(socket: IServerSocket): Result<Player, IError> {
	const player: Player = {
		socket,
		nickname: generateNickname(),
		color: generateColor(),
		playerId: socket.id,
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
		case "color":
			player.color = value;
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
