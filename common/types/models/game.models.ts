
// TODO
export interface GameSettings {
    maxRounds: number;
    // rules? starting cards, action cards etc
}

export interface PlayerGameState {
    cards: string[]
}

export interface GameState {
    round: number;
    turn: number; // necessary?
    currTurnPlayer: string;
    playerStates: Map<string,PlayerGameState>; // playerID to player game state
}