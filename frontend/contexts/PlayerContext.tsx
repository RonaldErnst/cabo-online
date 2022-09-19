import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useState,
} from "react";
import generateNickname from "utils/generateNickname";

interface IPlayerContext {
	nickname: string;
	color: string;
}

const PlayerContext = createContext<IPlayerContext | null>(null);

export function usePlayer() {
	const ctx = useContext(PlayerContext);

	if (ctx === null) throw new Error("Player Context not initialized yet");

	return ctx;
}

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
	const [nickname, setNickname] = useState(generateNickname());
	const [color, setColor] = useState("red");

	const value = {
		nickname,
		color,
	};

	return (
		<PlayerContext.Provider value={value}>
			{children}
		</PlayerContext.Provider>
	);
};
