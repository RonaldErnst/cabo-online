import express from "express";
import { createServer } from "http";
import { Server, ServerOptions } from "socket.io";
import {
	ClientServerEvents,
	ServerClientEvents,
	ServerServerEvents,
	SocketData,
} from "@common/types/sockets";
import {
	registerChatEvents,
	registerRoomEvents,
	registerErrorEvents,
	registerDisconnectEvents,
    registerPlayerEvents,
} from "@sockets/routes";
import { roomRouter } from "@api/routes";
import { createAndAddPlayer } from "@services/player.service";
import settings from "./settings.backend";
import cors from "cors";

// Server Settings
const PORT = settings.port;
const PING_INTERVAL = settings.pingInterval;
const PING_TIMEOUT = settings.pingTimeout;
const serverSettings: Partial<ServerOptions> = {
	pingInterval: PING_INTERVAL,
	pingTimeout: PING_TIMEOUT,
	cors: {
		origin: ["http://localhost:3000", "http://192.168.178.37:3000", "http://yourapp.com"], // TODO
		credentials: true,
	},
	transports: ["websocket"],
};

const app = express();
const httpServer = createServer(app);

var allowedOrigins = [
	"http://localhost:3000", // TODO
    "http://192.168.178.37:3000",
	"http://yourapp.com",
];
app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);

			if (!allowedOrigins.includes(origin)) {
				var msg =
					"The CORS policy for this site does not allow access from the specified Origin.";
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
	})
);
app.use(roomRouter);

const socketIO = new Server<
	ClientServerEvents,
	ServerClientEvents,
	ServerServerEvents,
	SocketData
>(httpServer, serverSettings);

socketIO.on("connection", async (socket) => {
    registerRoomEvents(socket);
    registerPlayerEvents(socket);
    registerChatEvents(socket);
    registerErrorEvents(socket);
    registerDisconnectEvents(socket);
});

httpServer.listen(PORT, () => {
	console.log(`App listening on Port ${PORT}`);
});

export default socketIO;
