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
} from "@sockets/routes";
import { roomRouter } from "@api/routes";
import { createAndAddPlayer } from "@services/player.service";
import settings from "./settings.backend";

// Server Settings
const PORT = settings.port;
const PING_INTERVAL = settings.pingInterval;
const PING_TIMEOUT = settings.pingTimeout;
const serverSettings: Partial<ServerOptions> = {
  pingInterval: PING_INTERVAL,
  pingTimeout: PING_TIMEOUT,
  cors: {
    origin: ["*"], // TODO
    credentials: true,
  },
  transports: ["websocket"],
};

const app = express();
const httpServer = createServer(app);

app.use(roomRouter);

const socketIO = new Server<
  ClientServerEvents,
  ServerClientEvents,
  ServerServerEvents,
  SocketData
>(httpServer, serverSettings);

socketIO.on("connection", async (socket) => {
  // LoggerService.log("Connected", `"Socket connected - ${socket.id}"`);
  createAndAddPlayer(socket).match(
    (player) => {
      registerRoomEvents(player, socket);
      registerChatEvents(player, socket);
      registerErrorEvents(player, socket);
      registerDisconnectEvents(player, socket);
    },
    (err) => {
      socket.emit("ERROR", err);
      socket.disconnect(true);
    }
  );
});

httpServer.listen(PORT, () => {
  console.log(`App listening on Port ${PORT}`);
});

export default socketIO;
