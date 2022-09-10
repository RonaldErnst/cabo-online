import { getAllRooms } from "@services/rooms.service";
import { RequestHandler } from "express";

const handleGetAllRooms: RequestHandler = async (req, res, next) => {
    res.status(200).json(getAllRooms());
}

export {
    handleGetAllRooms
}