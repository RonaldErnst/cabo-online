import { RoomClientData } from "@common/types/models/room.model";
import { getAllRooms, getRoom } from "@services/rooms.service";
import { RequestHandler } from "express";
import transformRoomClientData from "utils/transformRoomClientData";

const handleGetAllRooms: RequestHandler<{}, RoomClientData[]> = async (
	req,
	res,
	next
) => {
	const rooms = getAllRooms();
	res.status(200).json(transformRoomClientData(rooms));
};

const handleGetSingleRoom: RequestHandler<{}, RoomClientData | null, {}, {roomId: string}> = async (
	req,
	res,
	next
) => {
    const { roomId } = req.query;
    const room = getRoom(roomId);

    res.status(200).json(room? transformRoomClientData(room) : null);
};

export { handleGetAllRooms, handleGetSingleRoom };
