import { Player, PlayerClientData } from "@common/types/models/player.model";

function transformPlayerClientData(player: Player): PlayerClientData;
function transformPlayerClientData(players: Player[]): PlayerClientData[];
function transformPlayerClientData(players: Player | Player[]): PlayerClientData | PlayerClientData[] {
    if(Array.isArray(players)) {
        return players.map((p) => transformPlayerClientData(p));
    } else {
        return {
            playerId: players.playerId,
            nickname: players.nickname,
            isReady: players.isReady,
            color: players.color
        };
    }
}

export default transformPlayerClientData;
