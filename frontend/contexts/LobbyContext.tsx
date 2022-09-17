import { IError } from "@common/types/errors";
import { RoomSettings } from "@common/types/models/room.model";
import {
	RoomServerClientEvent,
	RoomSettingType,
} from "@common/types/sockets/room";
import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import generateNickname from "utils/nicknameGenerator";
import { useSocket } from "./SocketContext";

interface ILobbyContext {
	nickname: string;
	isReady: boolean;
	settings: undefined;
	setNickname: Dispatch<SetStateAction<string>>;
	setIsReady: Dispatch<SetStateAction<boolean>>;
	changeSetting: (roomSetting: RoomSettingType) => void;
}

const LobbyContext = createContext<ILobbyContext | null>(null);

export function useLobby() {
	const ctx = useContext(LobbyContext);

	if (ctx === null) throw new Error("Lobby Context not initialized yet");

	return ctx;
}

interface Props {
	roomId: string;
	defaultSettings: RoomSettings;
}

export const LobbyProvider: FC<PropsWithChildren<Props>> = ({
	children,
	roomId,
	defaultSettings,
}) => {
	const [nickname, setNickname] = useState(generateNickname());
	const [isReady, setIsReady] = useState(false);

	const [settings, setSettings] = useState<RoomSettings>(defaultSettings);

	const socket = useSocket();

	const errorListener = useCallback((err: IError) => {
		// TODO: display error as system message in Lobby
		console.log(err);
	}, []);

	const roomEventsListener = useCallback(
		(roomEvent: RoomServerClientEvent) => {
			// Only Change room events matter here
			if (roomEvent.type !== "CHANGE_ROOM") return;

			// Sanity check, roomId should be the current rooms
			if (roomEvent.room.roomId !== roomId) {
				// Something went wrong
				// Got Changed settings for a different room
				// TODO: handle Error
				console.log(`Cannot change settings from a different room`);
				return;
			}

			// Only replace maxPlayerCount and isPrivate, not password
			const { maxPlayerCount, isPrivate } = roomEvent.room;
			setSettings((prevSettings) => {
				return {
					...prevSettings,
					isPrivate,
					maxPlayerCount,
				};
			});
		},
		[roomId]
	);

	useEffect(() => {
		socket.on("ROOM", roomEventsListener);
		socket.on("ERROR", errorListener);

		return () => {
			socket.off("ROOM", roomEventsListener);
			socket.off("ERROR", errorListener);
		};
	}, [errorListener, roomEventsListener, socket]);

	const changeSetting = (roomSetting: RoomSettingType) => {
		switch (roomSetting.setting) {
			case "isPrivate":
				setSettings((prevSettings) => ({
					...prevSettings,
					password: roomSetting.value.isPrivate ? roomSetting.value.password : null,
				}));
            case "maxPlayerCount": // Do nothing
                break;
			case "currPlayerCount": // changing current player count does not happen here
			default:
                // Don't emit Change setting event
				return;
		}

		socket.emit("ROOM", { type: "CHANGE_ROOM_SETTING", setting: roomSetting });
	};

	const value = {
		nickname,
		isReady,
		settings,
		setNickname,
		setIsReady,
		changeSetting,
	};

	return (
		<LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
	);
};
