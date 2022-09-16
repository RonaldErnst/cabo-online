import { handleGetAllRooms, handleGetSingleRoom, handleCheckPassword } from "@api/controllers";
import express from "express";

const roomRouter = express.Router();

roomRouter.get("/rooms", handleGetAllRooms);
roomRouter.get("/room", handleGetSingleRoom);
roomRouter.get("/checkPassword", handleCheckPassword);

export default roomRouter;
