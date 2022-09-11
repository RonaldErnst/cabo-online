import { IError } from "@common/types/errors";
import { Player } from "@common/types/models/player.model";
import {
  Room,
  RoomClientData,
  RoomOptions,
} from "@common/types/models/room.model";
import socketIO from "app";
import { err, ok, Result } from "neverthrow";

const rooms = new Map<string, Room>();

function existsRoom(roomId: string) {
  return rooms.has(roomId);
}

function addRoom(room: Room) {
  rooms.set(room.roomId, room);
}

function getRoom(roomId: string) {
  return rooms.get(roomId);
}

function getAllRooms() {
  return Array.from(rooms.values());
}

function createAndAddRoom(
  roomId: string,
  options: RoomOptions = {
    isPrivate: false,
    maxPlayerCount: 10,
    password: null,
  }
): Result<Room, IError> {
  if (existsRoom(roomId))
    return err({
      type: "RoomAlreadyExistsError",
      message: `Room ${roomId} already exists`,
    });

  const room: Room = {
    roomId,
    host: null,
    playerSockets: new Array(),
    options,
  };

  addRoom(room);

  return ok(room);
}

function joinRoom(roomId: string, player: Player): Result<null, IError> {
  const room = getRoom(roomId);
  if (room === undefined)
    return err({
      type: "UnknownRoomError",
      message: `Room ${roomId} does not exist`,
    });

  room.playerSockets.push(player);
  player.socket.join(roomId);
  player.room = room;

  return ok(null);
}

export { createAndAddRoom, joinRoom, getRoom, getAllRooms };
