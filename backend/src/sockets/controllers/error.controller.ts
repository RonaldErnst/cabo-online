import { Player } from "@common/types/models/player.model";
import { IServerSocket } from "@types";

export default function handleErrorEvents(socket: IServerSocket) {
    return (err: Error) => {
        // TODO: error Handling
    }
}
