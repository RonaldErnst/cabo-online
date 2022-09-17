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

	const roomEventListener = useCallback((roomEvent: RoomServerClientEvent) => {
        console.log("Received room event");

		switch (roomEvent.type) {
			case "CREATE_ROOM": // A room got created, add to room list
				console.log(`Room ${roomEvent.room.roomId} got created`);
				setRooms((prevRooms) => {
					return [...prevRooms, roomEvent.room];
				});
				break;

			case "CHANGE_ROOM": // A rooms settings got changed, display new settings
				console.log(`Room ${roomEvent.room.roomId} changed`);
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
				console.log(`Room ${roomEvent.roomId} was removed`);
				setRooms((prevRooms) => {
					return prevRooms.filter(
						(r) => r.roomId != roomEvent.roomId
					);
				});
				break;

			case "JOIN_ROOM": // A player joined a room, update room
				console.log(`A player joined room ${roomEvent.roomId}`);
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
				console.log(`A player left room ${roomEvent.roomId}`);
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
				console.log(`Unknown Room Event`);
		}
	}, []);

	useEffect(() => {
        console.log("Setting up room event listener");
		socket.on("ROOM", roomEventListener);

		return () => {
            console.log("Tearing down room event listener");
			socket.off("ROOM", roomEventListener);
		};
	}, [socket, roomEventListener]);

	return (
		<RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
	);
};
