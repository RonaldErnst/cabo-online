import { IError } from "@common/types/errors";
import { PlayerServerClientEvent } from "@common/types/sockets";
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import generateNickname from "utils/generateNickname";
import { useSocket } from "./SocketContext";

interface IPlayerContext {
	nickname: string;
	// TODO: color
	changeNickname: (nickname: string) => void;
}

const PlayerContext = createContext<IPlayerContext | null>(null);

export function usePlayer() {
	const ctx = useContext(PlayerContext);

	if (ctx === null) throw new Error("Player Context not initialized yet");

	return ctx;
}

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
	const socket = useSocket();
	const [nickname, setNickname] = useState<string>(generateNickname());
	//const [color, setColor]

	// const playerEventListener = useCallback(
	// 	(playerEvent: PlayerServerClientEvent) => {
	// 		// Nothing to do yet...
	// 	},
	// 	[]
	// );

	const errorListener = useCallback((err: IError) => {
		// TODO: display error as system message in Player

		console.log(err);
	}, []);

	useEffect(() => {
		// socket.on("PLAYER", playerEventListener);
		socket.on("ERROR", errorListener);

		socket.emit("PLAYER", { type: "CREATE_PLAYER", nickname: nickname });

		return () => {
            socket.emit("PLAYER", { type: "DELETE_PLAYER", playerId: socket.id });

			// socket.off("PLAYER", playerEventListener);
			socket.off("ERROR", errorListener);
		};
	}, [errorListener, socket, nickname]);

	// Changes get broadcasted to current room if player is in a lobby
	const changeNickname = (nickname: string) => {
		socket.emit("PLAYER", {
			type: "CHANGE_PLAYER",
			setting: { setting: "nickname", value: nickname },
		});
	};

	const value = {
		nickname,
		changeNickname,
	};

	return (
		<PlayerContext.Provider value={value}>
			{children}
		</PlayerContext.Provider>
	);
};
