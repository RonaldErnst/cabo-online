import { Player } from "@common/types/models/player.model";
import { getExistingPlayer } from "@services/player.service";
import { leaveRoom } from "@services/rooms.service";
import { IServerSocket } from "@types";
import socketIO from "app";
import transformRoomClientData from "utils/transformRoomClientData";

export default function handleDisconnectEvents(
	socket: IServerSocket
) {
	return (reason: string) => {
        getExistingPlayer(socket.id).match(player => {
            // Leave room if player was in room
            if (player.room !== null) {
                leaveRoom(player).match(
                    (room) => {
                        console.log(
                            `Player ${player.playerId} left room ${room.roomId}`
                        );

                        socketIO.emit("ROOM", {
                            type: "CHANGE_ROOM",
                            room: transformRoomClientData(room),
                        });
                    },
                    (err) => {
                        console.log(err);
                        socket.emit("ERROR", err);
                    }
                );
            }

            console.log(
                `Player ${player.playerId} is trying to disconnect`,
                `Reason: ${reason}`
            );
        }, err => {
            console.log(err);
            socket.emit("ERROR", err);
        })
	};
}
