import { IError } from "@common/types/errors";
import { PlayerClientData } from "@common/types/models/player.model";
import { RoomSettings } from "@common/types/models/room.model";
import { PlayerServerClientEvent } from "@common/types/sockets";
import {
	ChangeRoomSetting,
	RoomServerClientEvent,
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
import generateNickname from "utils/generateNickname";
import { useSocket } from "./SocketContext";

interface ILobbyContext {
	nickname: string;
	isReady: boolean;
	settings: RoomSettings;
    lobbyHost: string | null;
    players: PlayerClientData[];
	setNickname: Dispatch<SetStateAction<string>>;
	setIsReady: Dispatch<SetStateAction<boolean>>;
	changeSetting: (roomSetting: ChangeRoomSetting) => void;
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
	console.log("Creating Lobby Provider");
	const [nickname, setNickname] = useState(generateNickname());
	const [isReady, setIsReady] = useState(false);

	const [settings, setSettings] = useState<RoomSettings>(defaultSettings);
	const [lobbyHost, setLobbyHost] = useState<string | null>(null);
    const [players, setPlayers] = useState<PlayerClientData[]>([]);

	const socket = useSocket();

	const errorEventsListener = useCallback((err: IError) => {
		// TODO: display error as system message in Lobby
		console.log(err);
	}, []);

	const roomEventsListener = useCallback(
		(roomEvent: RoomServerClientEvent) => {
			// Only Change room events matter here
			if (roomEvent.type !== "CHANGE_ROOM") return;

			// Sanity check, roomId should be the current room's id
			if (roomEvent.room.roomId !== roomId) {
				// Received CHANGE_ROOM from a different room
				//console.log(`Cannot change settings from a different room`);
				return;
			}

			// Only replace maxPlayerCount and isPrivate, not password
			const { maxPlayerCount, isPrivate, host } = roomEvent.room;
			setSettings((prevSettings) => {
				return {
					...prevSettings,
                    lobbyHost: host,
					isPrivate,
					maxPlayerCount,
				};
			});
		},
		[roomId]
	);

    const playerEventsListener = useCallback((playerEvent: PlayerServerClientEvent) => {

    }, []);

	useEffect(() => {
		socket.on("ROOM", roomEventsListener);
        socket.on("PLAYER", playerEventsListener);
		socket.on("ERROR", errorEventsListener);

		return () => {
			socket.off("ROOM", roomEventsListener);
            socket.off("PLAYER", playerEventsListener);
			socket.off("ERROR", errorEventsListener);
		};
	}, [errorEventsListener, playerEventsListener, roomEventsListener, socket]);

	const changeSetting = (roomSetting: ChangeRoomSetting) => {
		switch (roomSetting.setting) {
			case "isPrivate":
				setSettings((prevSettings) => ({
					...prevSettings,
					password: roomSetting.value.isPrivate
						? roomSetting.value.password
						: null,
				}));
			case "maxPlayerCount": // Do nothing
				break;
			case "currPlayerCount": // changing current player count does not happen here
			default:
				// Don't emit Change setting event
				return;
		}

		socket.emit("ROOM", {
			type: "CHANGE_ROOM_SETTING",
			setting: roomSetting,
		});
	};

	const value = {
		nickname,
		isReady,
		settings,
        lobbyHost,
        players,
		setNickname,
		setIsReady,
		changeSetting,
	};

	return (
		<LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
	);
};
