import { Player } from "@common/types/models/player.model";
import { ISocket } from "@common/types/sockets";
import {} from "@services/error.service";

function handleError(player: Player, socket: ISocket) {
  return (error: Error) => {
    console.log(`Player ${player.playerId} had an error`, error);
  };
}

export { handleError };
