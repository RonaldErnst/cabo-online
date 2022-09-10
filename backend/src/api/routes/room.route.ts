import express, { Router } from "express";

const roomRouter = express.Router();

roomRouter.get("/rooms", handleGetAllRooms);
//roomRouter.get("/room", handleGetSingleRoom);

export default roomRouter;