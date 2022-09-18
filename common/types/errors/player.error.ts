export type PlayerAlreadyExistsError = "PlayerAlreadyExistsError";
export type UnknownPlayerError = "UnknownPlayerError";
export type InvalidPlayerSetting = "InvalidPlayerSetting";

export type PlayerError = "PlayerError" | PlayerAlreadyExistsError | UnknownPlayerError | InvalidPlayerSetting;