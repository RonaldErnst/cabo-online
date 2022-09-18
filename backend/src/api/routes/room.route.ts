import { handleGetAllRooms, handleGetSingleRoom, handleCheckPassword, handleGetDefaultSettings } from "@api/controllers";
import express from "express";

const roomRouter = express.Router();

roomRouter.get("/rooms", handleGetAllRooms);
roomRouter.get("/room", handleGetSingleRoom);
roomRouter.get("/checkPassword", handleCheckPassword);
roomRouter.get("/getDefaultSettings", handleGetDefaultSettings);

export default roomRouter;
