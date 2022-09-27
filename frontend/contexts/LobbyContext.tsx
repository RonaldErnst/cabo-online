import { IError } from "@common/types/errors";
import { PlayerClientData } from "@common/types/models/player.model";
import { RoomClientData, RoomSettings } from "@common/types/models/room.model";
import { ChangePlayerSetting, ChangeRoomSetting } from "@common/types/sockets";
import debounce from "lodash.debounce";
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useRooms } from "./RoomsContext";
import { useSocket } from "./SocketContext";

interface ILobbyContext {
	player: PlayerClientData | undefined;
	lobby: RoomClientData | undefined;
	roomSettings: RoomSettings;
    password: string | null;
    getPlayer: (playerId: string) => PlayerClientData | undefined;
	changeRoomSetting: (roomSetting: ChangeRoomSetting) => void;
    changePlayerSetting: (playerSetting: ChangePlayerSetting) => void;
}

const LobbyContext = createContext<ILobbyContext | null>(null);

export function useLobby() {
	const ctx = useContext(LobbyContext);

	if (ctx === null) throw new Error("Lobby Context not initialized yet");

	return ctx;
}

interface Props {
	roomId: string;
	defaultRoomSettings: RoomSettings;
    password: string | null;
}

export const LobbyProvider: FC<PropsWithChildren<Props>> = ({
	children,
	roomId,
	defaultRoomSettings,
    password
}) => {
	const socket = useSocket();
	const rooms = useRooms();
	const lobby = useMemo(
		() => rooms.find((r) => r.roomId === roomId),
		[rooms, roomId]
	);
	const player = useMemo(
		() => lobby?.players.find((p) => p.playerId === socket.id),
		[lobby, socket]
	);

	// Host only
	const [roomSettings, setRoomSettings] = useState<RoomSettings>(defaultRoomSettings);

	const errorEventsListener = useCallback((err: IError) => {
		// TODO: display error as system message in Lobby
		console.log(err);
	}, []);

	useEffect(() => {
		socket.on("ERROR", errorEventsListener);

		return () => {
			socket.off("ERROR", errorEventsListener);
		};
	}, [errorEventsListener, socket]);

	const changeRoomSetting = debounce(useCallback((roomSetting: ChangeRoomSetting) => {
		switch (roomSetting.setting) {
			case "isPrivate":
				// Only set password locally for host#
				// TODO: transfer password when host changes
				setRoomSettings((prevSettings) => ({
					...prevSettings,
					password: roomSetting.value.isPrivate
						? roomSetting.value.password
						: null,
				}));
			case "maxPlayerCount": // Do nothing
				break;
			default:
				// Don't emit Change setting event
				return;
		}

		socket.emit("ROOM", {
			type: "CHANGE_ROOM_SETTING",
			setting: roomSetting,
		});
	}, [socket]), 500);

    const changePlayerSetting = debounce(useCallback((playerSetting: ChangePlayerSetting) => {
        switch(playerSetting.setting) {
            case "isReady": // Do nothing
                break;
            case "nickname": // Do nothing
                break;
            case "color": // Do nothing
                break;
            default:
				// Don't emit Change setting event
                return;
        }

        socket.emit("ROOM", {type: "CHANGE_ROOM_PLAYER", setting: playerSetting})
    }, [socket]), 500);

    const getPlayer = (playerId: string) => {
        return lobby?.players.find(p => p.playerId === playerId);
    }

	const value = {
		player,
		lobby,
		roomSettings,
        password,
        getPlayer,
		changeRoomSetting,
        changePlayerSetting,
	};

	return (
		<LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
	);
};
