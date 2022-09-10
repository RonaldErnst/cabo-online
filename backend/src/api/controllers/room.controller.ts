import { RoomClientData } from "@common/types/models/room.model";
import { getAllRooms, transformRoomClientData } from "@services/rooms.service";
import { RequestHandler } from "express";

const handleGetAllRooms: RequestHandler<{}, RoomClientData[], {}> = async (
  req,
  res,
  next
) => {
  const rooms = getAllRooms();
  res.status(200).json(transformRoomClientData(rooms));
};

export { handleGetAllRooms };
