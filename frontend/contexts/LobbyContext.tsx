import { IError } from "@common/types/errors";
import { RoomClientData, RoomSettings } from "@common/types/models/room.model";
import { ChangeRoomSetting } from "@common/types/sockets";
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
	lobby: RoomClientData | undefined;
	settings: RoomSettings;
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
	const socket = useSocket();
	const rooms = useRooms();
	const lobby = useMemo(
		() => rooms.find((r) => r.roomId === roomId),
		[rooms, roomId]
	);

	// Host only
	const [settings, setSettings] = useState<RoomSettings>(defaultSettings);

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

	const changeSetting = (roomSetting: ChangeRoomSetting) => {
		switch (roomSetting.setting) {
			case "isPrivate":
				// Only set password locally for host#
				// TODO: transfer password when host changes
				setSettings((prevSettings) => ({
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
	};

	const value = {
		lobby,
		settings,
		changeSetting,
	};

	return (
		<LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
	);
};
