import { RoomClientData } from "@common/types/models/room.model";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

const RoomsContext = createContext<RoomClientData[]>([]);

export function useRooms() {
	const ctx = useContext(RoomsContext);

	// if(ctx === null)
	//     throw new Error("Socket Context not initialized yet");

	return ctx;
}

export const RoomsProvider: FC<PropsWithChildren<{initialRooms: RoomClientData[]}>> = ({ children, initialRooms }) => {
    const socket = useSocket();
    const [rooms, setRooms] = useState<RoomClientData[]>(initialRooms);

    const createRoomListener = useCallback((room: RoomClientData) => {
        setRooms((prevRooms) => {
            return [...prevRooms, room];
        });
    }, []);

    const deleteRoomListener = useCallback((roomId: string) => {
        setRooms((prevRooms) => {
            return prevRooms.filter((r) => {
                return r.roomId != roomId;
            });
        });
    }, []);

    useEffect(() => {
      socket.on("CREATE_ROOM", createRoomListener);
      socket.on("DELETE_ROOM", deleteRoomListener);
    
      return () => {
        socket.off("CREATE_ROOM", createRoomListener);
        socket.off("DELETE_ROOM", deleteRoomListener);
      }
    }, [socket, createRoomListener, deleteRoomListener])
    

	return (
		<RoomsContext.Provider value={rooms}>
			{children}
		</RoomsContext.Provider>
	);
};
