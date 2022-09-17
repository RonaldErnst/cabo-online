import { RoomClientData } from "@common/types/models/room.model";
import { RoomServerClientEvent } from "@common/types/sockets";
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useSocket } from "./SocketContext";

const RoomsContext = createContext<RoomClientData[]>([]);

export function useRooms() {
	const ctx = useContext(RoomsContext);

	// if(ctx === null)
	//     throw new Error("Socket Context not initialized yet");

	return ctx;
}

export const RoomsProvider: FC<
	PropsWithChildren<{ initialRooms: RoomClientData[] }>
> = ({ children, initialRooms }) => {
	const socket = useSocket();
	const [rooms, setRooms] = useState<RoomClientData[]>(initialRooms);

	const roomListener = useCallback((roomEvent: RoomServerClientEvent) => {
		switch (roomEvent.type) {
			case "CREATE_ROOM": // A room got created, add to room list
				setRooms((prevRooms) => {
					return [...prevRooms, roomEvent.room];
				});
				break;

			case "CHANGE_ROOM": // A rooms settings got changed, display new settings
				setRooms((prevRooms) => {
					const updRooms = [...prevRooms];
					updRooms.map((r) => {
						if (r.roomId === roomEvent.room.roomId)
							return roomEvent.room;
						else return r;
					});
					return updRooms;
				});
				break;

			case "DELETE_ROOM": // A room got deleted, remove from room list
				setRooms((prevRooms) => {
					return prevRooms.filter(
						(r) => r.roomId != roomEvent.roomId
					);
				});
				break;

			case "JOIN_ROOM": // A player joined a room, update room
				setRooms((prevRooms) => {
					const updRooms = [...prevRooms];
					updRooms.map((r) => {
						if (r.roomId !== roomEvent.roomId) return r;

						return { ...r, currPlayerCount: r.currPlayerCount + 1 };
					});
					return updRooms;
				});
				break;

			case "LEAVE_ROOM": // A player left a room, update room
				setRooms((prevRooms) => {
					const updRooms = [...prevRooms];
					updRooms.map((r) => {
						if (r.roomId !== roomEvent.roomId) return r;

						return { ...r, currPlayerCount: r.currPlayerCount - 1 };
					});

					return updRooms;
				});
				break;

			default:
			// TODO: handle Error?
		}
	}, []);

	useEffect(() => {
		socket.on("ROOM", roomListener);

		return () => {
			socket.off("ROOM", roomListener);
		};
	}, [socket, roomListener]);

	return (
		<RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
	);
};
