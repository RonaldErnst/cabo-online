import express from "express";
import { createServer } from "http";
import { Server, ServerOptions } from "socket.io";
import {
	ClientServerEvents,
	ServerClientEvents,
	ServerServerEvents,
	SocketData,
} from "@common/types/sockets";
import { registerChatEvents, registerRoomEvents } from "@routes/sockets";
import settings from "./settings.backend";
import { createAndAddPlayer } from "@services/player.service";

// Server Settings
const PORT = settings.port;
const PING_INTERVAL = settings.pingInterval;
const PING_TIMEOUT = settings.pingTimeout;
const serverSettings: Partial<ServerOptions> = {
	pingInterval: PING_INTERVAL,
	pingTimeout: PING_TIMEOUT,
};

const app = express();
const httpServer = createServer(app);
const socketIO = new Server<
	ClientServerEvents,
	ServerClientEvents,
	ServerServerEvents,
	SocketData
>(httpServer, serverSettings);

socketIO.on("connection", async (socket) => {
	// LoggerService.log("Connected", `"Socket connected - ${socket.id}"`);
    const player = createAndAddPlayer(socket);
	registerRoomEvents(player);
	registerChatEvents(player);
});

httpServer.listen(PORT, () => {
	console.log(`App listening on Port ${PORT}`);
});

export default socketIO;