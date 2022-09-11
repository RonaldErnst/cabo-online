import { handleGetAllRooms, handleGetSingleRoom } from "@api/controllers";
import express from "express";

const roomRouter = express.Router();

roomRouter.get("/rooms", handleGetAllRooms);
roomRouter.get("/room", handleGetSingleRoom);

export default roomRouter;
